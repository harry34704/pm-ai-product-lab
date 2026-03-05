from __future__ import annotations

from typing import Dict


HIGH_DEMAND_KEYWORDS = {
    "ai",
    "automation",
    "compliance",
    "healthcare",
    "finance",
    "education",
    "sports",
    "workflow",
    "analytics",
}

HIGH_MONETIZATION_KEYWORDS = {
    "b2b",
    "subscription",
    "saas",
    "enterprise",
    "marketplace",
    "usage-based",
}

HIGH_RISK_KEYWORDS = {
    "regulated",
    "hardware",
    "logistics",
    "crypto",
    "social",
    "consumer",
    "medical",
}

DEFENSIBILITY_KEYWORDS = {
    "integration",
    "workflow",
    "automation",
    "proprietary",
    "benchmark",
    "network",
}


def _keyword_score(text: str, keywords: set[str], hit_points: int, base_score: int) -> int:
    normalized = text.lower()
    hits = sum(1 for keyword in keywords if keyword in normalized)
    return min(100, base_score + hits * hit_points)


def calculate_scores(product_idea: str, target_customer: str, business_model: str) -> Dict[str, int]:
    combined_text = f"{product_idea} {target_customer} {business_model}".lower()

    demand_score = _keyword_score(combined_text, HIGH_DEMAND_KEYWORDS, hit_points=9, base_score=48)
    monetization_score = _keyword_score(
        combined_text, HIGH_MONETIZATION_KEYWORDS, hit_points=12, base_score=40
    )
    defensibility_score = _keyword_score(
        combined_text, DEFENSIBILITY_KEYWORDS, hit_points=10, base_score=38
    )
    risk_score = _keyword_score(combined_text, HIGH_RISK_KEYWORDS, hit_points=8, base_score=28)

    viability_score = round(
        demand_score * 0.35
        + monetization_score * 0.25
        + defensibility_score * 0.2
        + (100 - risk_score) * 0.2
    )
    market_opportunity_score = round(demand_score * 0.55 + monetization_score * 0.2 + 25)

    return {
        "demand_score": max(1, demand_score),
        "monetization_score": max(1, monetization_score),
        "defensibility_score": max(1, defensibility_score),
        "risk_score": max(1, risk_score),
        "viability_score": max(1, min(100, viability_score)),
        "market_opportunity_score": max(1, min(100, market_opportunity_score)),
    }

