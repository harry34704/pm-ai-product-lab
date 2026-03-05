from __future__ import annotations

import pandas as pd


def load_feature_ideas(source) -> pd.DataFrame:
    return pd.read_csv(source)


def _assign_quarter(row: pd.Series) -> str:
    if row["priority_score"] >= 130:
        return "Q1"
    if row["priority_score"] >= 95:
        return "Q2"
    if row["priority_score"] >= 70:
        return "Q3"
    return "Q4"


def prioritize_features(feature_ideas: pd.DataFrame) -> pd.DataFrame:
    prioritized = feature_ideas.copy()
    # A transparent, PM-friendly scoring system is easier to explain than a black box.
    prioritized["rice_score"] = (
        prioritized["reach"] * prioritized["impact"] * prioritized["confidence"]
    ) / prioritized["effort"]
    prioritized["priority_score"] = (
        prioritized["rice_score"]
        + prioritized["strategic_fit"] * 8
        + prioritized["feedback_volume"] * 0.4
    ).round(2)
    prioritized["priority_bucket"] = pd.cut(
        prioritized["priority_score"],
        bins=[0, 70, 100, 130, 999],
        labels=["Later", "Planned", "Important", "Now"],
    )
    prioritized["quarter"] = prioritized.apply(_assign_quarter, axis=1)
    return prioritized.sort_values("priority_score", ascending=False).reset_index(drop=True)

