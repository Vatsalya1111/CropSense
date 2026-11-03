import unittest
from unittest.mock import patch

from backend.app.data import FARM
from backend.app.predictions import predict
from backend.app.weather import fallback_weather, get_weather, normalize_weather


def weather_fixture(temperature, humidity, rain_probability, rainfall):
    data = fallback_weather()
    data["isFallback"] = False
    data["dataSource"] = "test"
    data["current"].update({"temperature": temperature, "humidity": humidity})
    data["forecast"][1].update(
        {"rainProbability": rain_probability, "expectedRainfall": rainfall}
    )
    return data


class WeatherTests(unittest.TestCase):
    def test_normalizes_open_meteo_current_and_daily_payload(self):
        normalized = normalize_weather({
            "current": {
                "temperature_2m": 29.2,
                "relative_humidity_2m": 65,
                "apparent_temperature": 30.1,
                "precipitation": 0.2,
                "weather_code": 2,
                "wind_speed_10m": 8.4,
            },
            "daily": {
                "time": ["2026-10-10", "2026-10-11"],
                "temperature_2m_max": [32, 31],
                "temperature_2m_min": [22, 21],
                "precipitation_probability_max": [10, 70],
                "precipitation_sum": [0, 12],
                "weather_code": [2, 63],
            },
        })
        self.assertEqual(normalized["current"]["temperature"], 29.2)
        self.assertEqual(normalized["forecast"][1]["expectedRainfall"], 12)
        self.assertFalse(normalized["isFallback"])

    def test_fallback_contains_five_current_dated_forecast_days(self):
        fallback = fallback_weather()
        self.assertTrue(fallback["isFallback"])
        self.assertEqual(fallback["dataSource"], "Sample fallback")
        self.assertEqual(len(fallback["forecast"]), 5)

    def test_provider_failure_uses_fallback_weather(self):
        with patch("backend.app.weather._request_weather", side_effect=OSError("offline")):
            result = get_weather()
        self.assertTrue(result["isFallback"])

    def test_malformed_provider_payload_uses_fallback_weather(self):
        with patch("backend.app.weather._request_weather", return_value={"unexpected": True}):
            result = get_weather()
        self.assertTrue(result["isFallback"])


class PredictionTests(unittest.TestCase):
    def test_low_moisture_and_dry_weather_recommend_irrigation(self):
        result = predict(weather_fixture(35, 35, 0, 0), 20, "estimated fallback", FARM)
        self.assertEqual(result["irrigation"]["irrigationStatus"], "Irrigate immediately")
        self.assertLess(result["cropHealth"]["healthScore"], 70)
        self.assertTrue(result["cropHealth"]["isFallback"])

    def test_heavy_rain_suppresses_irrigation(self):
        result = predict(weather_fixture(27, 88, 90, 30), 40, "sensor", FARM)
        self.assertEqual(result["irrigation"]["irrigationStatus"], "Do not irrigate")
        self.assertFalse(result["irrigation"]["isFallback"])

    def test_moderate_conditions_return_normal_status(self):
        result = predict(weather_fixture(27, 60, 20, 0), 40, "sensor", FARM)
        self.assertEqual(result["irrigation"]["irrigationStatus"], "Normal")
        self.assertGreaterEqual(result["cropHealth"]["healthScore"], 70)


if __name__ == "__main__":
    unittest.main()
