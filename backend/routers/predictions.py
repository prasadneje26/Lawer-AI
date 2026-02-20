from fastapi import APIRouter, HTTPException

from models.schemas import (
    OutcomePredictionRequest,
    OutcomePredictionResponse,
)
from services.prediction_service import predict_case_outcome


router = APIRouter()


@router.post("", response_model=OutcomePredictionResponse)
async def predict_outcome(
    payload: OutcomePredictionRequest,
) -> OutcomePredictionResponse:
    try:
        return await predict_case_outcome(payload)
    except Exception as exc:  # pragma: no cover - generic fallback
        raise HTTPException(status_code=500, detail=str(exc)) from exc

