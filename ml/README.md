# ML model: churn prediction

This folder contains a simple training script and a FastAPI prediction service.

Quick steps:

1. Create a Python environment and install requirements:

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\Activate.ps1 on Windows PowerShell
pip install -r ml/requirements.txt
```

2. Train the model using the bundled sample CSV:

```bash
python ml/train.py
```

3. Run the prediction API (after training):

```bash
uvicorn ml.predict_api:app --reload --port 8001
```

The API exposes `POST /predict` that accepts a JSON body with `data` mapping column names to values.
