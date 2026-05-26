from typing import List
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from database import engine, Base
import models.db_models  # noqa: F401 — registers all ORM models

from routers import cases, law_sections, documents, predictions
from routers import auth as auth_router
from routers import dashboard as dashboard_router
from routers import admin as admin_router

Base.metadata.create_all(bind=engine)


def get_allowed_origins() -> List[str]:
    raw = os.getenv("BACKEND_CORS_ORIGINS", "")
    defaults = [
        "http://localhost:5000",
        "http://localhost:3000",
        "http://0.0.0.0:5000",
        "https://0.0.0.0:5000",
    ]
    if raw:
        extras = [o.strip() for o in raw.split(",") if o.strip()]
        return defaults + extras
    return defaults


app = FastAPI(
    title="Lawer-AI 2.0",
    description="Professional AI-Powered Legal Intelligence Platform",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "2.0.0", "service": "Lawer-AI Backend"}


app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(dashboard_router.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(cases.router, prefix="/cases", tags=["Case Search"])
app.include_router(law_sections.router, prefix="/law-sections", tags=["Law Sections"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
app.include_router(admin_router.router, prefix="/admin", tags=["Admin"])
