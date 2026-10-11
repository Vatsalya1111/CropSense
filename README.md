# CropSense

CropSense is a lightweight agricultural monitoring dashboard that combines weather data, farm profile information, and crop decision logic into a simple farmer-friendly advisory system.

It is built with a React frontend and a FastAPI backend, and is designed to provide irrigation guidance, crop health insights, localized alerts, and weather-based recommendations for a sample farm.

## Overview

CropSense helps farmers quickly understand:

- current weather conditions
- rainfall and forecast risk
- soil moisture status
- crop health and stress level
- irrigation actions to take
- localized alerts and advisories in English and Hindi

## Architecture

### High-level flow

```text
React frontend (Vite + TypeScript)
        |
        v
FastAPI backend
        |
        +--> weather.py        -> Open-Meteo fetch + normalization + fallback handling
        +--> predictions.py    -> irrigation logic, crop scoring, alerts, advisories
        +--> data.py           -> farm metadata and fallback soil moisture
```

### Frontend

Key frontend folders:

- `src/App.tsx` – app routing and layout
- `src/context/AppContext.tsx` – language/theme settings
- `src/services/` – API calls and data access layer
- `src/pages/` – dashboard, farm, weather, irrigation, alerts, and advisory pages

### Backend

Key backend modules:

- `backend/app/main.py` – FastAPI entry point and route definitions
- `backend/app/weather.py` – weather provider integration and fallback logic
- `backend/app/predictions.py` – irrigation and crop prediction rules
- `backend/app/data.py` – sample farmer and farm profile data

## Features

- Weather dashboard with 5-day forecast
- Crop health score and condition assessment
- Irrigation recommendation engine
- Alert generation for heat, rainfall, and crop stress
- Advisory cards with action suggestions
- English/Hindi language support
- Local theme and language preferences via browser storage
- Fallback sample data when external weather services fail

## Project status

This project is currently an MVP and uses:

- sample farm profile data
- estimated soil moisture instead of live sensor input
- a transparent rule-based prediction model instead of a trained ML model

This keeps the system easy to inspect, test, and evolve.

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Create and activate a Python environment

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

### 2. Install frontend dependencies

```powershell
npm install
```

### 3. Start the backend

```powershell
python -m uvicorn app.main:app --app-dir backend --reload
```

### 4. Start the frontend

```powershell
npm run dev
```

The frontend runs on:

```text
http://127.0.0.1:5173
```

The backend runs on:

```text
http://127.0.0.1:8000
```

### Optional API base configuration

The frontend uses `/api` by default and proxies to the local FastAPI app. If needed, you can override it with:

```powershell
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000"
```

## Usage

After both services are running:

1. Open the frontend in the browser.
2. Navigate through the Dashboard, Weather, Farm, Crop Health, Irrigation, Alerts, and Advisory pages.
3. Review live or fallback weather data.
4. Use recommendations to decide irrigation timing and crop action.
5. Switch language or theme from the settings area.

## Pipelines

### Weather pipeline

1. Backend requests weather data from Open-Meteo.
2. Data is normalized into consistent current and forecast fields.
3. If the source fails or returns incomplete data, it falls back to sample weather values.
4. Cached results are refreshed every 10 minutes.

### Prediction pipeline

1. Weather and soil conditions are passed into the prediction engine.
2. The engine evaluates rainfall, temperature, moisture, and humidity.
3. It computes irrigation status and crop health score.
4. Alerts and advisory objects are generated for the UI.

## API endpoints

All routes are under `/api` and accept an optional `language` query parameter, for example: `?language=hi`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check for the backend service |
| GET | `/api/farmer` | Farmer profile information |
| GET | `/api/farm` | Farm details and geographic metadata |
| GET | `/api/weather` | Current weather and 5-day forecast |
| GET | `/api/irrigation` | Irrigation recommendation |
| GET | `/api/crop-health` | Crop condition summary and score |
| GET | `/api/alerts` | Weather and crop alerts |
| GET | `/api/advisories` | Farmer guidance and next actions |

### Example response

#### Health check

```json
{
  "status": "ok",
  "service": "cropsense-api"
}
```

#### Weather

```json
{
  "current": {
    "temperature": 28.8,
    "weatherCondition": "Partly cloudy",
    "humidity": 62,
    "rainProbability": 20,
    "windSpeed": 10.1,
    "rainfall": 0.0,
    "feelsLike": 29.3,
    "icon": "CloudSun",
    "lastUpdated": "2026-10-11T12:34:56+00:00"
  },
  "forecast": [
    {
      "date": "2026-10-11",
      "dayName": "Today",
      "tempMax": 30.0,
      "tempMin": 21.0,
      "weatherCondition": "Partly cloudy",
      "rainProbability": 20,
      "expectedRainfall": 0.0,
      "icon": "CloudSun"
    }
  ],
  "dataSource": "Open-Meteo",
  "isFallback": false
}
```

## Validation

Run the project checks with:

```powershell
python -m unittest discover -s backend/tests
npm run build
npm run lint
```

## Repository structure

```text
CropSense/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── data.py
│   │   ├── main.py
│   │   ├── predictions.py
│   │   ├── weather.py
│   │   └── __init__.py
│   ├── requirements.txt
│   └── tests/
│       └── test_predictions.py
├── public/
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── i18n.ts
│   ├── index.css
│   └── main.tsx
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── .gitignore
```

## Future scope

- connect to real farm sensor data
- replace rule-based logic with an ML or AI model
- add database-backed farm records and user auth
- support historical analytics and multi-farm management
- expand irrigation automation and remote monitoring

## Summary

CropSense is a practical crop advisory and monitoring dashboard designed for clear, actionable agricultural guidance. It combines weather intelligence, crop logic, and a simple interface to support farm decision-making in an easy-to-extend MVP format.
