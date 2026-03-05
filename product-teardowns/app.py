from pathlib import Path

import pandas as pd
import streamlit as st


TEARDOWN_DIR = Path(__file__).parent / "teardowns"
DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="Product Teardowns", layout="wide")


def main() -> None:
    st.title("Product Teardowns")
    st.write("A small portfolio browser for product strategy teardown documents.")

    catalog = pd.read_csv(DATA_DIR / "teardown_catalog.csv")
    teardown_files = sorted(TEARDOWN_DIR.glob("*.md"))
    selected_file = st.sidebar.selectbox(
        "Choose a teardown",
        options=teardown_files,
        format_func=lambda path: path.stem.replace("-", " ").title(),
    )

    selected_product = selected_file.stem.replace("-", " ").title()
    selected_metadata = catalog[catalog["product"] == selected_product].iloc[0]

    metric_columns = st.columns(4)
    metric_columns[0].metric("Category", selected_metadata["category"])
    metric_columns[1].metric("Primary user", selected_metadata["primary_user"])
    metric_columns[2].metric("Monetization", selected_metadata["business_model"])
    metric_columns[3].metric("Moat", selected_metadata["core_moat"])

    st.subheader("Teardown portfolio index")
    st.dataframe(catalog, use_container_width=True, hide_index=True)

    st.markdown(selected_file.read_text())


if __name__ == "__main__":
    main()
