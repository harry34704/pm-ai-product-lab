from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.models import Artifact, DailyProgress, DayContent, SimulationAttempt, User
from app.services.gamification import build_skill_tree


def _completion_score(progress_entries: List[DailyProgress], total_days: int) -> Optional[float]:
    if total_days <= 0 or len(progress_entries) < total_days:
        return None
    scores = [entry.score if entry.score is not None else 85.0 for entry in progress_entries]
    if not scores:
        return None
    return round(sum(scores) / len(scores), 1)


def _certificate_content(
    user: User,
    completion_score: float,
    skill_breakdown: List[Dict],
    portfolio_highlights: List[str],
) -> str:
    skill_lines = "\n".join(
        f"- {skill['skill']}: {skill['progress_percent']}% complete · Level {skill['current_level']}" for skill in skill_breakdown
    )
    artifact_lines = "\n".join(f"- {title}" for title in portfolio_highlights) if portfolio_highlights else "- Portfolio artifacts will appear here."
    issued_on = datetime.utcnow().strftime("%Y-%m-%d")
    return (
        f"# PM90 Certified Product Manager\n\n"
        f"**Awarded to:** {user.full_name}\n\n"
        f"**Completion score:** {completion_score}\n\n"
        f"**Issued on:** {issued_on}\n\n"
        "## Skill breakdown\n"
        f"{skill_lines}\n\n"
        "## Portfolio highlights\n"
        f"{artifact_lines}\n"
    )


def ensure_certificate_artifact(
    db: Session,
    user: User,
    days: List[DayContent],
    progress_entries: List[DailyProgress],
    artifacts: List[Artifact],
    attempts: List[SimulationAttempt],
) -> Optional[Artifact]:
    completed_ids = {entry.day.day_number for entry in progress_entries if entry.day}
    total_days = len(days)
    eligible = total_days > 0 and len(completed_ids) >= total_days
    existing = next((artifact for artifact in artifacts if artifact.kind == "certificate"), None)

    if not eligible:
        return existing
    if existing:
        return existing

    skill_breakdown = build_skill_tree(days, completed_ids, len(attempts))
    completion_score = _completion_score(progress_entries, total_days) or 100.0
    portfolio_highlights = [artifact.title for artifact in artifacts if artifact.kind != "certificate"][:6]
    artifact = Artifact(
        user_id=user.id,
        title=f"PM90 Certified Product Manager - {user.full_name}",
        kind="certificate",
        summary="Official PM90 completion certificate with score, skill breakdown, and portfolio highlights.",
        content=_certificate_content(user, completion_score, skill_breakdown, portfolio_highlights),
        metadata_json={
            "certificate_title": "PM90 Certified Product Manager",
            "completion_score": completion_score,
            "skill_breakdown": skill_breakdown,
            "portfolio_highlights": portfolio_highlights,
        },
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)
    return artifact


def build_certificate_summary(
    days: List[DayContent],
    progress_entries: List[DailyProgress],
    artifacts: List[Artifact],
    attempts: List[SimulationAttempt],
) -> Dict:
    completed_ids = {entry.day.day_number for entry in progress_entries if entry.day}
    total_days = len(days)
    eligible = total_days > 0 and len(completed_ids) >= total_days
    certificate = next((artifact for artifact in artifacts if artifact.kind == "certificate"), None)
    metadata = certificate.metadata_json or {} if certificate else {}

    return {
        "eligible": eligible,
        "issued": certificate is not None,
        "title": certificate.title if certificate else "PM90 Certified Product Manager" if eligible else None,
        "completion_score": metadata.get("completion_score") if certificate else _completion_score(progress_entries, total_days),
        "issued_at": certificate.created_at if certificate else None,
        "certificate_artifact_id": certificate.id if certificate else None,
        "portfolio_highlights": metadata.get("portfolio_highlights", []),
    }
