from __future__ import annotations

import pandas as pd
import plotly.express as px


def build_issue_frequency_chart(enriched_tickets: pd.DataFrame):
    issue_counts = (
        enriched_tickets["issue_category"]
        .value_counts()
        .rename_axis("issue_category")
        .reset_index(name="count")
    )
    return px.bar(
        issue_counts,
        x="issue_category",
        y="count",
        title="Issue Frequency",
        template="plotly_white",
    )


def build_sentiment_trend_chart(enriched_tickets: pd.DataFrame):
    sentiment_trend = (
        enriched_tickets.groupby("created_date")["sentiment_score"]
        .mean()
        .reset_index()
    )
    return px.line(
        sentiment_trend,
        x="created_date",
        y="sentiment_score",
        markers=True,
        title="Sentiment Trend",
        template="plotly_white",
    )


def build_bug_trend_chart(enriched_tickets: pd.DataFrame):
    bug_trend = (
        enriched_tickets.groupby(["created_date", "is_bug"])
        .size()
        .reset_index(name="tickets")
    )
    bug_trend["bug_type"] = bug_trend["is_bug"].map({True: "Bug", False: "Non-bug"})
    return px.bar(
        bug_trend,
        x="created_date",
        y="tickets",
        color="bug_type",
        barmode="stack",
        title="Bug Trend",
        template="plotly_white",
    )


def build_feature_request_trend_chart(enriched_tickets: pd.DataFrame):
    feature_request_trend = (
        enriched_tickets.groupby(["created_date", "is_feature_request"])
        .size()
        .reset_index(name="tickets")
    )
    feature_request_trend["request_type"] = feature_request_trend["is_feature_request"].map(
        {True: "Feature request", False: "Other ticket"}
    )
    return px.bar(
        feature_request_trend,
        x="created_date",
        y="tickets",
        color="request_type",
        barmode="group",
        title="Feature Request Trend",
        template="plotly_white",
    )
