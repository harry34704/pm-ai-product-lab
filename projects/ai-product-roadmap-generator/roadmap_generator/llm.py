from __future__ import annotations

import os


def generate_optional_summary(prompt: str) -> str | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=prompt,
        )
        return response.output_text.strip()
    except Exception:
        return None


def generate_roadmap_summary(
    business_goals: str,
    customer_feedback: str,
    product_metrics: str,
    prioritized_features,
) -> str:
    top_features = prioritized_features.head(3)["feature"].tolist()
    prompt = f"""
    Create a concise roadmap summary for a product manager.
    Business goals: {business_goals}
    Customer feedback: {customer_feedback}
    Product metrics: {product_metrics}
    Top features: {top_features}
    """
    ai_summary = generate_optional_summary(prompt)
    if ai_summary:
        return ai_summary

    return (
        f"Prioritize {', '.join(top_features)} first because they align most directly with "
        "the stated business goals and the current customer pain points. The current roadmap "
        "weights activation and collaboration improvements ahead of lower-leverage polish work."
    )

