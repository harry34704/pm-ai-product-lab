# AI Sports Predictor

Train a simple match outcome model and generate win probability predictions.

## Features

- Upload match history or use the sample dataset
- Train a logistic regression model with scikit-learn
- Review accuracy and ROC-AUC metrics
- Inspect feature importance
- Visualize team performance trends
- Generate probability-based predictions from a simple form

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Expected CSV columns:

- `date` (optional, auto-generated if missing)
- `team`
- `opponent`
- `team_rating`
- `opponent_rating`
- `recent_form`
- `opponent_form`
- `home_game`
- `rest_days`
- `opponent_rest_days`
- `won`
