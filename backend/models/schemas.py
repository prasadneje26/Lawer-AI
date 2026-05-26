from typing import List, Optional
from pydantic import BaseModel


class CaseSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5


class CaseResult(BaseModel):
    case_id: str
    title: str
    summary: str
    similarity_score: float


class CaseSearchResponse(BaseModel):
    results: List[CaseResult]


class LawSectionRequest(BaseModel):
    query: str


class LawSectionResult(BaseModel):
    section: str
    title: str
    description: str


class LawSectionResponse(BaseModel):
    sections: List[LawSectionResult]


class JudgmentSummaryResponse(BaseModel):
    summary: str
    key_points: List[str]


class DocumentGenerationRequest(BaseModel):
    document_type: str
    details: dict


class DocumentGenerationResponse(BaseModel):
    document: str
    document_type: str


class OutcomePredictionRequest(BaseModel):
    case_description: str
    case_type: Optional[str] = None


class OutcomePredictionResponse(BaseModel):
    predicted_outcome: str
    confidence: float
    reasoning: str
