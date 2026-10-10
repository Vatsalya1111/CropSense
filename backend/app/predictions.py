"""Replaceable first-pass prediction engine for core crop decisions."""

from __future__ import annotations

from datetime import datetime, timezone
from math import ceil


def predict(weather: dict, soil_moisture: float, soil_source: str, farm: dict, language: str = "en") -> dict:
    """Return derived irrigation and crop-health outputs from normalized inputs.

    These transparent thresholds are a temporary baseline. Keep this function's
    input/output boundary stable when replacing it with the trained model.
    """
    current = weather["current"]
    forecast = weather["forecast"]
    next_two_days = forecast[:2]
    expected_rain = sum(day["expectedRainfall"] for day in next_two_days)
    rain_probability = max((day["rainProbability"] for day in next_two_days), default=0)
    temperature = current["temperature"]
    humidity = current["humidity"]
    weather_fallback = weather["isFallback"]
    inputs_fallback = weather_fallback or soil_source != "sensor"
    now = datetime.now(timezone.utc).isoformat()
    hindi = language == "hi"

    if expected_rain >= 10 and rain_probability >= 50:
        status = "Do not irrigate"
        action = "सिंचाई रोकें और खेत की जल निकासी जाँचें।" if hindi else "Pause irrigation and check that field drainage is clear."
        timing = "अनुमानित बारिश के बाद फिर जाँचें" if hindi else "Review after the expected rainfall"
        reason = f"अगले दो दिनों में {expected_rain:.1f} मिमी बारिश का अनुमान है।" if hindi else f"The forecast shows {expected_rain:.1f} mm of rain over the next two days."
    elif soil_moisture < 25:
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
    if soil_moisture < 35:
        score -= min(30, ceil((35 - soil_moisture) * 1.5))
    if humidity > 85 and expected_rain >= 10:
        score -= 10
    score = max(0, min(100, score))
    if score >= 85:
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
    if temperature >= 35 or (temperature >= 32 and soil_moisture < 30):
        risks.append("heat and moisture stress")
    if humidity >= 85 and expected_rain >= 10:
        risks.append("wet-weather crop disease conditions")
    if hindi:
        observation = (
            "मौजूदा मौसम में फसल पर गर्मी और नमी की कमी का दबाव हो सकता है।"
            if "heat and moisture stress" in risks
            else "मौजूदा मौसम में अधिक नमी से फसल रोग का जोखिम हो सकता है।"
            if "wet-weather crop disease conditions" in risks
            else "मौसम और अनुमानित मिट्टी की नमी से फसल पर अभी अधिक तनाव नहीं दिखता।"
        )
        health_status = {"Optimal": "फसल की स्थिति बहुत अच्छी है", "Good": "फसल की स्थिति अच्छी है", "Moderate Stress": "फसल पर मध्यम तनाव है", "Severe Stress": "फसल पर गंभीर तनाव है"}[overall]
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
        health_status = f"{overall} crop condition"
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
    timestamp = datetime.now().astimezone().strftime("%I:%M %p Today")

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
        "why": "सिंचाई का निर्णय मिट्टी की नमी और संभावित बारिश पर निर्भर करता है।" if hindi else "Watering decisions depend on soil moisture and expected rainfall.",
        "whatFarmerShouldDo": irrigation["recommendedAction"],
        "whenToDoIt": irrigation["recommendedTime"],
        "priority": "urgent" if irrigation["irrigationStatus"] == "Irrigate immediately" else "normal",
        "date": "आज" if hindi else "Today",
    }]
    if crop["healthScore"] < 85:
        advisories.append({
            "id": "crop-risk-guidance",
            "title": "फसल की स्थिति जाँचें" if hindi else "Crop condition check",
            "category": "crop_protection",
            "whatIsHappening": crop["observation"],
            "why": "मौसम और नमी की स्थिति से फसल पर तनाव बढ़ सकता है।" if hindi else "Weather and moisture conditions can increase crop stress.",
            "whatFarmerShouldDo": crop["recommendedAction"],
            "whenToDoIt": "आज" if hindi else "Today",
            "priority": "warning" if crop["healthScore"] < 70 else "normal",
            "date": "आज" if hindi else "Today",
        })
    return advisories
