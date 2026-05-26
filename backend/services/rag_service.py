from models.schemas import CaseSearchRequest, CaseSearchResponse, CaseResult


async def search_similar_cases(payload: CaseSearchRequest) -> CaseSearchResponse:
    results = [
        CaseResult(
            case_id="CASE-001",
            title="Sample Legal Case",
            summary="This is a placeholder result. Connect a real RAG pipeline to return actual case data.",
            similarity_score=0.95,
        )
    ]
    return CaseSearchResponse(results=results)
