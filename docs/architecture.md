# Architecture Overview

`pm-ai-product-lab` is structured as a multi-project product portfolio repository with two clear layers:

1. a **static multi-page portfolio platform** at the root
2. a set of **independently runnable Streamlit apps** inside `projects/` and `product-teardowns/`

The static site is intentionally designed as the public presentation layer for the wider lab. It positions the apps as one integrated product platform rather than a loose collection of demos.

## Core Principles

- Every app remains independently runnable with `streamlit run app.py`
- The portfolio site remains fully static and deployable without a build step
- App metadata is centralised in `site-data.js` so copy, links, status badges, and deployment placeholders stay easy to update
- Sample datasets make each app immediately demoable
- The website and apps tell one coherent story across product strategy, analytics, experimentation, AI, and business analysis

## Repository Layers

### 1. Portfolio Presentation Layer

The portfolio website lives at the repository root and includes:

- `index.html`
- `about.html`
- `ai-product-lab.html`
- `projects.html`
- `contact.html`
- `404.html`
- `project.html` as a redirect shim
- `style.css`
- `script.js`
- `site-data.js`

This layer is responsible for:

- public-facing positioning
- premium portfolio copy
- responsive layout and UI system
- app dashboard rendering
- deployment placeholders for future live app links
- GitHub Pages or Netlify deployment

### 2. App Surface Layer

Each app exposes a Streamlit `app.py` entrypoint and remains isolated for clarity and portability:

- `projects/ai-product-validator`
- `projects/product-analytics-dashboard`
- `projects/ai-customer-insights`
- `projects/product-ab-testing-engine`
- `projects/sports-ai-predictor`
- `projects/ai-product-roadmap-generator`
- `product-teardowns`

### 3. Domain Logic Layer

Each project keeps its product logic in a local package so UI and business logic remain separate:

- `validator/`
- `analytics_dashboard/`
- `customer_insights/`
- `ab_testing/`
- `sports_predictor/`
- `roadmap_generator/`

This keeps scoring, charting, statistical logic, model logic, and storage concerns out of the Streamlit page layer.

### 4. Data Layer

The repository uses lightweight local data patterns:

- CSV sample datasets for analytics, insight, experimentation, ML, and planning flows
- SQLite databases for persisted reports and experiment definitions
- Markdown teardown files for strategy analysis
- Static image/SVG assets for the public website

## Why The Root Site Uses `site-data.js`

The root website is designed for easy portfolio maintenance. Centralising the content model in `site-data.js` means the following can be updated in one place:

- profile links
- GitHub repo base URLs
- CV location
- app names and categories
- screenshots
- status badges
- `launch_url`, `github_url`, and `details_url`
- datasets used
- business value and project copy

That approach keeps the static site easy to maintain as live deployments are added over time.
