from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Artifact, User
from app.schemas import ArtifactCreate, ArtifactGenerateRequest, ArtifactResponse
from app.services.exporters import build_markdown_export, build_notion_export, build_pdf_export

router = APIRouter(prefix="/artifacts", tags=["artifacts"])


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


def create_artifact_record(
    db: Session,
    user_id: int,
    title: str,
    kind: str,
    content: str,
    summary: str,
    metadata: dict,
) -> Artifact:
    artifact = Artifact(
        user_id=user_id,
        title=title,
        kind=kind,
        summary=summary,
        content=content,
        metadata_json=metadata,
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)
    return artifact


def build_prd(payload: ArtifactGenerateRequest) -> str:
    return (
        f"# PRD: {payload.product_name}\n\n"
        f"## Audience\n{payload.audience}\n\n"
        f"## Problem\n{payload.problem}\n\n"
        f"## Outcome\n{payload.outcome}\n\n"
        "## User Stories\n"
        "- As a target user, I need a guided workflow that reduces setup friction.\n"
        "- As a PM, I need instrumentation to measure activation and retention changes.\n\n"
        "## Success Metrics\n"
        "- Activation rate\n- Time to first value\n- Retention after 7 days\n\n"
        "## Risks and Dependencies\n"
        "- Delivery capacity\n- Analytics instrumentation quality\n- Stakeholder readiness\n\n"
        f"## Context\n{payload.context or 'No additional context provided.'}\n"
    )


def build_roadmap(payload: ArtifactGenerateRequest) -> str:
    return (
        f"# Roadmap: {payload.product_name}\n\n"
        "## Now\n"
        f"- Clarify the problem: {payload.problem}\n"
        "- Instrument baseline metrics\n- Define rollout guardrails\n\n"
        "## Next\n"
        "- Build the highest-confidence solution slice\n- Prepare launch assets and support enablement\n\n"
        "## Later\n"
        "- Expand based on user learning\n- Add experiments for growth, retention, and monetization\n\n"
        f"## Intended Outcome\n{payload.outcome}\n"
    )


def build_prioritization_board(payload: ArtifactGenerateRequest) -> str:
    return (
        f"# Prioritization Board: {payload.product_name}\n\n"
        "| Initiative | Reach | Impact | Confidence | Effort | Notes |\n"
        "| --- | --- | --- | --- | --- | --- |\n"
        f"| Solve core problem | High | High | Medium | Medium | {payload.problem} |\n"
        "| Instrument analytics | Medium | High | High | Low | Needed to validate success |\n"
        "| Lifecycle messaging | Medium | Medium | Medium | Low | Supports retention lift |\n"
        "| Advanced automation | Low | Medium | Low | High | Consider after core validation |\n"
    )


@router.get("", response_model=List[ArtifactResponse])
def list_artifacts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[ArtifactResponse]:
    artifacts = db.query(Artifact).filter(Artifact.user_id == current_user.id).order_by(Artifact.created_at.desc()).all()
    return [serialize_artifact(artifact) for artifact in artifacts]


@router.post("", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def create_artifact(payload: ArtifactCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ArtifactResponse:
    artifact = create_artifact_record(db, current_user.id, payload.title, payload.kind, payload.content, payload.summary or "", payload.metadata)
    return serialize_artifact(artifact)


@router.post("/generate/prd", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def generate_prd(payload: ArtifactGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ArtifactResponse:
    content = build_prd(payload)
    artifact = create_artifact_record(db, current_user.id, f"PRD: {payload.product_name}", "prd", content, "AI-assisted PRD draft", {"format": "markdown", "generator": "pm90"})
    return serialize_artifact(artifact)


@router.post("/generate/roadmap", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def generate_roadmap(payload: ArtifactGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ArtifactResponse:
    content = build_roadmap(payload)
    artifact = create_artifact_record(db, current_user.id, f"Roadmap: {payload.product_name}", "roadmap", content, "AI-assisted roadmap draft", {"format": "markdown", "generator": "pm90"})
    return serialize_artifact(artifact)


@router.post("/generate/prioritization", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def generate_prioritization(payload: ArtifactGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ArtifactResponse:
    content = build_prioritization_board(payload)
    artifact = create_artifact_record(db, current_user.id, f"Prioritization: {payload.product_name}", "prioritization", content, "AI-assisted prioritization board", {"format": "markdown", "generator": "pm90"})
    return serialize_artifact(artifact)


@router.get("/{artifact_id}/export")
def export_artifact(
    artifact_id: int,
    format: str = Query("markdown", pattern="^(markdown|notion|pdf)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    artifact = db.query(Artifact).filter(Artifact.id == artifact_id, Artifact.user_id == current_user.id).first()
    if not artifact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artifact not found")

    metadata = artifact.metadata_json or {}
    filename_root = artifact.title.lower().replace(" ", "-")
    if format == "pdf":
        pdf_bytes = build_pdf_export(artifact.title, artifact.content, metadata)
        headers = {"Content-Disposition": f'attachment; filename="{filename_root}.pdf"'}
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    if format == "notion":
        notion_text = build_notion_export(artifact.title, artifact.content, metadata)
        headers = {"Content-Disposition": f'attachment; filename="{filename_root}.txt"'}
        return Response(content=notion_text, media_type="text/plain", headers=headers)

    markdown_text = build_markdown_export(artifact.title, artifact.content, metadata)
    headers = {"Content-Disposition": f'attachment; filename="{filename_root}.md"'}
    return Response(content=markdown_text, media_type="text/markdown", headers=headers)
