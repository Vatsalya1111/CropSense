import {
  farmData,
  currentWeather,
  forecast,
} from "../data/mockData";

/*
  CropSense API Layer

  For now we use mock data.
  Later this file will communicate with Sailesh's backend.
*/

const USE_MOCK_DATA = true;

const API_BASE_URL = "http://localhost:5000/api";

/* -------------------------
   FARM
------------------------- */

export async function getFarmData() {
  if (USE_MOCK_DATA) {
    return farmData;
  }

  const response = await fetch(`${API_BASE_URL}/farm`);

  if (!response.ok) {
    throw new Error("Failed to fetch farm data");
  }

  return response.json();
}

/* -------------------------
   CURRENT WEATHER
------------------------- */

export async function getCurrentWeather() {
  if (USE_MOCK_DATA) {
    return currentWeather;
  }

  const response = await fetch(`${API_BASE_URL}/weather/current`);

  if (!response.ok) {
    throw new Error("Failed to fetch current weather");
  }

  return response.json();
}

/* -------------------------
   WEATHER FORECAST
------------------------- */

export async function getForecast() {
  if (USE_MOCK_DATA) {
    return forecast;
  }

  const response = await fetch(`${API_BASE_URL}/weather/forecast`);

  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }

  return response.json();
}

/* -------------------------
   SENSOR DATA
------------------------- */

export async function getSensorData() {
  if (USE_MOCK_DATA) {
    return {
      temperature: 31.2,
      humidity: 77,
      soilMoisture: 43,
      rainfall: 12.4,
      status: "online",
      lastUpdated: "2 minutes ago",
    };
  }

  const response = await fetch(`${API_BASE_URL}/sensors`);

  if (!response.ok) {
    throw new Error("Failed to fetch sensor data");
  }

  return response.json();
}

/* -------------------------
   ADVISORIES
------------------------- */

export async function getAdvisories() {
  if (USE_MOCK_DATA) {
    return [
      {
        type: "Irrigation",
        priority: "High priority",
        title: "Skip irrigation tomorrow morning",
        rainfall: "18–25 mm",
      },
      {
        type: "Spraying",
        priority: "Caution",
        title: "Postpone spraying",
        rainfall: "High rainfall probability",
      },
    ];
  }

  const response = await fetch(`${API_BASE_URL}/advisories`);

  if (!response.ok) {
    throw new Error("Failed to fetch advisories");
  }

  return response.json();
}