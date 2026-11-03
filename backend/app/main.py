"""HTTP API for CropSense farm conditions and derived recommendations."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .data import FARM, FARMER, FALLBACK_SOIL_MOISTURE
from .predictions import build_advisories, build_alerts, predict
from .weather import get_weather

try:
    # Uvicorn loads this module as top-level ``app`` with ``--app-dir backend``.
    from ml.serve import refine_weather
except ImportError:
    # Tests and package imports may load it as ``backend.app.main`` instead.
    from ..ml.serve import refine_weather

app = FastAPI(title="CropSense API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

_weather_cache: dict | None = None
_weather_cache_until: datetime | None = None
_weather_lock = asyncio.Lock()


async def current_weather() -> dict:
    global _weather_cache, _weather_cache_until
    now = datetime.now(timezone.utc)
    if _weather_cache is not None and _weather_cache_until and now < _weather_cache_until:
        return _weather_cache
    async with _weather_lock:
        now = datetime.now(timezone.utc)
        if _weather_cache is None or _weather_cache_until is None or now >= _weather_cache_until:
            raw_weather = await asyncio.to_thread(get_weather)
            _weather_cache = refine_weather(raw_weather, FARM)
            _weather_cache_until = now + timedelta(minutes=10)
    return _weather_cache


async def current_report(language: str = "en") -> dict:
    weather = await current_weather()
    # Sensor integration is not available; this is a labeled sample estimate.
    prediction = predict(weather, FALLBACK_SOIL_MOISTURE, "estimated fallback", FARM, language)
    return {
        "weather": weather,
        **prediction,
        "alerts": build_alerts(weather, prediction, language),
        "advisories": build_advisories(weather, prediction, language),
    }


def localized_weather(weather: dict, language: str) -> dict:
    if language != "hi":
        return weather
    from copy import deepcopy

    result = deepcopy(weather)
    conditions = {
        "Clear sky": "साफ़ आसमान",
        "Partly cloudy": "आंशिक बादल",
        "Overcast": "बादल छाए हुए",
        "Fog": "कोहरा",
        "Drizzle": "बूँदाबाँदी",
        "Rain showers": "बारिश की बौछारें",
        "Snow": "बर्फ़बारी",
        "Thunderstorm": "आँधी और गरज",
        "Variable conditions": "बदलता मौसम",
    }
    result["current"]["weatherCondition"] = conditions.get(result["current"]["weatherCondition"], result["current"]["weatherCondition"])
    for day in result["forecast"]:
        day["weatherCondition"] = conditions.get(day["weatherCondition"], day["weatherCondition"])
        day["dayName"] = {"Today": "आज", "Tomorrow": "कल"}.get(day["dayName"], day["dayName"])
    return result


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "cropsense-api"}


@app.get("/api/farmer")
def farmer() -> dict:
    return FARMER


@app.get("/api/farm")
def farm() -> dict:
    return FARM


@app.get("/api/weather")
async def weather(language: str = "en") -> dict:
    return localized_weather(await current_weather(), language)


@app.get("/api/irrigation")
async def irrigation(language: str = "en") -> dict:
    return (await current_report(language))["irrigation"]


@app.get("/api/crop-health")
async def crop_health(language: str = "en") -> dict:
    return (await current_report(language))["cropHealth"]


@app.get("/api/alerts")
async def alerts(language: str = "en") -> list[dict]:
    return (await current_report(language))["alerts"]


@app.get("/api/advisories")
async def advisories(language: str = "en") -> list[dict]:
    return (await current_report(language))["advisories"]


