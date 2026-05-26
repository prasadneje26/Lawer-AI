from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import User
from models.schemas import LawSectionRequest, LawSectionResponse
from services.law_section_service import find_law_sections
from auth import get_current_user

router = APIRouter()


@router.post("", response_model=LawSectionResponse)
async def get_law_sections(
    payload: LawSectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return await find_law_sections(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
