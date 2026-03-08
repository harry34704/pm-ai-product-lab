from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.database import get_db
from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User
from app.schemas import DailyCompletionRequest, DailyCompletionResponse, DayDetail, DaySummary
from app.services.certification import ensure_certificate_artifact
from app.services.gamification import compute_level, sync_badges
from app.services.progress import get_next_unlocked_day

router = APIRouter(prefix="/curriculum", tags=["curriculum"])


def get_progress_map(db: Session, user_id: int) -> dict:
    progress_entries = (
        db.query(DailyProgress)
        .options(joinedload(DailyProgress.day))
        .filter(DailyProgress.user_id == user_id)
        .all()
    )
    return {entry.day.day_number: entry for entry in progress_entries if entry.day}


@router.get("", response_model=List[DaySummary])
def list_curriculum(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[DaySummary]:
    days = db.query(DayContent).order_by(DayContent.day_number.asc()).all()
    progress_map = get_progress_map(db, current_user.id)
    completed_ids = set(progress_map.keys())
    unlocked_day = get_next_unlocked_day(completed_ids, len(days))
    summaries: List[DaySummary] = []

    for day in days:
        status_value = "completed" if day.day_number in completed_ids else "unlocked" if day.day_number <= unlocked_day else "locked"
        summaries.append(
            DaySummary(
                day_number=day.day_number,
                phase_key=day.phase_key,
                phase_name=day.phase_name,
                topic=day.topic,
                skill_area=day.skill_area,
                xp_reward=day.xp_reward,
                status=status_value,
            )
        )
    return summaries


@router.get("/{day_number}", response_model=DayDetail)
def get_day(day_number: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DayDetail:
    day = db.query(DayContent).filter(DayContent.day_number == day_number).first()
    if not day:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Day not found")

    progress_map = get_progress_map(db, current_user.id)
    completed_ids = set(progress_map.keys())
    unlocked_day = get_next_unlocked_day(completed_ids, db.query(DayContent).count())
    if day_number not in completed_ids and day_number > unlocked_day:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Complete previous days to unlock this lesson")

    previous_entry: Optional[DailyProgress] = progress_map.get(day_number)
    status_value = "completed" if previous_entry else "unlocked"
    return DayDetail(
        day_number=day.day_number,
        phase_key=day.phase_key,
        phase_name=day.phase_name,
        topic=day.topic,
        skill_area=day.skill_area,
        lesson=day.lesson,
        practical_task=day.practical_task,
        reflection_question=day.reflection_question,
        mentor_prompt=day.mentor_prompt,
        xp_reward=day.xp_reward,
        status=status_value,
        previous_reflection=previous_entry.reflection_response if previous_entry else None,
        previous_answer=previous_entry.challenge_answer if previous_entry else None,
    )


@router.post("/{day_number}/complete", response_model=DailyCompletionResponse)
def complete_day(
    day_number: int,
    payload: DailyCompletionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DailyCompletionResponse:
    day = db.query(DayContent).filter(DayContent.day_number == day_number).first()
    if not day:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Day not found")

    progress_map = get_progress_map(db, current_user.id)
    completed_ids = set(progress_map.keys())
    unlocked_day = get_next_unlocked_day(completed_ids, db.query(DayContent).count())
    if day_number not in completed_ids and day_number > unlocked_day:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This lesson is still locked")

    if day_number in completed_ids:
        progress_entries = list(progress_map.values())
        artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).all()
        attempts = db.query(SimulationAttempt).filter(SimulationAttempt.user_id == current_user.id).all()
        ensure_certificate_artifact(db, current_user, db.query(DayContent).all(), progress_entries, artifacts, attempts)
        unlocked = sync_badges(db, current_user, db.query(DayContent).all(), progress_entries, artifacts, attempts)
        return DailyCompletionResponse(
            status="already-completed",
            xp_balance=current_user.xp_balance,
            current_level=current_user.current_level,
            unlocked_badges=unlocked,
            certificate_awarded=False,
        )

    progress = DailyProgress(
        user_id=current_user.id,
        day_id=day.id,
        reflection_response=payload.reflection_response,
        challenge_answer=payload.challenge_answer,
        mentor_summary="Daily lesson completed. Return to the AI mentor for a deeper coaching loop.",
        score=88.0,
        completed_at=datetime.utcnow(),
    )
    db.add(progress)
    current_user.xp_balance += day.xp_reward
    current_user.current_level = compute_level(current_user.xp_balance)
    current_user.last_active_date = date.today()
    db.commit()
    db.refresh(current_user)

    progress_entries = (
        db.query(DailyProgress)
        .options(joinedload(DailyProgress.day))
        .filter(DailyProgress.user_id == current_user.id)
        .all()
    )
    artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).all()
    attempts = db.query(SimulationAttempt).filter(SimulationAttempt.user_id == current_user.id).all()
    certificate_before = next((artifact for artifact in artifacts if artifact.kind == "certificate"), None)
    unlocked = sync_badges(db, current_user, db.query(DayContent).all(), progress_entries, artifacts, attempts)
    artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).all()
    certificate = ensure_certificate_artifact(db, current_user, db.query(DayContent).all(), progress_entries, artifacts, attempts)
    db.refresh(current_user)
    return DailyCompletionResponse(
        status="completed",
        xp_balance=current_user.xp_balance,
        current_level=current_user.current_level,
        unlocked_badges=unlocked,
        certificate_awarded=certificate is not None and certificate_before is None,
    )
