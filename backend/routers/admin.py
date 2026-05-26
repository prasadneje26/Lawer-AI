from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.db_models import User, Document, Prediction, AuditLog
from models.schemas import AdminStats
from auth import require_admin

router = APIRouter()


@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0)

    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()

    searches_today = db.query(AuditLog).filter(
        AuditLog.action == "case_search",
        AuditLog.created_at >= today
    ).count()

    total_docs = db.query(Document).count()
    total_preds = db.query(Prediction).count()

    role_counts = db.query(User.role, func.count(User.id)).group_by(User.role).all()
    users_by_role = {role: count for role, count in role_counts}

    recent = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_users = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "organization": u.organization,
            "created_at": u.created_at.isoformat(),
        }
        for u in recent
    ]

    return AdminStats(
        total_users=total_users,
        active_users=active_users,
        total_searches_today=searches_today,
        total_documents_generated=total_docs,
        total_predictions_made=total_preds,
        users_by_role=users_by_role,
        recent_users=recent_users,
    )


@router.get("/users")
async def list_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
):
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(User).count()
    return {
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "organization": u.organization,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat(),
            }
            for u in users
        ],
        "total": total,
    }


@router.patch("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "is_active": user.is_active}


@router.get("/audit-logs")
async def get_audit_logs(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(AuditLog).count()
    return {
        "logs": [
            {
                "id": l.id,
                "user_id": l.user_id,
                "action": l.action,
                "resource": l.resource,
                "details": l.details,
                "ip_address": l.ip_address,
                "created_at": l.created_at.isoformat(),
            }
            for l in logs
        ],
        "total": total,
    }


@router.get("/analytics")
async def get_analytics(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    days = []
    for i in range(7, 0, -1):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        searches = db.query(AuditLog).filter(
            AuditLog.action == "case_search",
            AuditLog.created_at >= day_start,
            AuditLog.created_at < day_end,
        ).count()
        docs = db.query(Document).filter(
            Document.created_at >= day_start,
            Document.created_at < day_end,
        ).count()
        preds = db.query(Prediction).filter(
            Prediction.created_at >= day_start,
            Prediction.created_at < day_end,
        ).count()
        days.append({
            "date": day_start.strftime("%b %d"),
            "searches": searches,
            "documents": docs,
            "predictions": preds,
        })

    doc_types = db.query(
        Document.document_type, func.count(Document.id)
    ).group_by(Document.document_type).all()

    return {
        "weekly_activity": days,
        "document_types": [{"type": t, "count": c} for t, c in doc_types],
        "total_users": db.query(User).count(),
        "total_actions": db.query(AuditLog).count(),
    }
