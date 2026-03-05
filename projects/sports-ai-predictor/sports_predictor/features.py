from __future__ import annotations

import pandas as pd


FEATURE_COLUMNS = [
    "team_rating",
    "opponent_rating",
    "recent_form",
    "opponent_form",
    "home_game",
    "rest_days",
    "opponent_rest_days",
]


def load_matches(source) -> pd.DataFrame:
    matches = pd.read_csv(source)
    if "date" in matches.columns:
        matches["date"] = pd.to_datetime(matches["date"])
    else:
        matches["date"] = pd.date_range("2026-01-01", periods=len(matches), freq="D")
    matches["match_number"] = range(1, len(matches) + 1)
    return matches


def build_prediction_frame(
    team_rating: int,
    opponent_rating: int,
    recent_form: int,
    opponent_form: int,
    home_game: int,
    rest_days: int,
    opponent_rest_days: int,
) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "team_rating": team_rating,
                "opponent_rating": opponent_rating,
                "recent_form": recent_form,
                "opponent_form": opponent_form,
                "home_game": home_game,
                "rest_days": rest_days,
                "opponent_rest_days": opponent_rest_days,
            }
        ]
    )
