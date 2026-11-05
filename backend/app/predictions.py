"""Replaceable first-pass prediction engine for core crop decisions."""

from __future__ import annotations

from datetime import datetime, timezone
from math import ceil

from .crop_config import get_crop_thresholds


def _review_day(forecast: list[dict], threshold: float, hindi: bool) -> str:
    hindi_days = {
        "Today": "आज",
        "Tomorrow": "कल",
        "Monday": "सोमवार",
        "Tuesday": "मंगलवार",
        "Wednesday": "बुधवार",
        "Thursday": "गुरुवार",
        "Friday": "शुक्रवार",
        "Saturday": "शनिवार",
        "Sunday": "रविवार",
    }
    for day in forecast[1:]:
        if day["expectedRainfall"] < threshold:
            day_name = hindi_days.get(day["dayName"], day["dayName"]) if hindi else day["dayName"]
            return f"{day_name} सुबह" if hindi else f"{day_name} morning"
    return "बारिश के बाद" if hindi else "After the rain"


def _localized_stage(stage: str, hindi: bool) -> str:
    if not hindi:
        return stage.lower()
    return {
        "Land preparation": "खेत की तैयारी",
        "Sowing": "बुवाई",
        "Seedling": "अंकुर अवस्था",
        "Vegetative": "वानस्पतिक अवस्था",
        "Flowering": "फूल आने की अवस्था",
        "Grain filling": "दाना भरने की अवस्था",
        "Maturity": "पकने की अवस्था",
        "Harvesting": "कटाई",
    }.get(stage, stage)


def predict(weather: dict, soil_moisture: float, soil_source: str, farm: dict, language: str = "en") -> dict:
    """Return derived irrigation and crop-health outputs from normalized inputs.

    These transparent thresholds are a temporary baseline. Keep this function's
    input/output boundary stable when replacing it with the trained model.
    """
    current = weather["current"]
    forecast = weather["forecast"]
    thresholds = get_crop_thresholds(farm.get("crop", ""), farm.get("cropStage", ""))
    next_two_days = forecast[:2]
    expected_rain = sum(day["expectedRainfall"] for day in next_two_days)
    rain_probability = max((day["rainProbability"] for day in next_two_days), default=0)
    consecutive_rain = any(
        (
            forecast[index]["expectedRainfall"] >= thresholds["wet_weather_rainfall_mm"]
            or forecast[index]["rainProbability"] >= thresholds["irrigation_rain_probability"]
        )
        and (
            forecast[index + 1]["expectedRainfall"] >= thresholds["wet_weather_rainfall_mm"]
            or forecast[index + 1]["rainProbability"] >= thresholds["irrigation_rain_probability"]
        )
        for index in range(max(0, len(forecast) - 1))
    )
    temperature = current["temperature"]
    humidity = current["humidity"]
    weather_fallback = weather["isFallback"]
    inputs_fallback = weather_fallback or soil_source != "sensor"
    now = datetime.now(timezone.utc).isoformat()
    hindi = language == "hi"

    if expected_rain >= thresholds["irrigation_rainfall_mm"] and rain_probability >= thresholds["irrigation_rain_probability"]:
        status = "Do not irrigate"
        action = "सिंचाई रोकें और खेत की जल निकासी जाँचें।" if hindi else "Pause irrigation and check that field drainage is clear."
        timing = _review_day(forecast, thresholds["wet_weather_rainfall_mm"], hindi)
        reason = f"अगले दो दिनों में {expected_rain:.1f} मिमी बारिश का अनुमान है।" if hindi else f"The forecast shows {expected_rain:.1f} mm of rain over the next two days."
    elif soil_moisture < thresholds["soil_moisture_irrigate_below"]:
        status = "Irrigate immediately"
        action = "ठंडे समय में सुबह या शाम खेत में पानी दें।" if hindi else "Water the field during the cooler morning or evening hours."
        timing = "सुबह जल्दी या शाम 5 बजे के बाद" if hindi else "Early morning or after 5:00 PM"
        reason = f"मिट्टी की अनुमानित नमी केवल {soil_moisture:.0f}% है।" if hindi else f"Estimated soil moisture is low at {soil_moisture:.0f}%."
    else:
        status = "Normal"
        action = "मिट्टी की नमी देखते रहें और अगले मौसम अपडेट पर ध्यान दें।" if hindi else "Keep monitoring soil moisture and follow the next forecast update."
        timing = "अभी सिंचाई की ज़रूरत नहीं" if hindi else "No immediate irrigation"
        reason = f"मिट्टी की नमी {soil_moisture:.0f}% है और अगले दो दिनों में भारी बारिश का अनुमान नहीं है।" if hindi else f"Soil moisture is {soil_moisture:.0f}% and no heavy rain is expected in the next two days."

    score = 100
    if temperature > 30:
        score -= min(25, ceil((temperature - 30) * 2))
    if soil_moisture < thresholds["soil_moisture_stress_below"]:
        score -= min(30, ceil((thresholds["soil_moisture_stress_below"] - soil_moisture) * 1.5))
    disease_risk = humidity >= thresholds["wet_weather_humidity"] or consecutive_rain
    if disease_risk:
        score -= 15
    score = max(0, min(100, score))
    if disease_risk:
        overall = "Watch"
        trend = "declining"
    elif score >= 85:
        overall = "Optimal"
        trend = "stable"
    elif score >= 70:
        overall = "Good"
        trend = "stable"
    elif score >= 50:
        overall = "Moderate Stress"
        trend = "declining"
    else:
        overall = "Severe Stress"
        trend = "declining"

    risks = []
    if temperature >= thresholds["severe_heat_temperature"] or (
        temperature >= thresholds["heat_stress_temperature"] and soil_moisture < 30
    ):
        risks.append("heat and moisture stress")
    if disease_risk:
        risks.append("wet-weather crop disease conditions")
    if hindi:
        observation = (
            "मौजूदा मौसम में फसल पर गर्मी और नमी की कमी का दबाव हो सकता है।"
            if "heat and moisture stress" in risks
            else "मौजूदा मौसम में अधिक नमी से फसल रोग का जोखिम हो सकता है।"
            if "wet-weather crop disease conditions" in risks
            else "मौसम और अनुमानित मिट्टी की नमी से फसल पर अभी अधिक तनाव नहीं दिखता।"
        )
        health_status = {"Optimal": "फसल की स्थिति बहुत अच्छी है", "Good": "फसल की स्थिति अच्छी है", "Watch": "फसल पर ध्यान दें", "Moderate Stress": "फसल पर मध्यम तनाव है", "Severe Stress": "फसल पर गंभीर तनाव है"}[overall]
        health_action = action if status == "Irrigate immediately" else (
            "खेत की जल निकासी जाँचें और बारिश के बाद निचली पत्तियों का निरीक्षण करें।"
            if "wet-weather crop disease conditions" in risks
            else "खेत की नियमित निगरानी करें और मिट्टी की नमी जाँचें।"
        )
    else:
        observation = (
            f"Current conditions indicate {', '.join(risks)}."
            if risks
            else "Current weather and estimated soil moisture do not indicate an elevated crop stress risk."
        )
        health_status = "Watch crop condition" if overall == "Watch" else f"{overall} crop condition"
        health_action = action if status == "Irrigate immediately" else (
            "Check field drainage and scout lower leaves after wet weather."
            if "wet-weather crop disease conditions" in risks
            else "Continue routine field monitoring and check soil moisture regularly."
        )

    return {
        "irrigation": {
            "soilMoisture": round(soil_moisture),
            "irrigationStatus": status,
            "recommendedAction": action,
            "recommendedTime": timing,
            "reason": reason,
            "lastUpdated": now,
            "dataSource": "Estimated input" if inputs_fallback else "Live inputs",
            "isFallback": inputs_fallback,
            "modelVersion": "rule-baseline-v1",
        },
        "cropHealth": {
            "overallHealth": overall,
            "healthStatus": health_status,
            "healthScore": score,
            "healthTrend": trend,
            "cropStage": farm["cropStage"],
            "observation": observation,
            "recommendedAction": health_action,
            "lastUpdated": now,
            "dataSource": "Estimated input" if inputs_fallback else "Live inputs",
            "isFallback": inputs_fallback,
            "modelVersion": "rule-baseline-v1",
        },
    }


def build_alerts(weather: dict, predictions: dict, language: str = "en") -> list[dict]:
    current = weather["current"]
    forecast = weather["forecast"]
    irrigation = predictions["irrigation"]
    crop = predictions["cropHealth"]
    alerts = []
    hindi = language == "hi"
    timestamp = datetime.now(timezone.utc).isoformat()

    if irrigation["irrigationStatus"] == "Irrigate immediately":
        alerts.append({
            "id": "low-soil-moisture",
            "type": "low_soil_moisture",
            "severity": "warning",
            "title": "मिट्टी की नमी कम हो सकती है" if hindi else "Soil moisture may be low",
            "message": irrigation["reason"],
            "actionRequired": irrigation["recommendedAction"],
            "timestamp": timestamp,
        })
    if current["temperature"] >= 35:
        alerts.append({
            "id": "extreme-heat",
            "type": "extreme_heat",
            "severity": "warning",
            "title": "अधिक तापमान का जोखिम" if hindi else "High temperature risk",
            "message": f"अभी तापमान {current['temperature']:.1f}°C है।" if hindi else f"The current temperature is {current['temperature']:.1f}°C.",
            "actionRequired": "फसल पर ध्यान दें और तेज़ गर्मी में खेत का काम न करें।" if hindi else "Monitor the crop and avoid field work during peak heat.",
            "timestamp": timestamp,
        })
    wettest = max(forecast, key=lambda item: item["expectedRainfall"], default=None)
    if wettest and wettest["expectedRainfall"] >= 25:
        alerts.append({
            "id": "heavy-rainfall",
            "type": "heavy_rainfall",
            "severity": "warning",
            "title": "भारी बारिश का अनुमान" if hindi else "Heavy rainfall is forecast",
            "message": f"{wettest['dayName']} को {wettest['expectedRainfall']:.1f} मिमी बारिश का अनुमान है।" if hindi else f"{wettest['expectedRainfall']:.1f} mm expected on {wettest['dayName']}.",
            "actionRequired": "सिंचाई रोकें और खेत की जल निकासी जाँचें।" if hindi else "Pause irrigation and check field drainage.",
            "timestamp": timestamp,
        })
    if crop["healthScore"] < 70:
        alerts.append({
            "id": "crop-stress-risk",
            "type": "crop_health_deterioration",
            "severity": "warning",
            "title": "फसल पर तनाव का जोखिम" if hindi else "Crop stress risk detected",
            "message": crop["observation"],
            "actionRequired": crop["recommendedAction"],
            "timestamp": timestamp,
        })
    return alerts


def build_advisories(weather: dict, predictions: dict, language: str = "en") -> list[dict]:
    irrigation = predictions["irrigation"]
    crop = predictions["cropHealth"]
    hindi = language == "hi"
    advisories = [{
        "id": "irrigation-guidance",
        "title": "सिंचाई की सलाह" if hindi else "Irrigation guidance",
        "category": "irrigation",
        "whatIsHappening": irrigation["reason"],
        "why": f"{_localized_stage(predictions['cropHealth']['cropStage'], hindi)} में बारिश के बीच अतिरिक्त पानी से खेत में जलभराव हो सकता है।" if hindi else f"During the {predictions['cropHealth']['cropStage'].lower()} stage, extra water between rainy days can leave the field waterlogged.",
        "whatFarmerShouldDo": "सिंचाई न करें।" if hindi and irrigation["irrigationStatus"] == "Do not irrigate" else "Do not irrigate." if irrigation["irrigationStatus"] == "Do not irrigate" else irrigation["recommendedAction"],
        "whenToDoIt": irrigation["recommendedTime"],
        "priority": "urgent" if irrigation["irrigationStatus"] == "Irrigate immediately" else "normal",
        "date": "आज" if hindi else "Today",
    }]
    if crop["overallHealth"] == "Watch":
        follow_up = "बारिश के बाद खेत की जल निकासी जाँचें।" if hindi else "Check field drainage after the rain."
        advisories.append({
            "id": "drainage-guidance",
            "title": "जल निकासी जाँचें" if hindi else "Check field drainage",
            "category": "crop_protection",
            "whatIsHappening": crop["observation"],
            "why": f"{_localized_stage(crop['cropStage'], hindi)} में जलभराव जड़ों तक हवा कम पहुँचाता है।" if hindi else f"During the {crop['cropStage'].lower()} stage, waterlogging reduces air around the roots.",
            "whatFarmerShouldDo": follow_up,
            "whenToDoIt": "आज" if hindi else "This afternoon",
            "priority": "warning",
            "date": "आज" if hindi else "Today",
        })
        advisories.append({
            "id": "leaf-scouting-guidance",
            "title": "निचली पत्तियाँ देखें" if hindi else "Scout lower leaves",
            "category": "crop_protection",
            "whatIsHappening": crop["observation"],
            "why": f"{_localized_stage(crop['cropStage'], hindi)} में लगातार नमी पत्तियों पर रोग के शुरुआती संकेत बढ़ा सकती है।" if hindi else f"During the {crop['cropStage'].lower()} stage, persistent moisture can increase early disease signs on leaves.",
            "whatFarmerShouldDo": "बारिश के बाद निचली पत्तियों का निरीक्षण करें।" if hindi else "Scout lower leaves after the rain.",
            "whenToDoIt": "बारिश रुकने के बाद" if hindi else "After the rain stops",
            "priority": "warning",
            "date": "आज" if hindi else "Today",
        })
    return advisories
