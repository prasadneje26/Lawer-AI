from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import User, Prediction, AuditLog
from models.schemas import OutcomePredictionRequest, OutcomePredictionResponse
from services.prediction_service import predict_case_outcome
from auth import get_current_user

router = APIRouter()


@router.post("", response_model=OutcomePredictionResponse)
async def predict_outcome(
    payload: OutcomePredictionRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = await predict_case_outcome(payload)

        pred = Prediction(
            user_id=current_user.id,
            case_description=payload.case_description[:1000],
            case_type=payload.case_type,
            predicted_outcome=result.predicted_outcome,
            win_probability=result.win_probability,
            lose_probability=result.lose_probability,
            confidence=result.confidence,
            reasoning=result.reasoning,
            factors=result.key_factors,
        )
        db.add(pred)

        log = AuditLog(
            user_id=current_user.id,
            action="prediction_made",
            resource="predictions",
            details={"outcome": result.predicted_outcome, "confidence": result.confidence},
            ip_address=request.client.host if request.client else None,
        )
        db.add(log)
        db.commit()

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/my-predictions")
async def get_my_predictions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    preds = db.query(Prediction).filter(Prediction.user_id == current_user.id)\
        .order_by(Prediction.created_at.desc()).limit(20).all()
    return [
        {
            "id": p.id,
            "case_type": p.case_type,
            "predicted_outcome": p.predicted_outcome,
            "win_probability": p.win_probability,
            "confidence": p.confidence,
            "created_at": p.created_at.isoformat(),
        }
        for p in preds
    ]
