# AI Product Validator

Evaluate startup ideas with AI-assisted reasoning, heuristic product scoring, SWOT output, and SQLite-backed report history.

## Features

- Idea intake form for product idea, target customer, and business model
- SWOT analysis and market commentary
- Product viability and market opportunity scoring
- Competitor suggestions based on the problem space
- Report generation with downloadable markdown
- SQLite storage for previous analyses

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Optional environment variable:

```bash
export OPENAI_API_KEY=your_key_here
```

Without an API key the app uses a deterministic local analysis fallback.

