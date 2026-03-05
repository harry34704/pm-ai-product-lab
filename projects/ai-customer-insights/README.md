# AI Customer Insights

Analyze support tickets to surface PM-ready insight from customer feedback.

## Features

- Upload support ticket datasets or use the included sample
- Sentiment scoring with a deterministic fallback
- Issue categorization across common product themes
- Feature request and bug detection
- Trend dashboards built with Plotly, including bug and feature-request trends
- Optional OpenAI-generated insight summary

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Expected CSV columns:

- `ticket_id`
- `created_at`
- `channel`
- `customer_tier`
- `subject`
- `description`
