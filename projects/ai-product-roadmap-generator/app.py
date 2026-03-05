from pathlib import Path

import streamlit as st

from roadmap_generator.charts import (
    build_impact_effort_chart,
    build_quarterly_roadmap_chart,
)
from roadmap_generator.llm import generate_roadmap_summary
from roadmap_generator.prioritization import (
    load_feature_ideas,
    prioritize_features,
)


DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="AI Product Roadmap Generator", layout="wide")


def main() -> None:
    st.title("AI Product Roadmap Generator")
    st.write("Convert product strategy inputs into a transparent roadmap proposal.")

    business_goals = st.text_area(
        "Business goals",
        value="Grow self-serve revenue, improve activation, and reduce churn in mid-market accounts.",
        height=100,
    )
    customer_feedback = st.text_area(
        "Customer feedback",
        value=(
            "Customers want better collaboration, deeper reporting, Slack alerts, and faster onboarding."
        ),
        height=100,
    )
    product_metrics = st.text_area(
        "Product metrics",
        value="Activation rate is 32%, weekly retention is 41%, and report sharing adoption is 18%.",
        height=100,
    )

    uploaded_file = st.file_uploader("Upload feature idea CSV", type="csv")
    feature_ideas = load_feature_ideas(uploaded_file or DATA_DIR / "sample_feature_ideas.csv")

    if st.button("Generate roadmap"):
        prioritized_features = prioritize_features(feature_ideas)
        st.session_state["roadmap_features"] = prioritized_features
        st.session_state["roadmap_summary"] = generate_roadmap_summary(
            business_goals,
            customer_feedback,
            product_metrics,
            prioritized_features,
        )

    prioritized_features = st.session_state.get("roadmap_features")
    if prioritized_features is None:
        st.info("Generate the roadmap to see prioritization results.")
        return

    metric_columns = st.columns(3)
    metric_columns[0].metric("Features scored", len(prioritized_features))
    metric_columns[1].metric(
        "Top priority",
        prioritized_features.iloc[0]["feature"],
    )
    metric_columns[2].metric(
        "Average priority score",
        round(prioritized_features["priority_score"].mean(), 1),
    )

    st.subheader("Roadmap summary")
    st.write(st.session_state["roadmap_summary"])

    left_column, right_column = st.columns(2)
    with left_column:
        st.plotly_chart(build_impact_effort_chart(prioritized_features), use_container_width=True)
    with right_column:
        st.plotly_chart(build_quarterly_roadmap_chart(prioritized_features), use_container_width=True)

    st.subheader("Prioritized feature list")
    st.dataframe(prioritized_features, use_container_width=True, hide_index=True)


if __name__ == "__main__":
    main()

