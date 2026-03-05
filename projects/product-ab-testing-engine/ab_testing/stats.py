from __future__ import annotations

import math

import pandas as pd
from scipy.stats import norm


def load_experiment_results(source) -> pd.DataFrame:
    results = pd.read_csv(source)
    results["date"] = pd.to_datetime(results["date"])
    return results


def _two_proportion_z_test(control_conversions, control_visitors, variant_conversions, variant_visitors):
    control_rate = control_conversions / control_visitors
    variant_rate = variant_conversions / variant_visitors
    pooled_rate = (control_conversions + variant_conversions) / (
        control_visitors + variant_visitors
    )
    standard_error = math.sqrt(
        pooled_rate * (1 - pooled_rate) * (1 / control_visitors + 1 / variant_visitors)
    )
    if standard_error == 0:
        return 0.0, 1.0
    z_score = (variant_rate - control_rate) / standard_error
    p_value = 2 * (1 - norm.cdf(abs(z_score)))
    return z_score, p_value


def analyze_experiment_results(results: pd.DataFrame):
    aggregated = (
        results.groupby("variant")[["visitors", "conversions"]]
        .sum()
        .reset_index()
        .sort_values("variant")
    )
    if set(aggregated["variant"]) != {"A", "B"}:
        raise ValueError("The results file must contain exactly two variants named A and B.")

    control = aggregated[aggregated["variant"] == "A"].iloc[0]
    variant = aggregated[aggregated["variant"] == "B"].iloc[0]

    control_rate = control["conversions"] / control["visitors"]
    variant_rate = variant["conversions"] / variant["visitors"]
    absolute_lift = variant_rate - control_rate
    relative_uplift = absolute_lift / control_rate if control_rate else 0.0

    z_score, p_value = _two_proportion_z_test(
        control["conversions"],
        control["visitors"],
        variant["conversions"],
        variant["visitors"],
    )
    confidence_standard_error = math.sqrt(
        control_rate * (1 - control_rate) / control["visitors"]
        + variant_rate * (1 - variant_rate) / variant["visitors"]
    )
    ci_low = absolute_lift - 1.96 * confidence_standard_error
    ci_high = absolute_lift + 1.96 * confidence_standard_error

    aggregated["conversion_rate"] = aggregated["conversions"] / aggregated["visitors"]
    segment_summary = (
        results.groupby(["segment", "variant"])[["visitors", "conversions"]]
        .sum()
        .reset_index()
    )
    segment_summary["conversion_rate"] = (
        segment_summary["conversions"] / segment_summary["visitors"]
    )

    summary = {
        "control_rate": control_rate,
        "variant_rate": variant_rate,
        "absolute_lift": absolute_lift,
        "relative_uplift": relative_uplift,
        "z_score": z_score,
        "p_value": p_value,
        "confidence_interval_low": ci_low,
        "confidence_interval_high": ci_high,
        "is_significant": p_value < 0.05,
    }
    return summary, aggregated, segment_summary
