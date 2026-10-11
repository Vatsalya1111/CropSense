"""Provisional, explicit thresholds for the transparent advisory baseline."""

from __future__ import annotations

from typing import TypedDict


class CropThresholds(TypedDict):
    """Thresholds currently used by the rule-based crop advisory."""

    soil_moisture_irrigate_below: float
    soil_moisture_stress_below: float
    heat_stress_temperature: float
    severe_heat_temperature: float
    wet_weather_humidity: float
    wet_weather_rainfall_mm: float
    irrigation_rainfall_mm: float
    irrigation_rain_probability: float


# These values preserve the old generic baseline; they are not crop-calibrated.
# Explicit crop/stage entries make that limitation visible and easy to replace
# when suitable local agronomic evidence is available.
DEFAULT_THRESHOLDS: CropThresholds = {
    "soil_moisture_irrigate_below": 25,
    "soil_moisture_stress_below": 35,
    "heat_stress_temperature": 32,
    "severe_heat_temperature": 35,
    "wet_weather_humidity": 85,
    "wet_weather_rainfall_mm": 10,
    "irrigation_rainfall_mm": 10,
    "irrigation_rain_probability": 50,
}

CROP_THRESHOLDS: dict[tuple[str, str], CropThresholds] = {
    ("ragi", "vegetative"): DEFAULT_THRESHOLDS,
}


def get_crop_thresholds(crop: str, crop_stage: str) -> CropThresholds:
    """Return configured crop/stage thresholds, falling back to the baseline."""
    key = (crop.strip().casefold(), crop_stage.strip().casefold())
    return CROP_THRESHOLDS.get(key, DEFAULT_THRESHOLDS)
