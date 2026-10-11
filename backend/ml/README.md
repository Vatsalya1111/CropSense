# Weather model training

The API optionally loads the generated artifact at process runtime. The model estimates temperature
residuals (`gridded truth - coarse forecast`) because the existing forecast is
already useful information; adding a learned correction is a small correction
task. Rain occurrence is rainy when daily precipitation is at least 2.5 mm.

## Input CSV

Use one row per location, date, and forecast lead. Use archived coarse forecast
values and ERA5-Land or NASA POWER gridded truth, not future observations as
features. Gridded truth is a proxy, not a farm-gauge measurement.

Required columns:

`date,location_id,latitude,longitude,elevation_m,forecast_lead_days,forecast_temp_max_c,forecast_temp_min_c,forecast_rain_probability_pct,forecast_precipitation_mm,observed_temp_max_c,observed_temp_min_c,observed_precipitation_mm`

`location_id` is used only for leave-one-location-out evaluation, never as a
model feature. Features are created only by `features.build_features()` for
both training and eventual serving.

## Train and evaluate

From the repository root, after installing `backend/requirements.txt`:

```powershell
python -m backend.ml.evaluate --data path\to\prepared_weather.csv
python -m backend.ml.train --data path\to\prepared_weather.csv
```

Evaluation compares raw forecasts with corrected temperatures using MAE/RMSE,
and raw/corrected rain occurrence using precision, recall, and F1. It reports
an 80/20 time-ordered holdout and leave-one-location-out folds. Do not promote a
model unless corrected MAE for both temperatures and rain F1 improve on both
the chronological holdout and the average leave-one-location-out fold. Training
always writes `metrics.json`; it writes `weather_model.joblib` only when this
promotion gate passes, so an underperforming model cannot replace the live
baseline. Restart the API after generating a model because artefacts load once
per process. Keep raw
datasets and generated model binaries out of version control; retain the
small metrics file with any reviewed model release.

The live adapter in `serve.py` uses the same feature builder. It adjusts daily
maximum/minimum temperature and rain probability only; current-hour temperature
and rainfall amount remain provider values. If the artifact is missing, invalid,
or inference fails, it returns the original weather unchanged. Fallback sample
weather is never refined. Successful outputs include `modelVersion`,
`correctionApplied`, and `correctedFields` metadata.
