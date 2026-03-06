from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User
from app.schemas import SimulationAttemptRequest, SimulationAttemptResponse, SimulationScenario
from app.seed import SIMULATION_SCENARIOS
from app.services.ai import mentor_engine
from app.services.gamification import compute_level, sync_badges

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.get("", response_model=List[SimulationScenario])
def list_simulations(current_user: User = Depends(get_current_user)) -> List[SimulationScenario]:
    return SIMULATION_SCENARIOS


@router.post("/{scenario_key}/attempt", response_model=SimulationAttemptResponse)
async def submit_attempt(
    scenario_key: str,
    payload: SimulationAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SimulationAttemptResponse:
    scenario = next((item for item in SIMULATION_SCENARIOS if item["key"] == scenario_key), None)
    if not scenario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")

    score = min(98.0, round(68 + (len(payload.rationale.split()) * 1.1) + (10 if payload.selected_option else 0), 1))
    prompt = (
        f"Simulation: {scenario['title']}\nSelected action: {payload.selected_option}\n"
        f"Rationale: {payload.rationale}\nRecommended focus: {scenario['recommended_focus']}"
    )
    result = await mentor_engine.respond(
        f"You are grading a PM simulation response for {current_user.full_name}. Give product judgment feedback.",
        prompt,
    )

    attempt = SimulationAttempt(
        user_id=current_user.id,
        scenario_key=scenario_key,
        selected_option=payload.selected_option,
        rationale=payload.rationale,
        score=score,
        feedback=result["response"],
    )
    db.add(attempt)
    current_user.xp_balance += 50
    current_user.current_level = compute_level(current_user.xp_balance)
    db.commit()
    db.refresh(current_user)

    days = db.query(DayContent).all()
    progress_entries = db.query(DailyProgress).filter(DailyProgress.user_id == current_user.id).all()
    artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).all()
    attempts = db.query(SimulationAttempt).filter(SimulationAttempt.user_id == current_user.id).all()
    sync_badges(db, current_user, days, progress_entries, artifacts, attempts)
    db.refresh(current_user)

    return SimulationAttemptResponse(score=score, feedback=result["response"], xp_balance=current_user.xp_balance)
