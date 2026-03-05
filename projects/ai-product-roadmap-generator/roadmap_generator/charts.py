from __future__ import annotations

import pandas as pd
import plotly.express as px


def build_impact_effort_chart(prioritized_features: pd.DataFrame):
    return px.scatter(
        prioritized_features,
        x="effort",
        y="impact",
        size="reach",
        color="priority_bucket",
        hover_name="feature",
        text="feature",
        title="Impact vs Effort Matrix",
        template="plotly_white",
    )


def build_quarterly_roadmap_chart(prioritized_features: pd.DataFrame):
    return px.scatter(
        prioritized_features,
        x="quarter",
        y="priority_score",
        color="priority_bucket",
        size="effort",
        text="feature",
        title="Quarterly Roadmap View",
        template="plotly_white",
    )

