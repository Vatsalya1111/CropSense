"""Small, replaceable sample farm profile and fallback sensor inputs."""

FARMER = {
    "id": "farmer_01",
    "name": "Ramesh Patel",
    "phone": "+91 98765 43210",
    "village": "Rampur",
    "district": "Sitapur",
    "state": "Uttar Pradesh",
    "preferredLanguage": "en",
}

FARM = {
    "id": "farm_01",
    "farmerId": FARMER["id"],
    "name": "Rampur Adarsh Khet",
    "location": {
        "lat": 27.5645,
        "lng": 80.6789,
        "village": "Rampur",
        "district": "Sitapur",
        "state": "Uttar Pradesh",
    },
    "area": 3.5,
    "areaUnit": "acres",
    "crop": "Wheat (HD-2967)",
    "cropStage": "Flowering & Grain Filling",
    "soilType": "Sandy Loam",
    "irrigationType": "Drip & Furrow",
    "boundary": [
        [27.5652, 80.6775],
        [27.5658, 80.6802],
        [27.5638, 80.6806],
        [27.5632, 80.6780],
    ],
}

# Soil sensors are not connected yet. Keep this value explicit and label it as
# an estimate so it cannot be mistaken for a live sensor reading.
FALLBACK_SOIL_MOISTURE = 32.0
