"""Apply an optional trained weather correction model to normalized forecasts."""

from __future__ import annotations

from copy import deepcopy
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

from .features import build_features

MODEL_VERSION = "cropsense-weather-v1"
DEFAULT_ARTIFACT_PATH = Path(__file__).parent / "artifacts" / "weather_model.joblib"


@lru_cache(maxsize=1)
def _load_model(artifact_path: str) -> dict | None:
    """Load once per process; an absent or invalid artifact means no correction."""
    try:
        artifact = joblib.load(artifact_path)
        if (
            not isinstance(artifact, dict)
            or artifact.get("version") != MODEL_VERSION
            or "temperature" not in artifact
            or "rain" not in artifact
        ):
            return None
        return artifact
    except Exception:
        # Inference is optional. Keep the reliable provider forecast on any model failure.
        return None


def refine_weather(
    weather: dict,
    farm: dict,
    artifact_path: Path = DEFAULT_ARTIFACT_PATH,
) -> dict:
    """Correct supported forecast fields, returning input unchanged on any failure."""
    if weather.get("isFallback") or not weather.get("forecast"):
        return weather

    model = _load_model(str(artifact_path))
    if model is None:
        return weather

    try:
        location = farm["location"]
        rows = pd.DataFrame(
            [
                {
                    "date": day["date"],
                    "latitude": location["lat"],
                    "longitude": location["lng"],
                    "elevation_m": location["elevationM"],
                    "forecast_lead_days": lead,
                    "forecast_temp_max_c": day["tempMax"],
                    "forecast_temp_min_c": day["tempMin"],
                    "forecast_precipitation_mm": day["expectedRainfall"],
                }
                for lead, day in enumerate(weather["forecast"])
            ]
        )
        features = build_features(rows)
        temperature_residuals = model["temperature"].predict(features)
        rain_probability = model["rain"].predict_proba(features)[:, 1]
        if len(temperature_residuals) != len(weather["forecast"]) or len(rain_probability) != len(weather["forecast"]):
            return weather

        result = deepcopy(weather)
        for index, day in enumerate(result["forecast"]):
            day["tempMax"] = round(float(day["tempMax"]) + float(temperature_residuals[index][0]), 1)
            day["tempMin"] = round(float(day["tempMin"]) + float(temperature_residuals[index][1]), 1)
            # This classifier estimates the chance of a >=2.5 mm rainy day.
            day["rainProbability"] = round(float(rain_probability[index]) * 100)
        result["dataSource"] = f"{weather.get('dataSource', 'Weather provider')} + CropSense model"
        result["modelVersion"] = MODEL_VERSION
        result["correctionApplied"] = True
        result["correctedFields"] = ["tempMax", "tempMin", "rainProbability"]
        return result
    except Exception:
        # Missing fields, incompatible artifacts, and inference errors all preserve raw inputs.
        return weather
