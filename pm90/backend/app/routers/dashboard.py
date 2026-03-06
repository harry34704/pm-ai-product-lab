from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.database import get_db
from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User
from app.schemas import ArtifactResponse, DashboardResponse
from app.services.gamification import build_leaderboard, build_phase_progress, build_skill_tree, calculate_streak, sync_badges
from app.services.progress import get_next_unlocked_day

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def serialize_artifact(artifact: Artifact) -> ArtifactResponse:
    return ArtifactResponse(
        id=artifact.id,
        title=artifact.title,
        kind=artifact.kind,
        summary=artifact.summary,
        content=artifact.content,
        metadata=artifact.metadata_json or {},
        created_at=artifact.created_at,
    )


@router.get("/summary", response_model=DashboardResponse)
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DashboardResponse:
    days: List[DayContent] = db.query(DayContent).order_by(DayContent.day_number.asc()).all()
    progress_entries = (
        db.query(DailyProgress)
        .options(joinedload(DailyProgress.day))
        .filter(DailyProgress.user_id == current_user.id)
        .order_by(DailyProgress.completed_at.desc())
        .all()
    )
    artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).order_by(Artifact.created_at.desc()).limit(6).all()
    attempts = db.query(SimulationAttempt).filter(SimulationAttempt.user_id == current_user.id).all()

    sync_badges(db, current_user, days, progress_entries, artifacts, attempts)
    db.refresh(current_user)
    current_user = db.query(User).options(joinedload(User.badges)).filter(User.id == current_user.id).first()

    completed_ids = {entry.day.day_number for entry in progress_entries if entry.day}
    streak_count = calculate_streak(progress_entries)
    next_day_number = get_next_unlocked_day(completed_ids, len(days))
    next_day_record = next((day for day in days if day.day_number == next_day_number and day.day_number not in completed_ids), None)

    next_day = None
    if next_day_record:
        next_day = {
            "day_number": next_day_record.day_number,
            "phase_key": next_day_record.phase_key,
            "phase_name": next_day_record.phase_name,
            "topic": next_day_record.topic,
            "skill_area": next_day_record.skill_area,
            "xp_reward": next_day_record.xp_reward,
            "status": "unlocked",
        }

    return DashboardResponse(
        user=current_user,
        streak_count=streak_count,
        badges=current_user.badges,
        skill_tree=build_skill_tree(days, completed_ids),
        phase_progress=build_phase_progress(days, completed_ids),
        next_day=next_day,
        completed_days=len(completed_ids),
        total_days=len(days),
        artifacts=[serialize_artifact(artifact) for artifact in artifacts],
        leaderboard=build_leaderboard(db),
    )
