from fastapi import APIRouter, File, HTTPException, UploadFile, Depends, Request
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import User, Document, AuditLog
from models.schemas import (
    DocumentGenerationRequest,
    DocumentGenerationResponse,
    JudgmentSummaryResponse,
)
from services.document_service import generate_legal_document
from services.summarization_service import summarize_judgment_pdf
from auth import get_current_user

router = APIRouter()


@router.post("/summarize-judgment", response_model=JudgmentSummaryResponse)
async def summarize_judgment(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return await summarize_judgment_pdf(file)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/generate-document", response_model=DocumentGenerationResponse)
async def generate_document(
    payload: DocumentGenerationRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = await generate_legal_document(payload)

        doc = Document(
            user_id=current_user.id,
            document_type=payload.document_type,
            title=result.title,
            generated_text=result.document,
            details=payload.details,
        )
        db.add(doc)

        log = AuditLog(
            user_id=current_user.id,
            action="document_generated",
            resource="documents",
            details={"type": payload.document_type, "title": result.title},
            ip_address=request.client.host if request.client else None,
        )
        db.add(log)
        db.commit()

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/my-documents")
async def get_my_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    docs = db.query(Document).filter(Document.user_id == current_user.id)\
        .order_by(Document.created_at.desc()).limit(20).all()
    return [
        {
            "id": d.id,
            "document_type": d.document_type,
            "title": d.title,
            "created_at": d.created_at.isoformat(),
            "word_count": len(d.generated_text.split()) if d.generated_text else 0,
        }
        for d in docs
    ]
