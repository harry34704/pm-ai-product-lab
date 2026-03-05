from pathlib import Path

import streamlit as st

from sports_predictor.charts import (
    build_confusion_matrix_chart,
    build_feature_importance_chart,
    build_performance_trend_chart,
    build_probability_chart,
)
from sports_predictor.features import build_prediction_frame, load_matches
from sports_predictor.model import predict_outcome, train_model


DATA_DIR = Path(__file__).parent / "data"


st.set_page_config(page_title="AI Sports Predictor", layout="wide")


def render_prediction_form() -> None:
    st.subheader("Predict a new match")
    with st.form("prediction_form"):
        team_rating = st.slider("Team rating", min_value=60, max_value=100, value=84)
        opponent_rating = st.slider("Opponent rating", min_value=60, max_value=100, value=80)
        recent_form = st.slider("Recent form (last 5 matches won)", min_value=0, max_value=5, value=3)
        opponent_form = st.slider("Opponent recent form", min_value=0, max_value=5, value=2)
        home_game = st.selectbox("Home game", options=[1, 0], format_func=lambda value: "Yes" if value else "No")
        rest_days = st.slider("Rest days", min_value=1, max_value=7, value=4)
        opponent_rest_days = st.slider("Opponent rest days", min_value=1, max_value=7, value=3)
        submitted = st.form_submit_button("Predict outcome")

    if submitted:
        trained_model = st.session_state.get("sports_model")
        if not trained_model:
            st.error("Train the model first.")
            return
        prediction_frame = build_prediction_frame(
            team_rating=team_rating,
            opponent_rating=opponent_rating,
            recent_form=recent_form,
            opponent_form=opponent_form,
            home_game=home_game,
            rest_days=rest_days,
            opponent_rest_days=opponent_rest_days,
        )
        probability = predict_outcome(trained_model, prediction_frame)
        st.metric("Win probability", f"{probability:.2%}")
        st.plotly_chart(build_probability_chart(probability), use_container_width=True)


def main() -> None:
    st.title("AI Sports Predictor")
    st.write("Train a lightweight model to predict match outcomes from structured match data.")

    uploaded_file = st.file_uploader("Upload match dataset", type="csv")
    matches = load_matches(uploaded_file or DATA_DIR / "sample_matches.csv")
    st.dataframe(matches.head(10), use_container_width=True, hide_index=True)

    if st.button("Train model"):
        trained_model = train_model(matches)
        st.session_state["sports_model"] = trained_model

    trained_model = st.session_state.get("sports_model")
    if trained_model:
        metric_columns = st.columns(2)
        metric_columns[0].metric("Accuracy", f"{trained_model['accuracy']:.2%}")
        metric_columns[1].metric("ROC-AUC", f"{trained_model['roc_auc']:.2%}")

        left_column, right_column = st.columns(2)
        with left_column:
            st.plotly_chart(
                build_feature_importance_chart(trained_model["feature_importance"]),
                use_container_width=True,
            )
        with right_column:
            st.plotly_chart(
                build_confusion_matrix_chart(trained_model["confusion_matrix"]),
                use_container_width=True,
            )

        selected_team = st.selectbox(
            "Team performance trend",
            options=sorted(matches["team"].unique().tolist()),
        )
        st.plotly_chart(
            build_performance_trend_chart(trained_model["performance_trend"], selected_team),
            use_container_width=True,
        )

    render_prediction_form()


if __name__ == "__main__":
    main()
