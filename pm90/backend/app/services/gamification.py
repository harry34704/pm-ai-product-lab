import math
from collections import defaultdict
from datetime import date, timedelta
from typing import Dict, List, Set

from sqlalchemy.orm import Session

from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User, UserBadge

BADGE_RULES = {
    "discovery-explorer": {
        "name": "Discovery Explorer",
        "description": "Complete at least 5 Product Discovery days.",
    },
    "analytics-wizard": {
        "name": "Analytics Wizard",
        "description": "Complete at least 8 Product Analytics days.",
    },
    "roadmap-architect": {
        "name": "Roadmap Architect",
        "description": "Generate a roadmap artifact and complete at least 5 Product Strategy days.",
    },
    "experimentation-master": {
        "name": "Experimentation Master",
        "description": "Complete at least 3 simulations and show experimentation progress.",
    },
    "stakeholder-whisperer": {
        "name": "Stakeholder Whisperer",
        "description": "Complete stakeholder-heavy delivery and leadership lessons.",
    },
}

SKILL_TREE_CONFIG = [
    {"skill": "Technical Foundations", "unlock_after": 0, "phase_keys": {"foundations"}, "topic_keywords": (), "simulation_slots": 0},
    {"skill": "Product Discovery", "unlock_after": 5, "phase_keys": {"discovery"}, "topic_keywords": (), "simulation_slots": 0},
    {"skill": "Product Delivery", "unlock_after": 20, "phase_keys": {"delivery"}, "topic_keywords": (), "simulation_slots": 0},
    {"skill": "Product Analytics", "unlock_after": 35, "phase_keys": {"analytics"}, "topic_keywords": (), "simulation_slots": 0},
    {
        "skill": "Experimentation",
        "unlock_after": 45,
        "phase_keys": set(),
        "topic_keywords": ("experiment", "testing", "guardrail"),
        "simulation_slots": 3,
    },
    {"skill": "Product Strategy", "unlock_after": 55, "phase_keys": {"strategy"}, "topic_keywords": (), "simulation_slots": 0},
    {"skill": "Leadership", "unlock_after": 70, "phase_keys": {"leadership"}, "topic_keywords": (), "simulation_slots": 0},
]


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


def _matches_skill(day: DayContent, config: Dict) -> bool:
    if day.phase_key in config["phase_keys"]:
        return True
    topic = day.topic.lower()
    return any(keyword in topic for keyword in config["topic_keywords"])


def _skill_level(completed_days: int, total_days: int, unlocked: bool) -> int:
    if not unlocked:
        return 0
    if total_days <= 0:
        return 1
    progress_ratio = completed_days / total_days
    return min(5, max(1, math.ceil(progress_ratio * 5)))


def build_skill_tree(days: List[DayContent], completed_ids: Set[int], simulation_count: int = 0) -> List[Dict]:
    overall_completed = len(completed_ids)
    tree: List[Dict] = []

    for config in SKILL_TREE_CONFIG:
        matched_days = [day for day in days if _matches_skill(day, config)]
        completed_days = sum(1 for day in matched_days if day.day_number in completed_ids)
        total_days = len(matched_days)

        if config["skill"] == "Experimentation":
            total_days += config["simulation_slots"]
            completed_days += min(simulation_count, config["simulation_slots"])

        unlocked = overall_completed >= config["unlock_after"] or completed_days > 0
        progress_percent = round((completed_days / total_days) * 100, 1) if total_days else 0.0
        unlock_requirement = None if unlocked else f"Unlocks after {config['unlock_after']} completed days"

        tree.append(
            {
                "skill": config["skill"],
                "completed_days": completed_days,
                "total_days": total_days,
                "progress_percent": progress_percent,
                "current_level": _skill_level(completed_days, total_days, unlocked),
                "unlocked": unlocked,
                "unlock_requirement": unlock_requirement,
            }
        )

    return tree


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
    completion_by_phase = defaultdict(int)

    for entry in progress_entries:
        if entry.day:
            completion_by_phase[entry.day.phase_key] += 1

    artifact_kinds = {artifact.kind for artifact in artifacts}
    unlocked: List[Dict] = []

    stakeholder_topics = {"stakeholder", "conflict", "managing up", "communication"}
    stakeholder_days = 0
    experimentation_days = 0
    for entry in progress_entries:
        if not entry.day:
            continue
        topic = entry.day.topic.lower()
        if any(keyword in topic for keyword in stakeholder_topics):
            stakeholder_days += 1
        if any(keyword in topic for keyword in ("experiment", "testing", "guardrail")):
            experimentation_days += 1

    if completion_by_phase["discovery"] >= 5:
        unlocked.append({"badge_code": "discovery-explorer", **BADGE_RULES["discovery-explorer"]})
    if completion_by_phase["analytics"] >= 8:
        unlocked.append({"badge_code": "analytics-wizard", **BADGE_RULES["analytics-wizard"]})
    if completion_by_phase["strategy"] >= 5 and "roadmap" in artifact_kinds:
        unlocked.append({"badge_code": "roadmap-architect", **BADGE_RULES["roadmap-architect"]})
    if len(attempts) >= 3 and experimentation_days >= 2:
        unlocked.append({"badge_code": "experimentation-master", **BADGE_RULES["experimentation-master"]})
    if stakeholder_days >= 3:
        unlocked.append({"badge_code": "stakeholder-whisperer", **BADGE_RULES["stakeholder-whisperer"]})

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
