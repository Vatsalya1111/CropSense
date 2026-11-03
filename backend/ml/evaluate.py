"""Evaluate weather correction against raw coarse forecasts."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import f1_score, mean_absolute_error, mean_squared_error, precision_score, recall_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from .features import build_features

MODEL_VERSION = "cropsense-weather-v1"
REQUIRED_COLUMNS = {
    "location_id",
    "observed_temp_max_c",
    "observed_temp_min_c",
    "observed_precipitation_mm",
}


def _scores(frame: pd.DataFrame, temperature_predictions, rain_predictions) -> dict:
    result = {}
    for label, observed_column, forecast_column, prediction_index in (
        ("temp_max", "observed_temp_max_c", "forecast_temp_max_c", 0),
        ("temp_min", "observed_temp_min_c", "forecast_temp_min_c", 1),
    ):
        truth = frame[observed_column].astype(float)
        raw = frame[forecast_column].astype(float)
        corrected = raw + temperature_predictions[:, prediction_index]
        result[label] = {
            "raw_mae": round(float(mean_absolute_error(truth, raw)), 4),
            "raw_rmse": round(float(mean_squared_error(truth, raw) ** 0.5), 4),
            "corrected_mae": round(float(mean_absolute_error(truth, corrected)), 4),
            "corrected_rmse": round(float(mean_squared_error(truth, corrected) ** 0.5), 4),
        }
    rainy = (frame["observed_precipitation_mm"].astype(float) >= 2.5).astype(int)
    raw_rain = (frame["forecast_precipitation_mm"].astype(float) >= 2.5).astype(int)
    result["rain_occurrence"] = {
        "raw_precision": round(float(precision_score(rainy, raw_rain, zero_division=0)), 4),
        "raw_recall": round(float(recall_score(rainy, raw_rain, zero_division=0)), 4),
        "raw_f1": round(float(f1_score(rainy, raw_rain, zero_division=0)), 4),
        "corrected_precision": round(float(precision_score(rainy, rain_predictions, zero_division=0)), 4),
        "corrected_recall": round(float(recall_score(rainy, rain_predictions, zero_division=0)), 4),
        "corrected_f1": round(float(f1_score(rainy, rain_predictions, zero_division=0)), 4),
    }
    return result


def _fit(frame: pd.DataFrame) -> dict:
    features = build_features(frame)
    temp_target = pd.DataFrame(
        {
            "temp_max_residual": frame["observed_temp_max_c"] - frame["forecast_temp_max_c"],
            "temp_min_residual": frame["observed_temp_min_c"] - frame["forecast_temp_min_c"],
        },
        index=frame.index,
    )
    rain_target = (frame["observed_precipitation_mm"] >= 2.5).astype(int)
    if rain_target.nunique() < 2:
        raise ValueError("Training data must include both rainy and non-rainy days")
    temperature = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(features, temp_target)
    rain = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(features, rain_target)
    return {"temperature": temperature, "rain": rain}


def _predictions(models: dict, frame: pd.DataFrame):
    features = build_features(frame)
    temp_residuals = models["temperature"].predict(features)
    rain_probability = models["rain"].predict_proba(features)[:, 1]
    return temp_residuals, (rain_probability >= 0.5).astype(int)


def evaluate_frame(frame: pd.DataFrame) -> dict:
    """Return chronological holdout and leave-one-location-out scores."""
    # Validate raw labels/group keys explicitly; build_features validates model inputs.
    raw_required = set(REQUIRED_COLUMNS) | {
        "date", "latitude", "longitude", "elevation_m", "forecast_lead_days",
        "forecast_temp_max_c", "forecast_temp_min_c", "forecast_precipitation_mm",
    }
    missing = sorted(raw_required - set(frame.columns))
    if missing:
        raise ValueError(f"Missing training columns: {', '.join(missing)}")
    ordered = frame.sort_values("date").reset_index(drop=True)
    split_at = int(len(ordered) * 0.8)
    if split_at < 2 or len(ordered) - split_at < 1:
        raise ValueError("Provide at least 3 chronological rows for an 80/20 evaluation split")
    train, holdout = ordered.iloc[:split_at], ordered.iloc[split_at:]
    holdout_models = _fit(train)
    holdout_predictions = _predictions(holdout_models, holdout)
    location_scores = {}
    for location in sorted(ordered["location_id"].astype(str).unique()):
        train_locations = ordered[ordered["location_id"].astype(str) != location]
        test_location = ordered[ordered["location_id"].astype(str) == location]
        if len(train_locations) < 2 or test_location.empty:
            continue
        try:
            fold_models = _fit(train_locations)
            location_scores[location] = _scores(test_location, *_predictions(fold_models, test_location))
        except ValueError:
            # Skip folds that cannot fit a rain classifier due to one-class training labels.
            continue
    location_average = {}
    if location_scores:
        score_names = next(iter(location_scores.values()))
        for group, values in score_names.items():
            location_average[group] = {
                name: round(
                    sum(scores[group][name] for scores in location_scores.values()) / len(location_scores),
                    4,
                )
                for name in values
            }
    result = {
        "model_version": MODEL_VERSION,
        "rainy_day_threshold_mm": 2.5,
        "row_count": int(len(ordered)),
        "time_ordered_holdout": _scores(holdout, *holdout_predictions),
        "leave_one_location_out": location_scores,
        "leave_one_location_out_average": location_average,
        "limitations": "Evaluation uses gridded proxy truth, not on-farm gauge or sensor observations.",
    }
    result["promotion_gate"] = promotion_gate(result)
    return result


def promotion_gate(metrics: dict) -> dict:
    """Require corrected temperature MAE and rain F1 to improve on both splits."""
    checks = {}
    for split_name in ("time_ordered_holdout", "leave_one_location_out_average"):
        split = metrics.get(split_name, {})
        for variable in ("temp_max", "temp_min"):
            scores = split.get(variable, {})
            checks[f"{split_name}_{variable}_mae"] = (
                scores.get("corrected_mae", float("inf")) < scores.get("raw_mae", float("inf"))
            )
        rain_scores = split.get("rain_occurrence", {})
        checks[f"{split_name}_rain_f1"] = (
            rain_scores.get("corrected_f1", 0) > rain_scores.get("raw_f1", 0)
        )
    return {"passed": bool(checks) and all(checks.values()), "checks": checks}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True, help="CSV following backend/ml/README.md schema")
    parser.add_argument("--model", type=Path, default=Path(__file__).parent / "artifacts" / "weather_model.joblib")
    parser.add_argument("--output", type=Path, help="Optional metrics JSON output path")
    args = parser.parse_args()
    metrics = evaluate_frame(pd.read_csv(args.data))
    output_path = args.output or args.model.with_name("evaluation_metrics.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Wrote evaluation metrics to {output_path}")


if __name__ == "__main__":
    main()
