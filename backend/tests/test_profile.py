import os
import tempfile
import unittest
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError

from backend.app import main
from backend.app.database import get_profile, save_profile


PROFILE = {
    "farmer": {
        "name": "Asha Rao",
        "phone": "+91 90000 11111",
        "village": "Keregodu",
        "district": "Mandya",
        "state": "Karnataka",
        "preferredLanguage": "en",
    },
    "farm": {
        "name": "North Field",
        "location": {
            "lat": 12.3,
            "lng": 76.6,
            "elevationM": 650,
            "village": "Keregodu",
            "district": "Mandya",
            "state": "Karnataka",
        },
        "area": 2.5,
        "areaUnit": "acres",
        "crop": "Ragi",
        "cropStage": "Vegetative",
        "soilType": "Sandy loam",
        "irrigationType": "Drip",
    },
}


class ProfilePersistenceTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        env = patch.dict(os.environ, {"CROPSENSE_DB_PATH": os.path.join(self.temp_dir.name, "profile.sqlite3")})
        env.start()
        self.addCleanup(env.stop)

    def test_new_database_starts_without_a_demo_profile(self):
        self.assertIsNone(get_profile())
        self.assertEqual(main.profile(), {"configured": False, "farmer": None, "farm": None})
        with self.assertRaises(HTTPException) as error:
            main.farmer()
        self.assertEqual(error.exception.status_code, 409)

    def test_profile_can_be_created_and_updated(self):
        first = main.update_profile(main.ProfileInput(**PROFILE))
        self.assertTrue(first["configured"])
        self.assertEqual(first["farmer"]["name"], "Asha Rao")
        self.assertEqual(first["farm"]["location"]["lat"], 12.3)

        changed = {**PROFILE, "farmer": {**PROFILE["farmer"], "name": "Asha R."}}
        second = main.update_profile(main.ProfileInput(**changed))
        self.assertEqual(second["farmer"]["name"], "Asha R.")
        self.assertEqual(main.farm()["name"], "North Field")

    def test_invalid_coordinates_are_rejected(self):
        invalid = {**PROFILE, "farm": {**PROFILE["farm"], "location": {**PROFILE["farm"]["location"], "lat": 120}}}
        with self.assertRaises(ValidationError):
            main.ProfileInput(**invalid)
        self.assertIsNone(get_profile())

    def test_recommendation_routes_require_profile_setup(self):
        with self.assertRaises(HTTPException) as error:
            main.required_profile()
        self.assertEqual(error.exception.status_code, 409)

    def test_save_profile_round_trips_units_and_location(self):
        from backend.app.main import ProfileInput

        payload = ProfileInput(**PROFILE)
        saved = save_profile(payload.farmer.model_dump(), payload.farm.model_dump(by_alias=True))
        self.assertEqual(saved["farm"]["areaUnit"], "acres")
        self.assertEqual(saved["farm"]["location"]["lng"], 76.6)


if __name__ == "__main__":
    unittest.main()
