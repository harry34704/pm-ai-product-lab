# AI Product Roadmap Generator

Generate a prioritized roadmap from goals, feedback, metrics, and feature ideas.

## Features

- Accepts business goals, customer feedback, product metrics, and feature ideas
- Scores features with a RICE-style model
- Produces a prioritized feature list
- Visualizes impact vs effort and a quarterly roadmap
- Adds an optional AI-generated PM narrative when `OPENAI_API_KEY` is available

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Expected CSV columns:

- `feature`
- `description`
- `reach`
- `impact`
- `confidence`
- `effort`
- `strategic_fit`
- `feedback_volume`

