from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title='Churn Predictor')

class Customer(BaseModel):
    # accept arbitrary fields; using dict is easier
    data: dict


@app.on_event('startup')
def load_model():
    global pipeline
    pipeline = joblib.load('ml/artifacts/churn_pipeline.joblib')


@app.post('/predict')
def predict(payload: Customer):
    df = pd.DataFrame([payload.data])
    proba = pipeline.predict_proba(df)[0, 1]
    pred = int(proba >= 0.5)
    return {'churn_probability': float(proba), 'churn': bool(pred)}
