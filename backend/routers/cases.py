from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import User, AuditLog
from models.schemas import CaseSearchRequest, CaseSearchResponse
from services.rag_service import search_similar_cases
from auth import get_current_user

router = APIRouter()


@router.post("/search", response_model=CaseSearchResponse)
async def search_cases(
    payload: CaseSearchRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = await search_similar_cases(payload)

        log = AuditLog(
            user_id=current_user.id,
            action="case_search",
            resource="cases",
            details={"query": payload.query[:200], "results": result.total},
            ip_address=request.client.host if request.client else None,
        )
        db.add(log)
        db.commit()

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
