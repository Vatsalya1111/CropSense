"""Small SQLite persistence layer for the single farmer and farm profile."""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[1] / "cropsense.sqlite3"


def _database_path() -> Path:
    return Path(os.environ.get("CROPSENSE_DB_PATH", DEFAULT_DATABASE_PATH))


def _connect() -> sqlite3.Connection:
    path = _database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


@contextmanager
def _connection() -> Iterator[sqlite3.Connection]:
    connection = _connect()
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def initialize_database() -> None:
    with _connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS farmer (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                village TEXT NOT NULL,
                district TEXT NOT NULL,
                state TEXT NOT NULL,
                preferred_language TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS farm (
                id TEXT PRIMARY KEY,
                farmer_id TEXT NOT NULL REFERENCES farmer(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                elevation_m REAL NOT NULL DEFAULT 0,
                village TEXT NOT NULL,
                district TEXT NOT NULL,
                state TEXT NOT NULL,
                area REAL NOT NULL,
                area_unit TEXT NOT NULL,
                crop TEXT NOT NULL,
                crop_stage TEXT NOT NULL,
                soil_type TEXT NOT NULL,
                irrigation_type TEXT NOT NULL
            );
            """
        )


def get_profile() -> dict | None:
    initialize_database()
    with _connection() as connection:
        farmer = connection.execute("SELECT * FROM farmer LIMIT 1").fetchone()
        farm = connection.execute("SELECT * FROM farm LIMIT 1").fetchone()
    if farmer is None or farm is None:
        return None
    return {
        "farmer": {
            "id": farmer["id"],
            "name": farmer["name"],
            "phone": farmer["phone"],
            "village": farmer["village"],
            "district": farmer["district"],
            "state": farmer["state"],
            "preferredLanguage": farmer["preferred_language"],
        },
        "farm": {
            "id": farm["id"],
            "farmerId": farm["farmer_id"],
            "name": farm["name"],
            "location": {
                "lat": farm["latitude"],
                "lng": farm["longitude"],
                "elevationM": farm["elevation_m"],
                "village": farm["village"],
                "district": farm["district"],
                "state": farm["state"],
            },
            "area": farm["area"],
            "areaUnit": farm["area_unit"],
            "crop": farm["crop"],
            "cropStage": farm["crop_stage"],
            "soilType": farm["soil_type"],
            "irrigationType": farm["irrigation_type"],
        },
    }


def save_profile(farmer: dict, farm: dict) -> dict:
    initialize_database()
    farmer_id = "farmer_01"
    farm_id = "farm_01"
    location = farm["location"]
    with _connection() as connection:
        connection.execute(
            """INSERT INTO farmer (id, name, phone, village, district, state, preferred_language)
               VALUES (?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, phone=excluded.phone,
                 village=excluded.village, district=excluded.district, state=excluded.state,
                 preferred_language=excluded.preferred_language""",
            (
                farmer_id,
                farmer["name"],
                farmer["phone"],
                farmer["village"],
                farmer["district"],
                farmer["state"],
                farmer["preferredLanguage"],
            ),
        )
        connection.execute(
            """INSERT INTO farm (id, farmer_id, name, latitude, longitude, elevation_m,
                 village, district, state, area, area_unit, crop, crop_stage, soil_type, irrigation_type)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, latitude=excluded.latitude,
                 longitude=excluded.longitude, elevation_m=excluded.elevation_m,
                 village=excluded.village, district=excluded.district, state=excluded.state,
                 area=excluded.area, area_unit=excluded.area_unit, crop=excluded.crop,
                 crop_stage=excluded.crop_stage, soil_type=excluded.soil_type,
                 irrigation_type=excluded.irrigation_type""",
            (
                farm_id,
                farmer_id,
                farm["name"],
                location["lat"],
                location["lng"],
                location.get("elevationM", 0),
                location["village"],
                location["district"],
                location["state"],
                farm["area"],
                farm["areaUnit"],
                farm["crop"],
                farm["cropStage"],
                farm["soilType"],
                farm["irrigationType"],
            ),
        )
    saved = get_profile()
    assert saved is not None
    return saved
