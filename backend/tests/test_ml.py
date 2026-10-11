import unittest
from unittest.mock import patch

import numpy as np
import pandas as pd

from backend.ml.evaluate import promotion_gate
from backend.ml.features import build_features
from backend.ml.serve import MODEL_VERSION, refine_weather
from backend.app.data import FARM
from backend.app.weather import fallback_weather


class FeatureTests(unittest.TestCase):
    def test_shared_feature_builder_is_numeric_and_excludes_labels(self):
        rows = pd.DataFrame(
            [{
                "date": "2026-10-11",
                "latitude": 12.4,
                "longitude": 76.7,
                "elevation_m": 679,
                "forecast_lead_days": 1,
                "forecast_temp_max_c": 31,
                "forecast_temp_min_c": 21,
                "forecast_rain_probability_pct": 35,
                "forecast_precipitation_mm": 2,
                "observed_temp_max_c": 30,
                "location_id": "mandya",
            }]
        )

        features = build_features(rows)

        self.assertEqual(len(features), 1)
        self.assertNotIn("observed_temp_max_c", features.columns)
        self.assertNotIn("location_id", features.columns)
        self.assertTrue(all(pd.api.types.is_numeric_dtype(dtype) for dtype in features.dtypes))


class WeatherServingTests(unittest.TestCase):
    def setUp(self):
        self.weather = fallback_weather()
        self.weather["isFallback"] = False
        self.weather["dataSource"] = "test provider"

    def test_missing_model_returns_original_weather_unchanged(self):
        with patch("backend.ml.serve._load_model", return_value=None):
            result = refine_weather(self.weather, FARM)

        self.assertIs(result, self.weather)

    def test_fallback_weather_is_not_sent_through_model(self):
        fallback = fallback_weather()
        with patch("backend.ml.serve._load_model") as load_model:
            result = refine_weather(fallback, FARM)

        load_model.assert_not_called()
        self.assertIs(result, fallback)

    def test_successful_model_correction_is_labeled_and_does_not_mutate_input(self):
        class TemperatureModel:
            def predict(self, features):
                return [[1.0, -1.0] for _ in range(len(features))]

        class RainModel:
            def predict_proba(self, features):
                return np.array([[0.2, 0.8] for _ in range(len(features))])

        original_max = self.weather["forecast"][0]["tempMax"]
        with patch(
            "backend.ml.serve._load_model",
            return_value={"version": MODEL_VERSION, "temperature": TemperatureModel(), "rain": RainModel()},
        ):
            result = refine_weather(self.weather, FARM)

        self.assertEqual(result["forecast"][0]["tempMax"], original_max + 1)
        self.assertEqual(result["forecast"][0]["rainProbability"], 80)
        self.assertEqual(result["modelVersion"], MODEL_VERSION)
        self.assertTrue(result["correctionApplied"])
        self.assertEqual(self.weather["forecast"][0]["tempMax"], original_max)

    def test_inference_error_returns_original_weather_unchanged(self):
        class BrokenTemperatureModel:
            def predict(self, features):
                raise RuntimeError("invalid artifact")

        model = {"temperature": BrokenTemperatureModel(), "rain": object()}
        with patch("backend.ml.serve._load_model", return_value=model):
            result = refine_weather(self.weather, FARM)

        self.assertIs(result, self.weather)


class PromotionGateTests(unittest.TestCase):
    def test_requires_improvement_on_time_and_location_splits(self):
        split = {
            "temp_max": {"raw_mae": 3, "corrected_mae": 2},
            "temp_min": {"raw_mae": 2, "corrected_mae": 1},
            "rain_occurrence": {"raw_f1": 0.5, "corrected_f1": 0.6},
        }
        self.assertTrue(
            promotion_gate({
                "time_ordered_holdout": split,
                "leave_one_location_out_average": split,
            })["passed"]
        )
        failed = {**split, "rain_occurrence": {"raw_f1": 0.6, "corrected_f1": 0.5}}
        self.assertFalse(
            promotion_gate({
                "time_ordered_holdout": split,
                "leave_one_location_out_average": failed,
            })["passed"]
        )


if __name__ == "__main__":
    unittest.main()
