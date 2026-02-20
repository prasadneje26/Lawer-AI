from fastapi import APIRouter, File, HTTPException, UploadFile

from models.schemas import (
    DocumentGenerationRequest,
    DocumentGenerationResponse,
    JudgmentSummaryResponse,
)
from services.document_service import generate_legal_document
from services.summarization_service import summarize_judgment_pdf


router = APIRouter()


@router.post("/summarize-judgment", response_model=JudgmentSummaryResponse)
async def summarize_judgment(file: UploadFile = File(...)) -> JudgmentSummaryResponse:
    try:
        return await summarize_judgment_pdf(file)
    except Exception as exc:  # pragma: no cover - generic fallback
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/generate-document", response_model=DocumentGenerationResponse)
async def generate_document(
    payload: DocumentGenerationRequest,
) -> DocumentGenerationResponse:
    try:
        return await generate_legal_document(payload)
    except Exception as exc:  # pragma: no cover - generic fallback
        raise HTTPException(status_code=500, detail=str(exc)) from exc

