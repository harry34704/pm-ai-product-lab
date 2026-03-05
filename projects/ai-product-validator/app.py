from pathlib import Path

import pandas as pd
import streamlit as st

from validator.analysis import analyze_product_idea
from validator.report import (
    build_markdown_report,
    fetch_saved_reports,
    initialize_database,
    save_report,
)


DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="AI Product Validator", layout="wide")


def load_sample_ideas() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "sample_ideas.csv")


def render_home_page() -> None:
    st.title("AI Product Validator")
    st.write(
        "Evaluate startup ideas with structured PM thinking, optional OpenAI support, "
        "and reusable report generation."
    )
    st.subheader("Sample ideas")
    st.dataframe(load_sample_ideas(), use_container_width=True, hide_index=True)


def render_input_page() -> None:
    st.title("Idea Input Form")
    sample_ideas = load_sample_ideas()
    selected_sample = st.selectbox(
        "Load a sample idea",
        options=["Custom"] + sample_ideas["product_idea"].tolist(),
    )

    if selected_sample != "Custom":
        selected_row = sample_ideas[sample_ideas["product_idea"] == selected_sample].iloc[0]
        default_customer = selected_row["target_customer"]
        default_model = selected_row["business_model"]
        default_idea = selected_row["product_idea"]
    else:
        default_customer = ""
        default_model = ""
        default_idea = ""

    with st.form("validator_form"):
        product_idea = st.text_area("Product idea", value=default_idea, height=120)
        target_customer = st.text_input("Target customer", value=default_customer)
        business_model = st.text_input("Business model", value=default_model)
        submitted = st.form_submit_button("Run analysis")

    if submitted:
        if not product_idea.strip() or not target_customer.strip() or not business_model.strip():
            st.error("All fields are required before running the analysis.")
            return

        analysis = analyze_product_idea(
            product_idea=product_idea,
            target_customer=target_customer,
            business_model=business_model,
        )
        st.session_state["latest_analysis"] = analysis
        report_markdown = build_markdown_report(analysis)
        save_report(analysis, report_markdown)
        st.success("Analysis completed and stored in SQLite.")


def render_dashboard_page() -> None:
    st.title("Analysis Dashboard")
    analysis = st.session_state.get("latest_analysis")
    if not analysis:
        st.info("Run an idea analysis first from the input page.")
        return

    score_column, opportunity_column, risk_column = st.columns(3)
    score_column.metric("Viability score", analysis["viability_score"])
    opportunity_column.metric("Market opportunity", analysis["market_opportunity_score"])
    risk_column.metric("Risk level", analysis["risk_score"])

    st.subheader("Executive summary")
    st.write(analysis["summary"])

    left_column, right_column = st.columns(2)
    with left_column:
        st.subheader("SWOT analysis")
        for label, values in analysis["swot"].items():
            st.markdown(f"**{label}**")
            for item in values:
                st.write(f"- {item}")
    with right_column:
        st.subheader("Competitor suggestions")
        for competitor in analysis["competitor_suggestions"]:
            st.write(f"- {competitor}")

    st.subheader("Scoring rationale")
    st.json(analysis["score_breakdown"])


def render_report_page() -> None:
    st.title("Report Generator")
    analysis = st.session_state.get("latest_analysis")
    if analysis:
        report_markdown = build_markdown_report(analysis)
        st.markdown(report_markdown)
        st.download_button(
            "Download report",
            data=report_markdown,
            file_name="product-validator-report.md",
            mime="text/markdown",
        )
    else:
        st.info("Generate an analysis to create a report.")

    st.subheader("Saved reports")
    reports = fetch_saved_reports()
    if reports.empty:
        st.write("No reports saved yet.")
    else:
        st.dataframe(reports, use_container_width=True, hide_index=True)


def main() -> None:
    initialize_database()
    page = st.sidebar.radio(
        "Pages",
        ["Home", "Idea Input Form", "Analysis Dashboard", "Report Generator"],
    )

    if page == "Home":
        render_home_page()
    elif page == "Idea Input Form":
        render_input_page()
    elif page == "Analysis Dashboard":
        render_dashboard_page()
    else:
        render_report_page()


if __name__ == "__main__":
    main()

