from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import cases, law_sections, documents, predictions


app = FastAPI(title="Lawer AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

