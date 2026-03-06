from datetime import datetime

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Artifact, DailyProgress, DiscussionPost, User
from app.schemas import DiscussionPostCreate, DiscussionPostResponse
from app.seed import WEEKLY_CHALLENGES
from app.services.gamification import build_leaderboard

router = APIRouter(prefix="/community", tags=["community"])


def serialize_post(post: DiscussionPost) -> DiscussionPostResponse:
    return DiscussionPostResponse(
        id=post.id,
        topic=post.topic,
        body=post.body,
        likes=post.likes,
        created_at=post.created_at,
        author_name=post.user.full_name if post.user else "PM90 Member",
    )


@router.get("/overview")
def community_overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    posts = db.query(DiscussionPost).order_by(DiscussionPost.created_at.desc()).limit(8).all()
    recent_progress = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == current_user.id)
        .order_by(DailyProgress.completed_at.desc())
        .limit(4)
        .all()
    )
    recent_artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).order_by(Artifact.created_at.desc()).limit(4).all()

    feed = []
    for item in recent_progress:
        feed.append(
            {
                "type": "lesson-completed",
                "timestamp": item.completed_at.isoformat(),
                "message": f"Completed day {item.day.day_number}: {item.day.topic}" if item.day else "Completed a lesson",
            }
        )
    for artifact in recent_artifacts:
        feed.append(
            {
                "type": "artifact-created",
                "timestamp": artifact.created_at.isoformat(),
                "message": f"Created {artifact.kind}: {artifact.title}",
            }
        )
    feed.sort(key=lambda entry: entry["timestamp"], reverse=True)

    return {
        "posts": [serialize_post(post) for post in posts],
        "weekly_challenges": WEEKLY_CHALLENGES,
        "leaderboard": build_leaderboard(db),
        "progress_feed": feed[:8],
    }


@router.post("/posts", response_model=DiscussionPostResponse, status_code=status.HTTP_201_CREATED)
def create_post(payload: DiscussionPostCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DiscussionPostResponse:
    post = DiscussionPost(user_id=current_user.id, topic=payload.topic, body=payload.body, likes=0, created_at=datetime.utcnow())
    db.add(post)
    db.commit()
    db.refresh(post)
    return serialize_post(post)
