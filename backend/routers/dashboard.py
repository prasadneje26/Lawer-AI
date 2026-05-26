from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.db_models import User, Case, Document, Prediction, AuditLog
from models.schemas import DashboardStats
from auth import get_current_user

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    week_ago = datetime.utcnow() - timedelta(days=7)

    total_searches = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id,
        AuditLog.action == "case_search"
    ).count()

    total_documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).count()

    total_predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).count()

    searches_this_week = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id,
        AuditLog.action == "case_search",
        AuditLog.created_at >= week_ago
    ).count()

    docs_this_week = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.created_at >= week_ago
    ).count()

    recent_logs = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id
    ).order_by(AuditLog.created_at.desc()).limit(8).all()

    recent_activity = [
        {
            "id": log.id,
            "action": log.action,
            "resource": log.resource,
            "details": log.details,
            "created_at": log.created_at.isoformat(),
        }
        for log in recent_logs
    ]

    return DashboardStats(
        total_searches=total_searches,
        total_documents=total_documents,
        total_predictions=total_predictions,
        recent_activity=recent_activity,
        searches_this_week=searches_this_week,
        documents_this_week=docs_this_week,
    )
