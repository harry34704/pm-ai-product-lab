from __future__ import annotations

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def build_feature_importance_chart(feature_importance: pd.DataFrame):
    return px.bar(
        feature_importance,
        x="importance",
        y="feature",
        orientation="h",
        title="Feature Importance",
        template="plotly_white",
    )


def build_confusion_matrix_chart(confusion: np.ndarray):
    return px.imshow(
        confusion,
        text_auto=True,
        x=["Predicted Loss", "Predicted Win"],
        y=["Actual Loss", "Actual Win"],
        color_continuous_scale="Blues",
        title="Confusion Matrix",
    )


def build_probability_chart(probability: float):
    figure = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=probability * 100,
            gauge={"axis": {"range": [0, 100]}},
            title={"text": "Predicted Win Probability"},
        )
    )
    figure.update_layout(template="plotly_white")
    return figure


def build_performance_trend_chart(performance_trend: pd.DataFrame, selected_team: str):
    team_trend = performance_trend[performance_trend["team"] == selected_team]
    return px.line(
        team_trend,
        x="team_match_number",
        y="rolling_win_rate",
        markers=True,
        title=f"{selected_team} Rolling Win Rate",
        template="plotly_white",
        labels={
            "team_match_number": "Match number",
            "rolling_win_rate": "Rolling win rate",
        },
    )
