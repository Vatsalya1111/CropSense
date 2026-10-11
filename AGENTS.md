# AGENTS.md

Guidance for AI coding agents working on CropSense. Read this before changing code.

## Project

CropSense is a hyperlocal agrometeorological advisory system for Karnataka farmers. It turns coarse weather forecasts into corrected local forecasts, then into crop-aware actions: irrigation, spraying, alerts, advisories.

Pipeline: `get_weather()` (Open-Meteo) → `refine_weather()` (ML, being added) → `predict()` (rules) → alerts and advisories → React dashboard.

The forecast model and the advisory logic are deliberately separate. The ML model corrects weather values. It does not decide irrigation or crop health.

## Repo layout

- `backend/app/main.py`: FastAPI routes, 10-minute weather cache, Hindi weather labels
- `backend/app/weather.py`: Open-Meteo client, normalisation, fallback weather
- `backend/app/predictions.py`: `predict()`, `build_alerts()`, `build_advisories()`
- `backend/app/data.py`: sample farmer and farm profile, fallback soil moisture
- `backend/tests/`: unittest suite
- `backend/ml/` (planned): `features.py`, `train.py`, `evaluate.py`, data, model artifacts
- `src/`: React + TypeScript + Vite frontend; API access only through `src/services/`

## Commands

Run from the repo root. The README uses PowerShell on Windows.

- Backend: `python -m uvicorn app.main:app --app-dir backend --reload` (port 8000)
- Frontend: `npm run dev` (port 5173, proxies `/api` to 8000)
- Tests: `python -m unittest backend.tests.test_predictions`

Run the tests after every backend change. Add tests in the same unittest style, with `unittest.mock.patch` for network calls. Tests must never hit the network.

## Contracts that must not break

- The frontend reads the JSON shapes produced by `normalize_weather()`, `predict()`, `build_alerts()` and `build_advisories()`. New fields must be additive and optional. Do not rename or remove existing keys.
- Keep the `predict(weather, soil_moisture, soil_source, farm, language)` signature stable.
- Every route accepts `?language=en|hi`. New user-facing strings need both languages.
- CORS is GET-only for `localhost:5173`. Do not widen it without a reason.
- Anything estimated, fallback or model-derived must say so through `dataSource`, `isFallback`, `modelVersion` or equivalent. Never present an estimate as a live measurement.

## Failure behaviour

Follow the existing pattern in `weather.py`: on any provider or model failure, degrade to a clearly labelled fallback instead of raising. `refine_weather()` must return its input unchanged if the model file is missing or errors.

## ML rules

- One feature builder in `backend/ml/features.py`, imported by both training and serving. Never re-implement features in two places.
- Use only features the live backend can produce at request time. No future leakage.
- Time-ordered splits plus leave-one-location-out. Never random splits on time series.
- Always compare against the raw coarse forecast as baseline. Report MAE and RMSE for temperature, precision, recall and F1 for rain occurrence (rainy day is 2.5 mm or more).
- Start with Ridge, DecisionTree or logistic regression. Move to a heavier model only if the simple one underperforms, and record why.
- Training truth is gridded data (ERA5-Land, NASA POWER), not gauges or sensors. Describe any reported lift as lift against a proxy.
- Save metrics to `metrics.json` next to the model artifact. Version the model string and return it in responses.

## Known gaps (current state)

- Sample farm in `data.py` is Sitapur, UP, wheat. The project and model are Karnataka. Change the farm to a Karnataka location with an elevation field.
- `FALLBACK_SOIL_MOISTURE` is a constant 32, so "Irrigate immediately" (below 25) can never fire.
- `predict()` ignores crop type and stage. Thresholds belong in a crop config, not inline.
- `normalize_weather()` assumes index 0 of the daily arrays is today. Adding `past_days` to the request breaks this unless past and future are split first.
- UI languages are English and Hindi only. Kannada is not supported yet.

## Out of scope for now

IMD and satellite ingestion, ESP32 sensors, deep learning, database, auth, mandi prices, disease image diagnosis, chatbot. Do not start these without being asked.

## Working with the developer

The developer is new to ML and comfortable with Python fundamentals only. When adding ML code, keep it small and readable, prefer pandas and scikit-learn idioms, and add a short comment on why a step exists (for example why a residual is predicted instead of the raw value). Explain a new library or concept in one or two sentences the first time it appears. Make small, reviewable changes rather than large rewrites.

## Style

- Python: type hints, `from __future__ import annotations`, small pure functions, no new dependency without adding it to `backend/requirements.txt`.
- TypeScript: types in `src/types`, network calls only in `src/services`.
- Do not commit raw datasets or large model files. Document the command that regenerates them.