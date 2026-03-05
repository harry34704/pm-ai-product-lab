from __future__ import annotations

from datetime import datetime

from validator.llm import generate_optional_ai_summary
from validator.scoring import calculate_scores


COMPETITOR_MAP = {
    "analytics": ["Amplitude", "Mixpanel", "PostHog"],
    "support": ["Zendesk", "Intercom", "Freshdesk"],
    "roadmap": ["Productboard", "Aha!", "Jira Product Discovery"],
    "sports": ["StatsBomb", "Hudl", "Sportradar"],
    "finance": ["Brex", "Ramp", "Mercury"],
    "education": ["ClassDojo", "Coursera", "Khan Academy"],
    "ai": ["OpenAI", "Anthropic", "Perplexity"],
}


def _generate_competitor_suggestions(text: str) -> list[str]:
    normalized = text.lower()
    suggestions: list[str] = []
    for keyword, competitors in COMPETITOR_MAP.items():
        if keyword in normalized:
            suggestions.extend(competitors)
    return suggestions or ["Notion", "Airtable", "HubSpot"]


def _build_swot(product_idea: str, target_customer: str, scores: dict[str, int]) -> dict[str, list[str]]:
    return {
        "Strengths": [
            f"Targets {target_customer}, which narrows the initial go-to-market scope.",
            f"Demand score of {scores['demand_score']} suggests strong problem relevance.",
        ],
        "Weaknesses": [
            f"Defensibility score of {scores['defensibility_score']} indicates differentiation still needs proof.",
            "Narrative depends on clear positioning against incumbent workflows.",
        ],
        "Opportunities": [
            f"Market opportunity score of {scores['market_opportunity_score']} supports testing early demand.",
            f"{product_idea[:90]} can likely expand into adjacent workflow automation over time.",
        ],
        "Threats": [
            f"Risk score of {scores['risk_score']} reflects execution and adoption uncertainty.",
            "Competitors can move faster if the product relies on easily copied UX patterns.",
        ],
    }


def _fallback_summary(product_idea: str, target_customer: str, business_model: str, scores: dict[str, int]) -> str:
    return (
        f"This idea targets {target_customer} with a {business_model} model. "
        f"Demand looks strongest when the product solves a repeat workflow pain point, and the "
        f"current viability score of {scores['viability_score']} indicates the concept is worth a narrow MVP test. "
        f"Focus early validation on buyer urgency, willingness to pay, and the speed at which users can reach value."
    )


def analyze_product_idea(product_idea: str, target_customer: str, business_model: str) -> dict:
    scores = calculate_scores(product_idea, target_customer, business_model)
    prompt = f"""
    You are helping a product manager evaluate a startup concept.
    Product idea: {product_idea}
    Target customer: {target_customer}
    Business model: {business_model}

    Produce a concise analysis of market demand, competitor landscape, risks, and monetization potential.
    """
    summary = generate_optional_ai_summary(prompt) or _fallback_summary(
        product_idea, target_customer, business_model, scores
    )
    swot = _build_swot(product_idea, target_customer, scores)
    competitors = _generate_competitor_suggestions(
        f"{product_idea} {target_customer} {business_model}"
    )

    return {
        "created_at": datetime.utcnow().isoformat(timespec="seconds"),
        "product_idea": product_idea,
        "target_customer": target_customer,
        "business_model": business_model,
        "summary": summary,
        "swot": swot,
        "competitor_suggestions": competitors,
        "score_breakdown": scores,
        "viability_score": scores["viability_score"],
        "market_opportunity_score": scores["market_opportunity_score"],
        "risk_score": scores["risk_score"],
    }

