from pathlib import Path

import pandas as pd
import streamlit as st

from analytics_dashboard.charts import (
    build_dau_chart,
    build_feature_adoption_chart,
    build_funnel_chart,
    build_retention_heatmap,
)
from analytics_dashboard.metrics import (
    calculate_dau,
    calculate_feature_adoption,
    calculate_funnel,
    calculate_retention_cohorts,
    load_events,
)


DATA_DIR = Path(__file__).parent / "data"
DEFAULT_FUNNEL = ["signup", "activate_workspace", "create_dashboard", "share_report"]


st.set_page_config(page_title="Product Analytics Dashboard", layout="wide")


def main() -> None:
    st.title("Product Analytics Dashboard")
    st.write("Upload event data to explore DAU, funnel conversion, retention, and feature adoption.")

    uploaded_file = st.file_uploader("Upload event CSV", type="csv")
    events = load_events(uploaded_file or DATA_DIR / "sample_events.csv")

    min_date = events["event_time"].dt.date.min()
    max_date = events["event_time"].dt.date.max()
    date_range = st.sidebar.date_input("Date range", value=(min_date, max_date))

    if isinstance(date_range, tuple) and len(date_range) == 2:
        start_date, end_date = date_range
        filtered_events = events[
            (events["event_time"].dt.date >= start_date)
            & (events["event_time"].dt.date <= end_date)
        ].copy()
    else:
        filtered_events = events.copy()

    plan_filter = st.sidebar.multiselect(
        "Plan filter",
        options=sorted(filtered_events["plan"].dropna().unique().tolist()),
        default=sorted(filtered_events["plan"].dropna().unique().tolist()),
    )
    platform_filter = st.sidebar.multiselect(
        "Platform filter",
        options=sorted(filtered_events["platform"].dropna().unique().tolist()),
        default=sorted(filtered_events["platform"].dropna().unique().tolist()),
    )

    filtered_events = filtered_events[
        filtered_events["plan"].isin(plan_filter) & filtered_events["platform"].isin(platform_filter)
    ]

    if filtered_events.empty:
        st.warning("No events match the current filters.")
        return

    dau = calculate_dau(filtered_events)
    available_steps = sorted(filtered_events["event_name"].unique().tolist())
    default_steps = [step for step in DEFAULT_FUNNEL if step in available_steps] or available_steps
    funnel_steps = st.sidebar.multiselect(
        "Funnel steps",
        options=available_steps,
        default=default_steps,
    )
    funnel = calculate_funnel(filtered_events, funnel_steps)
    retention = calculate_retention_cohorts(filtered_events)
    feature_adoption = calculate_feature_adoption(filtered_events)

    metric_columns = st.columns(4)
    metric_columns[0].metric("Unique users", filtered_events["user_id"].nunique())
    metric_columns[1].metric("Events", len(filtered_events))
    metric_columns[2].metric("Average DAU", round(dau["active_users"].mean(), 1))
    metric_columns[3].metric("Tracked features", feature_adoption["feature"].nunique())

    st.plotly_chart(build_dau_chart(dau), use_container_width=True)

    left_column, right_column = st.columns(2)
    with left_column:
        st.subheader("Funnel analysis")
        st.plotly_chart(build_funnel_chart(funnel), use_container_width=True)
        st.dataframe(funnel, use_container_width=True, hide_index=True)
    with right_column:
        st.subheader("Feature adoption")
        st.plotly_chart(build_feature_adoption_chart(feature_adoption), use_container_width=True)
        st.dataframe(feature_adoption, use_container_width=True, hide_index=True)

    st.subheader("Retention cohorts")
    st.plotly_chart(build_retention_heatmap(retention), use_container_width=True)
    st.dataframe(retention, use_container_width=True)


if __name__ == "__main__":
    main()
