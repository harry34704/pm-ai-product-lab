# Architecture Overview

`pm-ai-product-lab` is structured as a multi-project Python repository. Each runnable project is intentionally isolated so contributors can understand, run, and extend one app without needing to untangle cross-project coupling.

The repository also includes a static portfolio website at the root. That site is deployed through GitHub Pages and acts as the public presentation layer for the codebase.

## Core Principles

- Every project is independently runnable with `streamlit run app.py`
- Shared dependency management is centralized at the repository root
- Local project packages keep logic separate from presentation
- Sample datasets make every dashboard immediately demoable
- SQLite is used where lightweight persistence adds portfolio realism

## Repository Layers

### 1. Presentation Layer

Each app exposes a Streamlit `app.py` entrypoint. The UI layer focuses on:

- collecting inputs
- handling uploads
- managing lightweight session state
- rendering charts, tables, and exported output

At the repository root, the static website uses:

- `index.html` for the main portfolio experience
- `project.html` for project detail views
- `script.js` for project metadata rendering and interaction
- `style.css` for the responsive visual system

### 2. Domain Logic Layer

Each project keeps product logic in a dedicated package:

- `validator/`
- `analytics_dashboard/`
- `customer_insights/`
- `ab_testing/`
- `sports_predictor/`
- `roadmap_generator/`

These modules contain scoring, analysis, model training, chart generation, or storage helpers. This keeps analytical behavior testable and avoids placing business logic directly inside the Streamlit scripts.

### 3. Data Layer

The repository uses three local data patterns:

- CSV sample datasets for demo-ready analytics and ML flows
- SQLite databases for persisted reports and experiment definitions
- Markdown teardown files for the documentation portfolio

## AI Integration Pattern

The AI-oriented apps use the same operating model:

1. Try to call the OpenAI API when `OPENAI_API_KEY` is present.
2. Fall back to deterministic local logic if the key is absent or the request fails.
3. Continue rendering the app successfully either way.

This makes the projects portable for demos, code review, and local development without turning API access into a hard runtime dependency.

## Why This Structure Works

- It mirrors how a maintainer would split UI, analytics, and persistence in a small open-source app.
- It makes each project easy to reason about and modify.
- It preserves a clean portfolio story: product strategy, analytics, experimentation, ML, teardown thinking, and public presentation all live in one lab with consistent structure.
