"""Shared feature builder used by offline training and live weather inference."""

from __future__ import annotations

import numpy as np
import pandas as pd


INPUT_COLUMNS = (
    "date",
    "latitude",
    "longitude",
    "elevation_m",
    "forecast_lead_days",
    "forecast_temp_max_c",
    "forecast_temp_min_c",
    "forecast_precipitation_mm",
)


def build_features(rows: pd.DataFrame) -> pd.DataFrame:
    """Build only values available when a forecast is served; no targets included."""
    missing = sorted(set(INPUT_COLUMNS) - set(rows.columns))
    if missing:
        raise ValueError(f"Missing feature columns: {', '.join(missing)}")

    dates = pd.to_datetime(rows["date"], errors="raise")
    day_of_year = dates.dt.dayofyear
    # Cyclical encoding keeps December and January close in the model input.
    return pd.DataFrame(
        {
            "latitude": rows["latitude"].astype(float),
            "longitude": rows["longitude"].astype(float),
            "elevation_m": rows["elevation_m"].astype(float),
            "forecast_lead_days": rows["forecast_lead_days"].astype(float),
            "forecast_temp_max_c": rows["forecast_temp_max_c"].astype(float),
            "forecast_temp_min_c": rows["forecast_temp_min_c"].astype(float),
            "forecast_precipitation_mm": rows["forecast_precipitation_mm"].astype(float),
            "day_of_year_sin": np.sin(2 * np.pi * day_of_year / 365.25),
            "day_of_year_cos": np.cos(2 * np.pi * day_of_year / 365.25),
        },
        index=rows.index,
    )
