"""Fetch archived Karnataka forecasts and gridded targets into the training CSV."""

from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import time
from typing import Any
import urllib.error
import urllib.parse
import urllib.request


FORECAST_URL = "https://previous-runs-api.open-meteo.com/v1/forecast"
TRUTH_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
DEFAULT_START_DATE = "2024-01-01"
DEFAULT_END_DATE = "2025-12-31"
DEFAULT_OUTPUT = Path(__file__).parent / "data" / "prepared_weather.csv"
LEADS = range(5)

# Representative locations are used for leave-one-location-out evaluation.
LOCATIONS = (
    {"id": "srirangapatna_mandya", "latitude": 12.4228, "longitude": 76.6844},
    {"id": "mysuru", "latitude": 12.2958, "longitude": 76.6394},
    {"id": "bengaluru", "latitude": 12.9716, "longitude": 77.5946},
    {"id": "hassan", "latitude": 13.0033, "longitude": 76.1004},
)
ASIA_KOLKATA = timezone(timedelta(hours=5, minutes=30))


def _get_json(url: str, params: dict[str, Any]) -> dict:
    request_url = f"{url}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(
        request_url,
        headers={"User-Agent": "CropSense/1.0 (historical model training)"},
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if "error" in payload:
                raise ValueError(payload.get("reason", "API returned an error"))
            return payload
        except (OSError, TimeoutError, urllib.error.URLError, json.JSONDecodeError):
            if attempt == 2:
                raise
            time.sleep(2**attempt)
    raise RuntimeError("API request retries exhausted")


def _forecast_variables() -> list[str]:
    variables = []
    for lead in LEADS:
        suffix = f"_previous_day{lead}" if lead else ""
        variables.extend(
            [
                f"temperature_2m{suffix}",
                f"precipitation{suffix}",
            ]
        )
    return variables


def _daily_forecasts(payload: dict) -> dict[tuple[str, int], dict[str, float]]:
    hourly = payload.get("hourly", {})
    dates = hourly.get("time", [])
    daily: dict[tuple[str, int], dict[str, list[float]]] = {}
    for lead in LEADS:
        suffix = f"_previous_day{lead}" if lead else ""
        names = {
            "temperature": f"temperature_2m{suffix}",
            "precipitation": f"precipitation{suffix}",
        }
        values = {key: hourly.get(name, []) for key, name in names.items()}
        for index, timestamp in enumerate(dates):
            row_values = [series[index] if index < len(series) else None for series in values.values()]
            if any(value is None for value in row_values):
                continue
            local_timestamp = datetime.fromisoformat(timestamp)
            temperature_key = (local_timestamp.date().isoformat(), lead)
            temperature_bucket = daily.setdefault(temperature_key, {"temperature": [], "precipitation": []})
            temperature_bucket["temperature"].append(float(values["temperature"][index]))

            # Open-Meteo precipitation is the sum for the preceding hour.
            precipitation_key = ((local_timestamp - timedelta(hours=1)).date().isoformat(), lead)
            precipitation_bucket = daily.setdefault(
                precipitation_key,
                {"temperature": [], "precipitation": []},
            )
            precipitation_bucket["precipitation"].append(float(values["precipitation"][index]))

    return {
        key: {
            "forecast_temp_max_c": max(values["temperature"]),
            "forecast_temp_min_c": min(values["temperature"]),
            "forecast_precipitation_mm": sum(values["precipitation"]),
        }
        for key, values in daily.items()
        if len(values["temperature"]) == 24
        and len(values["precipitation"]) == 24
    }


def _power_date_to_local_date(day_key: str) -> str:
    """Convert a NASA POWER UTC daily label to an Asia/Kolkata calendar date."""
    utc_timestamp = datetime.strptime(day_key, "%Y%m%d").replace(tzinfo=timezone.utc)
    return utc_timestamp.astimezone(ASIA_KOLKATA).date().isoformat()


def _observations(payload: dict) -> dict[str, dict[str, float]]:
    parameters = payload.get("properties", {}).get("parameter", {})
    series = {
        name: parameters.get(name, {})
        for name in ("T2M_MAX", "T2M_MIN", "PRECTOTCORR")
    }
    observed = {}
    for day_key in set.intersection(*(set(values) for values in series.values())):
        values = {name: float(value) for name, data in series.items() if (value := data[day_key]) not in (None, -999)}
        if len(values) != 3:
            continue
        day = _power_date_to_local_date(day_key)
        observed[day] = {
            "observed_temp_max_c": values["T2M_MAX"],
            "observed_temp_min_c": values["T2M_MIN"],
            "observed_precipitation_mm": values["PRECTOTCORR"],
        }
    return observed


def prepare_rows(start_date: str, end_date: str) -> list[dict[str, Any]]:
    """Fetch forecasts and proxy observations, then join them by site and date."""
    rows = []
    forecast_end_date = (date.fromisoformat(end_date) + timedelta(days=1)).isoformat()
    for location in LOCATIONS:
        coordinates = {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        }
        forecast_payload = _get_json(
            FORECAST_URL,
            {
                **coordinates,
                "hourly": ",".join(_forecast_variables()),
                "start_date": start_date,
                "end_date": forecast_end_date,
                "timezone": "Asia/Kolkata",
                "timeformat": "iso8601",
            },
        )
        observation_payload = _get_json(
            TRUTH_URL,
            {
                "parameters": "T2M_MAX,T2M_MIN,PRECTOTCORR",
                "community": "AG",
                "longitude": location["longitude"],
                "latitude": location["latitude"],
                "start": start_date.replace("-", ""),
                "end": end_date.replace("-", ""),
                "time-standard": "UTC",
                "format": "JSON",
            },
        )
        elevation = float(forecast_payload.get("elevation", 0))
        forecasts = _daily_forecasts(forecast_payload)
        observations = _observations(observation_payload)
        for (day, lead), forecast in forecasts.items():
            if not start_date <= day <= end_date:
                continue
            if day not in observations:
                continue
            rows.append(
                {
                    "date": day,
                    "location_id": location["id"],
                    "latitude": location["latitude"],
                    "longitude": location["longitude"],
                    "elevation_m": elevation,
                    "forecast_lead_days": lead,
                    **forecast,
                    **observations[day],
                }
            )
        print(f"{location['id']}: {sum(1 for row in rows if row['location_id'] == location['id'])} aligned samples")
    return sorted(rows, key=lambda row: (row["date"], row["location_id"], row["forecast_lead_days"]))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start-date", default=DEFAULT_START_DATE, help="Inclusive ISO date (default: 2024-01-01)")
    parser.add_argument("--end-date", default=DEFAULT_END_DATE, help="Inclusive ISO date (default: 2025-12-31)")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    start = date.fromisoformat(args.start_date)
    end = date.fromisoformat(args.end_date)
    if start > end:
        parser.error("--start-date must be on or before --end-date")

    rows = prepare_rows(start.isoformat(), end.isoformat())
    if not rows:
        raise SystemExit("No aligned samples returned; check API availability and date range.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    columns = [
        "date", "location_id", "latitude", "longitude", "elevation_m", "forecast_lead_days",
        "forecast_temp_max_c", "forecast_temp_min_c", "forecast_precipitation_mm",
        "observed_temp_max_c", "observed_temp_min_c",
        "observed_precipitation_mm",
    ]
    import csv

    with args.output.open("w", newline="", encoding="utf-8") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows for {len({row['location_id'] for row in rows})} locations to {args.output}")


if __name__ == "__main__":
    main()
