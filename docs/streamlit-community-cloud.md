# Streamlit Community Cloud Deployment Matrix

These are the exact values to use when creating the 7 Streamlit apps from the `pm-ai-product-lab` repository.

## Shared settings

- Repository: `harry34704/pm-ai-product-lab`
- Branch: `main`
- Python version: `3.9`
- Secrets: optional
  - No secrets are required for a successful launch
  - `OPENAI_API_KEY` is optional for AI-enhanced summaries

## App deployment entries

| App | Entrypoint file | Suggested subdomain |
| --- | --- | --- |
| AI Product Validator | `projects/ai-product-validator/app.py` | `harry-ai-product-validator` |
| Product Analytics Dashboard | `projects/product-analytics-dashboard/app.py` | `harry-product-analytics-dashboard` |
| AI Customer Insights | `projects/ai-customer-insights/app.py` | `harry-ai-customer-insights` |
| Product A/B Testing Engine | `projects/product-ab-testing-engine/app.py` | `harry-product-ab-testing-engine` |
| AI Sports Predictor | `projects/sports-ai-predictor/app.py` | `harry-ai-sports-predictor` |
| AI Product Roadmap Generator | `projects/ai-product-roadmap-generator/app.py` | `harry-ai-product-roadmap-generator` |
| Product Teardowns | `product-teardowns/app.py` | `harry-product-teardowns-studio` |

## Notes

- Community Cloud runs apps from the root of the repository, even when the app file is inside a subdirectory.
- This repository has been smoke-tested from the repo root using each of the entrypoint paths above.
- A shared root configuration file is present at `.streamlit/config.toml`, which will theme all deployed apps consistently.

## After deployment

After each app is live, copy the final URL into `site-data.js` as that app's `launch_url`, then commit and push.
