from __future__ import annotations

import pandas as pd


def load_events(source) -> pd.DataFrame:
    events = pd.read_csv(source)
    events["event_time"] = pd.to_datetime(events["event_time"])
    events["feature"] = events["feature"].fillna("Unspecified")
    return events.sort_values("event_time").reset_index(drop=True)


def calculate_dau(events: pd.DataFrame) -> pd.DataFrame:
    dau = (
        events.assign(event_date=events["event_time"].dt.date)
        .groupby("event_date")["user_id"]
        .nunique()
        .reset_index(name="active_users")
    )
    return dau


def calculate_funnel(events: pd.DataFrame, steps: list[str]) -> pd.DataFrame:
    if not steps:
        return pd.DataFrame(columns=["step", "users", "conversion_from_previous"])

    ordered_events = events.sort_values(["user_id", "event_time"])
    user_step_times: dict[str, dict[str, pd.Timestamp]] = {}

    for user_id, group in ordered_events.groupby("user_id"):
        step_times: dict[str, pd.Timestamp] = {}
        last_completed_time = None
        for step in steps:
            candidate_events = group[group["event_name"] == step]
            if last_completed_time is not None:
                candidate_events = candidate_events[candidate_events["event_time"] > last_completed_time]
            if candidate_events.empty:
                break
            completed_time = candidate_events.iloc[0]["event_time"]
            step_times[step] = completed_time
            last_completed_time = completed_time
        user_step_times[user_id] = step_times

    step_completion: list[dict[str, object]] = []
    previous_count = None

    for step in steps:
        current_count = sum(1 for step_times in user_step_times.values() if step in step_times)
        conversion = round(current_count / previous_count, 3) if previous_count else 1.0
        step_completion.append(
            {
                "step": step,
                "users": current_count,
                "conversion_from_previous": conversion,
            }
        )
        previous_count = current_count

    return pd.DataFrame(step_completion)


def calculate_retention_cohorts(events: pd.DataFrame) -> pd.DataFrame:
    cohort_events = events.copy()
    cohort_events["event_week"] = cohort_events["event_time"].dt.to_period("W").astype(str)
    first_event = cohort_events.groupby("user_id")["event_time"].min().rename("first_event")
    cohort_events = cohort_events.merge(first_event, on="user_id")
    cohort_events["cohort_week"] = cohort_events["first_event"].dt.to_period("W").astype(str)
    cohort_events["weeks_since_signup"] = (
        (cohort_events["event_time"] - cohort_events["first_event"]).dt.days // 7
    )
    retained = (
        cohort_events.groupby(["cohort_week", "weeks_since_signup"])["user_id"]
        .nunique()
        .reset_index(name="users")
    )
    cohort_sizes = retained[retained["weeks_since_signup"] == 0][["cohort_week", "users"]].rename(
        columns={"users": "cohort_size"}
    )
    retained = retained.merge(cohort_sizes, on="cohort_week")
    retained["retention_rate"] = (retained["users"] / retained["cohort_size"]).round(3)
    heatmap = retained.pivot(
        index="cohort_week",
        columns="weeks_since_signup",
        values="retention_rate",
    ).fillna(0.0)
    return heatmap


def calculate_feature_adoption(events: pd.DataFrame) -> pd.DataFrame:
    adoption = (
        events[events["feature"] != "Unspecified"]
        .groupby("feature")
        .agg(active_users=("user_id", "nunique"), events=("event_name", "count"))
        .reset_index()
        .sort_values("active_users", ascending=False)
    )
    return adoption
