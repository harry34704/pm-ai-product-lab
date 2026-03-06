from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models import User
from app.schemas import InterviewRequest, MentorRequest, MentorResponse, ReviewRequest
from app.services.ai import mentor_engine

router = APIRouter(prefix="/mentor", tags=["mentor"])


def build_system_prompt(mode: str, user: User) -> str:
    return (
        f"You are the PM90 AI mentor. The learner is {user.full_name}, currently level {user.current_level} "
        f"with {user.xp_balance} XP. Respond like a strong product leader: clear, structured, and feedback-rich. "
        f"Mode: {mode}."
    )


@router.post("/chat", response_model=MentorResponse)
async def chat(payload: MentorRequest, current_user: User = Depends(get_current_user)) -> MentorResponse:
    result = await mentor_engine.respond(build_system_prompt(payload.mode, current_user), payload.prompt, payload.context)
    return MentorResponse(mode=payload.mode, provider=result["provider"], response=result["response"])


@router.post("/review-prd", response_model=MentorResponse)
async def review_prd(payload: ReviewRequest, current_user: User = Depends(get_current_user)) -> MentorResponse:
    prompt = f"Review this PRD and provide strengths, gaps, and improvements:\n\n{payload.content}"
    result = await mentor_engine.respond(build_system_prompt("prd-review", current_user), prompt)
    return MentorResponse(mode="prd-review", provider=result["provider"], response=result["response"])


@router.post("/evaluate-challenge", response_model=MentorResponse)
async def evaluate_challenge(payload: ReviewRequest, current_user: User = Depends(get_current_user)) -> MentorResponse:
    prompt = f"Evaluate this PM90 challenge answer and explain how to improve it:\n\n{payload.content}"
    result = await mentor_engine.respond(build_system_prompt("challenge-evaluation", current_user), prompt)
    return MentorResponse(mode="challenge-evaluation", provider=result["provider"], response=result["response"])


@router.post("/interview", response_model=MentorResponse)
async def interview(payload: InterviewRequest, current_user: User = Depends(get_current_user)) -> MentorResponse:
    prompt = f"Interview question: {payload.question}\n\nCandidate answer:\n{payload.answer}"
    result = await mentor_engine.respond(build_system_prompt("interview", current_user), prompt)
    return MentorResponse(mode="interview", provider=result["provider"], response=result["response"])
