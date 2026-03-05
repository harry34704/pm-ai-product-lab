from __future__ import annotations

from pathlib import Path

import pandas as pd

from customer_insights.llm import generate_optional_summary


POSITIVE_WORDS = {"love", "great", "smooth", "fast", "helpful", "easy", "excellent"}
NEGATIVE_WORDS = {
    "broken",
    "bug",
    "slow",
    "error",
    "crash",
    "failed",
    "confusing",
    "frustrating",
    "issue",
    "cannot",
    "can't",
}

CATEGORY_KEYWORDS = {
    "Billing": ["invoice", "billing", "charge", "pricing", "refund"],
    "Onboarding": ["setup", "onboarding", "invite", "workspace", "login"],
    "Performance": ["slow", "lag", "performance", "loading", "timeout"],
    "Integrations": ["slack", "hubspot", "salesforce", "api", "integration"],
    "Analytics": ["dashboard", "report", "metric", "analytics", "chart"],
    "Notifications": ["email", "notification", "alert", "reminder"],
    "Mobile": ["ios", "android", "mobile", "phone"],
}

FEATURE_REQUEST_HINTS = ["would love", "please add", "feature request", "it would help", "could you add"]
BUG_HINTS = ["bug", "error", "broken", "crash", "failed", "cannot", "can't"]


def load_tickets(source) -> pd.DataFrame:
    tickets = pd.read_csv(source)
    tickets["created_at"] = pd.to_datetime(tickets["created_at"])
    return tickets.sort_values("created_at").reset_index(drop=True)


def _score_sentiment(text: str) -> float:
    normalized = text.lower()
    positive_hits = sum(1 for word in POSITIVE_WORDS if word in normalized)
    negative_hits = sum(1 for word in NEGATIVE_WORDS if word in normalized)
    return round((positive_hits - negative_hits) / max(1, positive_hits + negative_hits + 1), 2)


def _categorize_issue(text: str) -> str:
    normalized = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return category
    return "General Feedback"


def analyze_tickets(tickets: pd.DataFrame) -> pd.DataFrame:
    enriched = tickets.copy()
    combined_text = enriched["subject"].fillna("") + " " + enriched["description"].fillna("")
    enriched["issue_category"] = combined_text.apply(_categorize_issue)
    enriched["sentiment_score"] = combined_text.apply(_score_sentiment)
    enriched["is_feature_request"] = combined_text.str.lower().apply(
        lambda value: any(hint in value for hint in FEATURE_REQUEST_HINTS)
    )
    enriched["is_bug"] = combined_text.str.lower().apply(
        lambda value: any(hint in value for hint in BUG_HINTS)
    )
    enriched["created_date"] = enriched["created_at"].dt.date
    return enriched


def summarize_customer_insights(enriched_tickets: pd.DataFrame) -> str:
    category_summary = (
        enriched_tickets["issue_category"].value_counts().head(3).to_dict()
    )
    prompt = f"""
    Summarize the biggest product insights from these customer support tickets:
    Top categories: {category_summary}
    Feature requests: {int(enriched_tickets['is_feature_request'].sum())}
    Bug reports: {int(enriched_tickets['is_bug'].sum())}
    Average sentiment: {round(enriched_tickets['sentiment_score'].mean(), 2)}
    """
    ai_summary = generate_optional_summary(prompt)
    if ai_summary:
        return ai_summary

    top_category = max(category_summary, key=category_summary.get)
    return (
        f"The support queue is concentrated around {top_category.lower()} issues. "
        f"{int(enriched_tickets['is_bug'].sum())} tickets look bug-related and "
        f"{int(enriched_tickets['is_feature_request'].sum())} explicitly request new functionality. "
        "The clearest PM action is to reduce friction in the dominant category while validating "
        "whether repeated feature requests map to a single roadmap theme."
    )

