"""HTTP API for CropSense farm conditions and derived recommendations."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from typing import Literal
from pydantic import BaseModel, Field

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data import FALLBACK_SOIL_MOISTURE
from .database import get_profile, save_profile
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
    allow_methods=["GET", "PUT"],
    allow_headers=["*"],
)

_weather_cache: dict | None = None
_weather_cache_until: datetime | None = None
_weather_cache_key: tuple[float, float, float] | None = None
_weather_lock = asyncio.Lock()


class FarmerInput(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(pattern=r"^\+91 ?[6-9]\d{4} ?\d{5}$")
    village: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    preferredLanguage: Literal["en", "hi"] = "en"


class FarmLocationInput(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    elevationM: float = Field(default=0, ge=-500, le=9000)
    village: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)


class FarmInput(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    location: FarmLocationInput
    area: float = Field(gt=0, le=100000)
    areaUnit: Literal["acres", "hectares"]
    crop: str = Field(min_length=1, max_length=100)
    cropStage: str = Field(min_length=1, max_length=100)
    soilType: str = Field(min_length=1, max_length=100)
    irrigationType: str = Field(min_length=1, max_length=100)


class ProfileInput(BaseModel):
    farmer: FarmerInput
    farm: FarmInput


def required_profile() -> dict:
    profile = get_profile()
    if profile is None:
        raise HTTPException(status_code=409, detail="Add your farmer and farm details first.")
    return profile


async def current_weather(farm: dict) -> dict:
    global _weather_cache, _weather_cache_until, _weather_cache_key
    location = farm["location"]
    key = (location["lat"], location["lng"], location.get("elevationM", 0))
    now = datetime.now(timezone.utc)
    if _weather_cache is not None and _weather_cache_key == key and _weather_cache_until and now < _weather_cache_until:
        return _weather_cache
    async with _weather_lock:
        now = datetime.now(timezone.utc)
        if _weather_cache is None or _weather_cache_key != key or _weather_cache_until is None or now >= _weather_cache_until:
            raw_weather = await asyncio.to_thread(get_weather, farm)
            _weather_cache = refine_weather(raw_weather, farm)
            _weather_cache_key = key
            _weather_cache_until = now + timedelta(minutes=10)
    return _weather_cache


async def current_report(language: str = "en") -> dict:
    profile = required_profile()
    farm = profile["farm"]
    weather = await current_weather(farm)
    # Sensor integration is not available; this is a labeled sample estimate.
    prediction = predict(weather, FALLBACK_SOIL_MOISTURE, "estimated fallback", farm, language)
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
    return required_profile()["farmer"]


@app.get("/api/farm")
def farm() -> dict:
    return required_profile()["farm"]


@app.get("/api/profile")
def profile() -> dict:
    saved_profile = get_profile()
    if saved_profile is None:
        return {"configured": False, "farmer": None, "farm": None}
    return {"configured": True, **saved_profile}


@app.put("/api/profile")
def update_profile(payload: ProfileInput) -> dict:
    saved_profile = save_profile(
        payload.farmer.model_dump(),
        payload.farm.model_dump(by_alias=True),
    )
    return {"configured": True, **saved_profile}


@app.get("/api/weather")
async def weather(language: str = "en") -> dict:
    farm_data = required_profile()["farm"]
    return localized_weather(await current_weather(farm_data), language)


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
