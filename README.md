# CropSense

CropSense is a React dashboard backed by a small FastAPI service. The backend fetches weather for the sample farm, falls back to labeled sample weather when the provider is unavailable, and derives irrigation and crop-risk guidance from those inputs.

## Run locally

Install the frontend dependencies with `npm install` if needed. In one terminal, start the backend from the project root:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload
```

In another terminal, start the frontend:

```powershell
npm run dev
```

The Vite development server proxies `/api` requests to `http://127.0.0.1:8000`. Set `VITE_API_BASE_URL` when the API is hosted elsewhere. The API health check is available at `/api/health`.

Farm profile details and soil moisture currently use labeled sample inputs. Soil moisture is estimated until a sensor source is connected. The prediction thresholds live in `backend/app/predictions.py` so the initial baseline can be replaced by the trained model later.

## Checks

```powershell
python -m unittest discover -s backend/tests
npm run build
npm run lint
```
