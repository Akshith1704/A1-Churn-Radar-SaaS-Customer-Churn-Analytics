import io
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer


def load_csv_from_package():
    path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'defaultCsvData.ts')
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    # the file exports a JS template string; extract the CSV between backticks
    start = text.find('`')
    end = text.rfind('`')
    csv = text[start+1:end]
    return pd.read_csv(io.StringIO(csv))


def preprocess_and_train(df: pd.DataFrame):
    df = df.copy()
    # drop customerID
    if 'customerID' in df.columns:
        df = df.drop(columns=['customerID'])

    # convert TotalCharges to numeric (coerce errors)
    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')

    # target
    df = df.dropna(subset=['Churn'])
    y = (df['Churn'].str.lower() == 'yes').astype(int)
    X = df.drop(columns=['Churn'])

    # identify numeric and categorical
    numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_cols),
            ('cat', categorical_transformer, categorical_cols),
        ]
    )

    clf = RandomForestClassifier(n_estimators=100, random_state=42)

    pipeline = Pipeline(steps=[('pre', preprocessor), ('clf', clf)])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    pipeline.fit(X_train, y_train)

    acc = pipeline.score(X_test, y_test)
    print(f"Test accuracy: {acc:.4f}")

    # save pipeline
    os.makedirs('ml/artifacts', exist_ok=True)
    joblib.dump(pipeline, 'ml/artifacts/churn_pipeline.joblib')
    print('Saved model to ml/artifacts/churn_pipeline.joblib')


if __name__ == '__main__':
    df = load_csv_from_package()
    preprocess_and_train(df)
