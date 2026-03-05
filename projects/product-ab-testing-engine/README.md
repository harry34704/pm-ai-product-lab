# Product A/B Testing Engine

Design experiments, upload results, and evaluate conversion uplift with statistical testing.

## Features

- Create experiment definitions and persist them in SQLite
- Define control and treatment labels
- Upload experiment result CSVs or use the included sample
- Compare A/B conversion rates
- Calculate uplift, confidence interval, z-score, and p-value
- Visualize experiment results and segment differences with Plotly

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Expected CSV columns:

- `date`
- `experiment_name`
- `variant`
- `visitors`
- `conversions`
- `segment`
