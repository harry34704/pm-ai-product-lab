from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def build_dau_chart(dau: pd.DataFrame) -> go.Figure:
    return px.line(
        dau,
        x="event_date",
        y="active_users",
        markers=True,
        title="Daily Active Users",
        template="plotly_white",
    )


def build_funnel_chart(funnel: pd.DataFrame) -> go.Figure:
    return go.Figure(
        go.Funnel(
            y=funnel["step"],
            x=funnel["users"],
            textinfo="value+percent initial",
        )
    )


def build_retention_heatmap(retention: pd.DataFrame) -> go.Figure:
    return px.imshow(
        retention,
        text_auto=".0%",
        color_continuous_scale="Blues",
        aspect="auto",
        title="Retention Cohorts",
    )


def build_feature_adoption_chart(feature_adoption: pd.DataFrame) -> go.Figure:
    return px.bar(
        feature_adoption,
        x="feature",
        y="active_users",
        color="events",
        title="Feature Adoption",
        template="plotly_white",
    )

