from typing import List
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import cases, law_sections, documents, predictions


def get_allowed_origins() -> List[str]:
    default_origins = ["http://localhost:3000"]
    raw_origins = os.getenv("BACKEND_CORS_ORIGINS")

    if not raw_origins:
        return default_origins

    parsed = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    return parsed or default_origins


app = FastAPI(title="Lawer AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}


app.include_router(cases.router, prefix="/cases", tags=["cases"])
app.include_router(law_sections.router, prefix="/law-sections", tags=["law-sections"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

