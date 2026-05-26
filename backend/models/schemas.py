from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "lawyer"
    organization: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    organization: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class CaseSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    case_type: Optional[str] = None
    court: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None


class CaseResult(BaseModel):
    case_id: str
    title: str
    summary: str
    case_type: Optional[str] = None
    court: Optional[str] = None
    year: Optional[int] = None
    outcome: Optional[str] = None
    similarity_score: float
    relevant_sections: Optional[List[str]] = None
    key_points: Optional[List[str]] = None


class CaseSearchResponse(BaseModel):
    results: List[CaseResult]
    total: int
    query: str


class LawSectionRequest(BaseModel):
    query: str
    act: Optional[str] = None


class LawSectionResult(BaseModel):
    section: str
    act: str
    title: str
    description: str
    relevance_score: float
    related_sections: Optional[List[str]] = None


class LawSectionResponse(BaseModel):
    sections: List[LawSectionResult]
    query: str


class JudgmentSummaryResponse(BaseModel):
    summary: str
    key_points: List[str]
    parties: Optional[Dict[str, str]] = None
    verdict: Optional[str] = None
    important_dates: Optional[List[str]] = None
    relevant_sections: Optional[List[str]] = None
    case_type: Optional[str] = None


class DocumentGenerationRequest(BaseModel):
    document_type: str
    details: Dict[str, Any]
    party_name: Optional[str] = None
    case_details: Optional[str] = None


class DocumentGenerationResponse(BaseModel):
    document: str
    document_type: str
    title: str
    word_count: int


class OutcomePredictionRequest(BaseModel):
    case_description: str
    case_type: Optional[str] = None
    jurisdiction: Optional[str] = None
    key_facts: Optional[List[str]] = None


class OutcomePredictionResponse(BaseModel):
    predicted_outcome: str
    win_probability: float
    lose_probability: float
    confidence: float
    reasoning: str
    key_factors: List[Dict[str, Any]]
    similar_cases: Optional[List[str]] = None


class DashboardStats(BaseModel):
    total_searches: int
    total_documents: int
    total_predictions: int
    recent_activity: List[Dict[str, Any]]
    searches_this_week: int
    documents_this_week: int


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_searches_today: int
    total_documents_generated: int
    total_predictions_made: int
    users_by_role: Dict[str, int]
    recent_users: List[Dict[str, Any]]


class AnalyticsData(BaseModel):
    search_trends: List[Dict[str, Any]]
    document_types: List[Dict[str, Any]]
    prediction_accuracy: float
    weekly_activity: List[Dict[str, Any]]


class AuditLogResponse(BaseModel):
    id: int
    action: str
    resource: Optional[str] = None
    details: Optional[Dict] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int
