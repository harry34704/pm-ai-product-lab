from __future__ import annotations

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from sports_predictor.features import FEATURE_COLUMNS


def train_model(matches: pd.DataFrame) -> dict:
    X = matches[FEATURE_COLUMNS]
    y = matches["won"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(max_iter=200)),
        ]
    )
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]
    coefficients = pipeline.named_steps["classifier"].coef_[0]
    feature_importance = pd.DataFrame(
        {"feature": FEATURE_COLUMNS, "importance": coefficients}
    ).sort_values("importance", ascending=False)
    performance_trend = matches.copy()
    performance_trend["team_match_number"] = performance_trend.groupby("team").cumcount() + 1
    performance_trend["rolling_win_rate"] = (
        performance_trend.groupby("team")["won"]
        .expanding()
        .mean()
        .reset_index(level=0, drop=True)
    )

    return {
        "pipeline": pipeline,
        "accuracy": accuracy_score(y_test, predictions),
        "roc_auc": roc_auc_score(y_test, probabilities),
        "feature_importance": feature_importance,
        "confusion_matrix": confusion_matrix(y_test, predictions),
        "performance_trend": performance_trend,
    }


def predict_outcome(trained_model: dict, prediction_frame: pd.DataFrame) -> float:
    return float(trained_model["pipeline"].predict_proba(prediction_frame)[:, 1][0])
