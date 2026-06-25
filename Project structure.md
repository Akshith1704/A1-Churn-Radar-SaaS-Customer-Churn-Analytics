A1-Churn-Radar-SaaS-Customer-Churn-Analytics/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── data/
│   ├── raw/
│   │   └── .gitkeep
│   ├── processed/
│   │   └── .gitkeep
│   └── external/
│       └── .gitkeep
│
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_data_cleaning.ipynb
│   ├── 03_eda.ipynb
│   ├── 04_feature_engineering.ipynb
│   ├── 05_model_training.ipynb
│   └── 06_model_evaluation.ipynb
│
├── src/
│   ├── data/
│   │   ├── load_data.py
│   │   ├── preprocess.py
│   │   └── validation.py
│   │
│   ├── features/
│   │   └── feature_engineering.py
│   │
│   ├── models/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── evaluate.py
│   │
│   ├── visualization/
│   │   ├── plots.py
│   │   └── dashboard_charts.py
│   │
│   └── utils/
│       ├── config.py
│       └── helper.py
│
├── dashboard/
│   ├── app.py
│   ├── pages/
│   │   ├── 1_Health.py
│   │   ├── 2_Segments.py
│   │   ├── 3_At_Risk.py
│   │   └── 4_Why_They_Left.py
│   │
│   └── assets/
│       └── logo.png
│
├── models/
│   └── model.pkl
│
├── sql/
│   ├── business_queries.sql
│   ├── churn_queries.sql
│   └── revenue_queries.sql
│
├── reports/
│   ├── insights_report.pdf
│   ├── presentation.pptx
│   └── screenshots/
│
├── docs/
│   ├── architecture.png
│   ├── project_roadmap.md
│   ├── thinking_artifact.md
│   │
│   ├── adr/
│   │   ├── ADR-001.md
│   │   ├── ADR-002.md
│   │   └── ADR-003.md
│   │
│   └── images/
│
├── tests/
│   ├── test_data.py
│   ├── test_model.py
│   └── test_dashboard.py
│
├── requirements.txt
├── README.md
├── .gitignore
├── LICENSE
├── docker-compose.yml
└── README_IMAGES/