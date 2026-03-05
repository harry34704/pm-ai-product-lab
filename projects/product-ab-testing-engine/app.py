from pathlib import Path

import streamlit as st

from ab_testing.charts import build_conversion_chart, build_segment_chart, build_uplift_chart
from ab_testing.stats import analyze_experiment_results, load_experiment_results
from ab_testing.storage import fetch_experiments, initialize_database, save_experiment


DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="Product A/B Testing Engine", layout="wide")


def render_experiment_definition() -> None:
    st.subheader("Define experiment")
    with st.form("experiment_form"):
        experiment_name = st.text_input("Experiment name", value="checkout-copy-test")
        hypothesis = st.text_area(
            "Hypothesis",
            value="Clearer pricing copy will increase checkout conversion.",
        )
        primary_metric = st.text_input("Primary metric", value="Checkout conversion rate")
        control_label = st.text_input("Control label", value="Current checkout copy")
        variant_label = st.text_input("Variant label", value="Benefit-led checkout copy")
        audience = st.text_input("Audience", value="New and returning checkout visitors")
        status = st.selectbox("Status", options=["draft", "running", "completed"])
        submitted = st.form_submit_button("Save experiment")

    if submitted:
        save_experiment(
            experiment_name,
            hypothesis,
            primary_metric,
            control_label,
            variant_label,
            audience,
            status,
        )
        st.success("Experiment saved to SQLite.")

    st.write("Saved experiments")
    st.dataframe(fetch_experiments(), use_container_width=True, hide_index=True)


def render_results_dashboard() -> None:
    st.subheader("Results dashboard")
    uploaded_file = st.file_uploader("Upload experiment results", type="csv")
    results = load_experiment_results(uploaded_file or DATA_DIR / "sample_experiment_results.csv")

    available_experiments = sorted(results["experiment_name"].unique().tolist())
    selected_experiment = st.selectbox("Select experiment", options=available_experiments)
    experiment_results = results[results["experiment_name"] == selected_experiment]
    summary, detailed_results, segment_summary = analyze_experiment_results(experiment_results)

    metric_columns = st.columns(4)
    metric_columns[0].metric("Control conversion", f"{summary['control_rate']:.2%}")
    metric_columns[1].metric("Variant conversion", f"{summary['variant_rate']:.2%}")
    metric_columns[2].metric("Relative uplift", f"{summary['relative_uplift']:.2%}")
    metric_columns[3].metric("P-value", f"{summary['p_value']:.4f}")

    significance_message = (
        "Statistically significant at the 95% confidence level."
        if summary["is_significant"]
        else "Not statistically significant at the 95% confidence level."
    )
    st.write(significance_message)
    st.write(
        f"Confidence interval for absolute lift: {summary['confidence_interval_low']:.2%} "
        f"to {summary['confidence_interval_high']:.2%}"
    )

    left_column, right_column = st.columns(2)
    with left_column:
        st.plotly_chart(build_conversion_chart(detailed_results), use_container_width=True)
    with right_column:
        st.plotly_chart(build_uplift_chart(summary), use_container_width=True)

    st.plotly_chart(build_segment_chart(segment_summary), use_container_width=True)
    st.subheader("Variant summary")
    st.dataframe(detailed_results, use_container_width=True, hide_index=True)
    st.subheader("Segment summary")
    st.dataframe(segment_summary, use_container_width=True, hide_index=True)


def main() -> None:
    initialize_database()
    st.title("Product A/B Testing Engine")
    tabs = st.tabs(["Experiment Setup", "Results"])
    with tabs[0]:
        render_experiment_definition()
    with tabs[1]:
        render_results_dashboard()


if __name__ == "__main__":
    main()
