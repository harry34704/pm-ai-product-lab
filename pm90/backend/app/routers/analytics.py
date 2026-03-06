import random
from typing import List

from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models import User
from app.schemas import AnalyticsMetric, AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["analytics"])


def build_sample_events() -> List[dict]:
    random.seed(90)
    events = []
    event_types = ["signup", "activated", "lesson_completed", "artifact_created", "subscription_started"]
    plans = ["free", "starter", "pro"]
    for user_id in range(1, 41):
        plan = random.choice(plans)
        for step in range(random.randint(2, 5)):
            events.append(
                {
                    "user_id": user_id,
                    "event": event_types[step],
                    "plan": plan,
                    "week": random.randint(1, 6),
                    "value": round(random.uniform(1, 15), 2),
                }
            )
    return events[:120]


@router.get("/playground", response_model=AnalyticsResponse)
def analytics_playground(current_user: User = Depends(get_current_user)) -> AnalyticsResponse:
    sample_events = build_sample_events()
    return AnalyticsResponse(
        metrics=[
            AnalyticsMetric(label="Activation Rate", value=46.8, delta=5.7),
            AnalyticsMetric(label="7-Day Retention", value=31.4, delta=3.9),
            AnalyticsMetric(label="Trial to Paid", value=12.6, delta=2.1),
            AnalyticsMetric(label="Experiment Win Rate", value=38.0, delta=6.4),
        ],
        funnel=[
            {"stage": "Visited landing page", "users": 1000},
            {"stage": "Signed up", "users": 420},
            {"stage": "Started day 1", "users": 295},
            {"stage": "Completed day 7", "users": 148},
            {"stage": "Generated first artifact", "users": 82},
            {"stage": "Subscribed", "users": 53},
        ],
        cohorts=[
            {"cohort": "Jan Week 1", "week_1": 100, "week_2": 58, "week_3": 42, "week_4": 36},
            {"cohort": "Jan Week 2", "week_1": 100, "week_2": 61, "week_3": 46, "week_4": 39},
            {"cohort": "Jan Week 3", "week_1": 100, "week_2": 63, "week_3": 49, "week_4": 43},
            {"cohort": "Jan Week 4", "week_1": 100, "week_2": 67, "week_3": 52, "week_4": 45},
        ],
        retention=[
            {"day": "D1", "retention": 72},
            {"day": "D7", "retention": 31},
            {"day": "D14", "retention": 24},
            {"day": "D30", "retention": 18},
        ],
        ab_tests=[
            {"experiment": "Onboarding checklist", "variant_a": 31.2, "variant_b": 38.6, "winner": "Variant B"},
            {"experiment": "Mentor prompt framing", "variant_a": 18.1, "variant_b": 16.9, "winner": "Variant A"},
            {"experiment": "Roadmap generator CTA", "variant_a": 9.6, "variant_b": 13.4, "winner": "Variant B"},
        ],
        sample_events=sample_events,
    )
