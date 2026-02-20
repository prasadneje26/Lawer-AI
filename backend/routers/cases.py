from typing import List

from fastapi import APIRouter, HTTPException

from models.schemas import CaseSearchRequest, CaseSearchResponse
from services.rag_service import search_similar_cases


router = APIRouter()


@router.post("/search", response_model=CaseSearchResponse)
async def search_cases(payload: CaseSearchRequest) -> CaseSearchResponse:
    try:
        return await search_similar_cases(payload)
    except Exception as exc:  # pragma: no cover - generic fallback
        raise HTTPException(status_code=500, detail=str(exc)) from exc

