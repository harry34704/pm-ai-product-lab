from collections import defaultdict
from datetime import date, timedelta
from typing import Dict, List, Set

from sqlalchemy.orm import Session

from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User, UserBadge

BADGE_RULES = {
    "discovery-master": {
        "name": "Discovery Master",
        "description": "Complete at least 10 discovery-focused days.",
    },
    "analytics-ninja": {
        "name": "Analytics Ninja",
        "description": "Complete at least 8 analytics-focused days.",
    },
    "roadmap-architect": {
        "name": "Roadmap Architect",
        "description": "Generate a roadmap artifact and complete at least 5 strategy days.",
    },
    "experimentation-expert": {
        "name": "Experimentation Expert",
        "description": "Complete at least 3 simulations and 5 analytics or delivery days.",
    },
}


def compute_level(xp_balance: int) -> int:
    return max(1, 1 + xp_balance // 400)


def calculate_streak(progress_entries: List[DailyProgress]) -> int:
    completed_days = sorted({entry.completed_at.date() for entry in progress_entries if entry.completed_at}, reverse=True)
    if not completed_days:
        return 0

    today = date.today()
    if completed_days[0] not in {today, today - timedelta(days=1)}:
        return 0

    streak = 1
    current = completed_days[0]
    for day_value in completed_days[1:]:
        if current - day_value == timedelta(days=1):
            streak += 1
            current = day_value
        else:
            break
    return streak


def build_skill_tree(days: List[DayContent], completed_ids: Set[int]) -> List[Dict]:
    grouped: Dict[str, Dict[str, int]] = defaultdict(lambda: {"completed": 0, "total": 0})
    for day in days:
        grouped[day.skill_area]["total"] += 1
        if day.day_number in completed_ids:
            grouped[day.skill_area]["completed"] += 1

    return [
        {
            "skill": skill,
            "completed_days": values["completed"],
            "total_days": values["total"],
            "progress_percent": round((values["completed"] / values["total"]) * 100, 1) if values["total"] else 0.0,
        }
        for skill, values in grouped.items()
    ]


def build_phase_progress(days: List[DayContent], completed_ids: Set[int]) -> List[Dict]:
    grouped: Dict[str, Dict[str, object]] = defaultdict(lambda: {"name": "", "completed": 0, "total": 0})
    for day in days:
        grouped[day.phase_key]["name"] = day.phase_name
        grouped[day.phase_key]["total"] += 1
        if day.day_number in completed_ids:
            grouped[day.phase_key]["completed"] += 1

    return [
        {
            "phase_key": phase_key,
            "phase_name": values["name"],
            "completed_days": values["completed"],
            "total_days": values["total"],
            "progress_percent": round((values["completed"] / values["total"]) * 100, 1) if values["total"] else 0.0,
        }
        for phase_key, values in grouped.items()
    ]


def evaluate_badges(days: List[DayContent], progress_entries: List[DailyProgress], artifacts: List[Artifact], attempts: List[SimulationAttempt]) -> List[Dict]:
    completed_ids = {entry.day.day_number for entry in progress_entries if entry.day}
    completion_by_phase = defaultdict(int)

    for entry in progress_entries:
        if entry.day:
            completion_by_phase[entry.day.phase_key] += 1

    artifact_kinds = {artifact.kind for artifact in artifacts}
    unlocked: List[Dict] = []

    if completion_by_phase["discovery"] >= 10:
        unlocked.append({"badge_code": "discovery-master", **BADGE_RULES["discovery-master"]})
    if completion_by_phase["analytics"] >= 8:
        unlocked.append({"badge_code": "analytics-ninja", **BADGE_RULES["analytics-ninja"]})
    if completion_by_phase["strategy"] >= 5 and "roadmap" in artifact_kinds:
        unlocked.append({"badge_code": "roadmap-architect", **BADGE_RULES["roadmap-architect"]})
    if len(attempts) >= 3 and (completion_by_phase["analytics"] + completion_by_phase["delivery"]) >= 5:
        unlocked.append({"badge_code": "experimentation-expert", **BADGE_RULES["experimentation-expert"]})

    return unlocked


def sync_badges(
    db: Session,
    user: User,
    days: List[DayContent],
    progress_entries: List[DailyProgress],
    artifacts: List[Artifact],
    attempts: List[SimulationAttempt],
) -> List[str]:
    unlocked_payloads = evaluate_badges(days, progress_entries, artifacts, attempts)
    existing_codes = {badge.badge_code for badge in user.badges}
    new_badges: List[str] = []

    for payload in unlocked_payloads:
        if payload["badge_code"] in existing_codes:
            continue
        badge = UserBadge(
            user_id=user.id,
            badge_code=payload["badge_code"],
            badge_name=payload["name"],
            description=payload["description"],
        )
        db.add(badge)
        new_badges.append(payload["name"])

    user.current_level = compute_level(user.xp_balance)
    db.commit()
    db.refresh(user)
    return new_badges


def build_leaderboard(db: Session, limit: int = 10) -> List[Dict]:
    users = db.query(User).order_by(User.xp_balance.desc(), User.created_at.asc()).limit(limit).all()
    return [
        {
            "name": user.full_name,
            "headline": user.headline,
            "xp_balance": user.xp_balance,
            "current_level": user.current_level,
        }
        for user in users
    ]
