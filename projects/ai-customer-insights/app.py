from pathlib import Path

import streamlit as st

from customer_insights.analysis import (
    analyze_tickets,
    load_tickets,
    summarize_customer_insights,
)
from customer_insights.charts import (
    build_bug_trend_chart,
    build_feature_request_trend_chart,
    build_issue_frequency_chart,
    build_sentiment_trend_chart,
)


DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="AI Customer Insights", layout="wide")


def main() -> None:
    st.title("AI Customer Insights")
    st.write("Turn support tickets into prioritized product insight.")

    uploaded_file = st.file_uploader("Upload support tickets", type="csv")
    tickets = load_tickets(uploaded_file or DATA_DIR / "sample_tickets.csv")
    enriched_tickets = analyze_tickets(tickets)
    summary = summarize_customer_insights(enriched_tickets)

    metric_columns = st.columns(4)
    metric_columns[0].metric("Tickets", len(enriched_tickets))
    metric_columns[1].metric("Feature requests", int(enriched_tickets["is_feature_request"].sum()))
    metric_columns[2].metric("Bug reports", int(enriched_tickets["is_bug"].sum()))
    metric_columns[3].metric("Average sentiment", round(enriched_tickets["sentiment_score"].mean(), 2))

    st.subheader("AI / rules-based summary")
    st.write(summary)

    left_column, right_column = st.columns(2)
    with left_column:
        st.plotly_chart(build_issue_frequency_chart(enriched_tickets), use_container_width=True)
    with right_column:
        st.plotly_chart(build_sentiment_trend_chart(enriched_tickets), use_container_width=True)

    lower_left, lower_right = st.columns(2)
    with lower_left:
        st.plotly_chart(build_bug_trend_chart(enriched_tickets), use_container_width=True)
    with lower_right:
        st.plotly_chart(build_feature_request_trend_chart(enriched_tickets), use_container_width=True)

    st.subheader("Categorized tickets")
    st.dataframe(enriched_tickets, use_container_width=True, hide_index=True)


if __name__ == "__main__":
    main()
