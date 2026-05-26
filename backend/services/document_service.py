from models.schemas import DocumentGenerationRequest, DocumentGenerationResponse


async def generate_legal_document(payload: DocumentGenerationRequest) -> DocumentGenerationResponse:
    return DocumentGenerationResponse(
        document=f"This is a placeholder {payload.document_type} document. Connect an LLM to generate real legal documents.",
        document_type=payload.document_type,
    )
