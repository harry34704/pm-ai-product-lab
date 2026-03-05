# Product Analytics Dashboard

A lightweight Mixpanel-style analytics dashboard built with Streamlit, Pandas, and Plotly.

## Features

- Upload event CSVs or use the included sample dataset
- Daily active user trend
- Funnel conversion analysis
- Retention cohort heatmap
- Feature adoption breakdown

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Expected CSV columns:

- `user_id`
- `event_name`
- `event_time`
- `feature`
- `plan`
- `platform`

