# A1-Churn-Radar

A customer churn analytics project with a user-facing dashboard and dataset explorer.

## Repository layout

`
A1-Churn-Radar/
│
├── Dashboard/
│   └── ChurnDashboard.pbix
│
├── Dataset/
│   └── customer_churn.csv
│
├── EDA/
│   └── Churn_EDA.ipynb
│
├── WebApp/
│
├── Images/
│   └── .gitkeep
│
├── README.md
│
└── requirements.txt
`

## Quick start

1. Open WebApp in VS Code.
2. Install npm dependencies:

`ash
cd WebApp
npm install
`

3. Run the frontend locally:

`ash
npm run dev
`

4. Open the app in your browser at the address shown by Vite.

## Notes

- The app is a front-end dashboard for churn analytics and dataset exploration.
- The dataset is located in Dataset/customer_churn.csv.
- No machine learning training or Python model server is included in this repository.
