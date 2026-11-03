"""Train compact residual-temperature and rain-occurrence baseline models."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd

from .evaluate import MODEL_VERSION, _fit, evaluate_frame


def train(data_path: Path, artifact_path: Path) -> Path:
    """Evaluate first, then fit production artefacts on all supplied rows."""
    frame = pd.read_csv(data_path)
    metrics = evaluate_frame(frame)
    metrics_path = artifact_path.with_name("metrics.json")
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    metrics["trained_at_utc"] = datetime.now(timezone.utc).isoformat()
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    if not metrics["promotion_gate"]["passed"]:
        raise ValueError(
            f"Model failed the promotion gate; metrics were saved to {metrics_path}, "
            "and no serving artifact was written."
        )
    models = _fit(frame)
    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"version": MODEL_VERSION, **models}, artifact_path)
    return artifact_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True, help="CSV following backend/ml/README.md schema")
    parser.add_argument("--output", type=Path, default=Path(__file__).parent / "artifacts" / "weather_model.joblib")
    args = parser.parse_args()
    print(f"Trained model saved to {train(args.data, args.output)}")


if __name__ == "__main__":
    main()
