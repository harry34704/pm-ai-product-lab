from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def build_conversion_chart(aggregated_results: pd.DataFrame):
    return px.bar(
        aggregated_results,
        x="variant",
        y="conversion_rate",
        text="conversion_rate",
        color="variant",
        title="Conversion Rate by Variant",
        template="plotly_white",
    )


def build_uplift_chart(summary: dict):
    figure = go.Figure()
    figure.add_trace(
        go.Indicator(
            mode="number+delta",
            value=summary["variant_rate"] * 100,
            delta={"reference": summary["control_rate"] * 100, "relative": True},
            title={"text": "Variant Conversion (%)"},
        )
    )
    figure.update_layout(template="plotly_white", title="Observed Uplift")
    return figure


def build_segment_chart(segment_summary: pd.DataFrame):
    return px.bar(
        segment_summary,
        x="segment",
        y="conversion_rate",
        color="variant",
        barmode="group",
        title="Segment Conversion Comparison",
        template="plotly_white",
    )
