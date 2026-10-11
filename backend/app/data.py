"""Small, replaceable sample farm profile and fallback sensor inputs."""

FARMER = {
    "id": "farmer_01",
    "name": "Ramesh Gowda",
    "phone": "+91 98765 43210",
    "village": "Srirangapatna",
    "district": "Mandya",
    "state": "Karnataka",
    "preferredLanguage": "en",
}

FARM = {
    "id": "farm_01",
    "farmerId": FARMER["id"],
    "name": "Mandya Demo Farm",
    "location": {
        "lat": 12.4228,
        "lng": 76.6844,
        "elevationM": 679,
        "village": "Srirangapatna",
        "district": "Mandya",
        "state": "Karnataka",
    },
    "area": 3.5,
    "areaUnit": "acres",
    "crop": "Ragi",
    "cropStage": "Vegetative",
    "soilType": "Sandy Loam",
    "irrigationType": "Drip & Furrow",
    "boundary": [
        [12.4235, 76.6836],
        [12.4241, 76.6854],
        [12.4220, 76.6858],
        [12.4216, 76.6839],
    ],
}

# Soil sensors are not connected yet. Keep this value explicit and label it as
# an estimate so it cannot be mistaken for a live sensor reading.
FALLBACK_SOIL_MOISTURE = 32.0
