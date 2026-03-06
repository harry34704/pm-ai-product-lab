from fastapi import APIRouter

from app.seed import RESOURCE_CATALOG

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("")
def list_resources() -> dict:
    return {"resources": RESOURCE_CATALOG}
