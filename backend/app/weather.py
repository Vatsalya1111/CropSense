"""Open-Meteo client and normalization to the frontend weather contract."""

from __future__ import annotations

from datetime import date, datetime, timezone
import json
import urllib.error
import urllib.parse
import urllib.request

from .data import FARM

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def _request_weather() -> dict:
    params = {
        "latitude": FARM["location"]["lat"],
        "longitude": FARM["location"]["lng"],
        "current": ",".join(
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "showers",
                "weather_code",
                "wind_speed_10m",
            ]
        ),
        "daily": ",".join(
            [
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "precipitation_sum",
                "weather_code",
            ]
        ),
        "timezone": "auto",
        "forecast_days": 5,
    }
    request = urllib.request.Request(
        f"{OPEN_METEO_URL}?{urllib.parse.urlencode(params)}",
        headers={"User-Agent": "CropSense/1.0"},
    )
    with urllib.request.urlopen(request, timeout=8) as response:
        return json.loads(response.read().decode("utf-8"))


def _number(value, default=0.0) -> float:
    if value is None:
        return default
    result = float(value)
    if result != result or result in (float("inf"), float("-inf")):
        return default
    return result


def _weather_description(code: int) -> tuple[str, str]:
    if code == 0:
        return "Clear sky", "Sun"
    if code in (1, 2):
        return "Partly cloudy", "CloudSun"
    if code == 3:
        return "Overcast", "Cloud"
    if code in (45, 48):
        return "Fog", "Cloud"
    if code in (51, 53, 55, 56, 57):
        return "Drizzle", "CloudRain"
    if code in (61, 63, 65, 66, 67, 80, 81, 82):
        return "Rain showers", "CloudRain"
    if code in (71, 73, 75, 77, 85, 86):
        return "Snow", "Cloud"
    if code in (95, 96, 99):
        return "Thunderstorm", "CloudLightning"
    return "Variable conditions", "CloudSun"


def normalize_weather(payload: dict) -> dict:
    current = payload["current"]
    daily = payload["daily"]
    code = int(_number(current.get("weather_code")))
    condition, icon = _weather_description(code)
    current_rain = _number(current.get("precipitation"))
    today_probability = _number((daily.get("precipitation_probability_max") or [0])[0])
    today_code = int(_number((daily.get("weather_code") or [code])[0]))
    today_condition, _ = _weather_description(today_code)
    dates = daily["time"]
    today = date.fromisoformat(dates[0])

    forecast = []
    for index, forecast_date in enumerate(dates):
        day = date.fromisoformat(forecast_date)
        forecast_condition, forecast_icon = _weather_description(
            int(_number((daily.get("weather_code") or [0] * len(dates))[index]))
        )
        forecast.append(
            {
                "date": forecast_date,
                "dayName": "Today" if day == today else "Tomorrow" if day == date.fromordinal(today.toordinal() + 1) else day.strftime("%A"),
                "tempMax": round(_number(daily["temperature_2m_max"][index]), 1),
                "tempMin": round(_number(daily["temperature_2m_min"][index]), 1),
                "weatherCondition": forecast_condition,
                "rainProbability": round(_number((daily.get("precipitation_probability_max") or [0] * len(dates))[index])),
                "expectedRainfall": round(_number(daily["precipitation_sum"][index]), 1),
                "icon": forecast_icon,
            }
        )

    feels_like = _number(current.get("apparent_temperature"), _number(current.get("temperature_2m")))
    return {
        "current": {
            "temperature": round(_number(current.get("temperature_2m")), 1),
            "weatherCondition": condition,
            "humidity": round(_number(current.get("relative_humidity_2m"))),
            "rainProbability": round(today_probability),
            "windSpeed": round(_number(current.get("wind_speed_10m")), 1),
            "rainfall": round(current_rain, 1),
            "feelsLike": round(feels_like, 1),
            "icon": icon,
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
        },
        "forecast": forecast,
        "dataSource": "Open-Meteo",
        "isFallback": False,
    }


def fallback_weather() -> dict:
    """Generate current-dated sample weather so fallback dates do not go stale."""
    today = date.today()
    current = {
        "temperature": 28.0,
        "weatherCondition": "Partly cloudy",
        "humidity": 62,
        "rainProbability": 20,
        "windSpeed": 10.0,
        "rainfall": 0.0,
        "feelsLike": 29.0,
        "icon": "CloudSun",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
    }
    forecast = [
        {
            "date": (today.fromordinal(today.toordinal() + offset)).isoformat(),
            "dayName": "Today" if offset == 0 else "Tomorrow" if offset == 1 else today.fromordinal(today.toordinal() + offset).strftime("%A"),
            "tempMax": 30.0 + (offset % 2),
            "tempMin": 21.0,
            "weatherCondition": "Partly cloudy",
            "rainProbability": 20,
            "expectedRainfall": 0.0,
            "icon": "CloudSun",
        }
        for offset in range(5)
    ]
    return {
        "current": current,
        "forecast": forecast,
        "dataSource": "Sample fallback",
        "isFallback": True,
    }


def get_weather() -> dict:
    try:
        result = normalize_weather(_request_weather())
        # Fail over when a provider response is incomplete or unusable.
        if not result["forecast"] or result["current"]["temperature"] is None:
            raise ValueError("Open-Meteo returned incomplete weather data")
        return result
    except (
        OSError,
        TimeoutError,
        urllib.error.URLError,
        ValueError,
        KeyError,
        TypeError,
        IndexError,
        OverflowError,
        json.JSONDecodeError,
    ):
        return fallback_weather()
