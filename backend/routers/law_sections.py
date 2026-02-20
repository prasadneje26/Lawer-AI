from fastapi import APIRouter, HTTPException

from models.schemas import LawSectionRequest, LawSectionResponse
from services.law_section_service import find_law_sections


router = APIRouter()


@router.post("", response_model=LawSectionResponse)
async def get_law_sections(payload: LawSectionRequest) -> LawSectionResponse:
    try:
        return await find_law_sections(payload)
    except Exception as exc:  # pragma: no cover - generic fallback
        raise HTTPException(status_code=500, detail=str(exc)) from exc

