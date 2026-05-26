from fastapi import UploadFile
from models.schemas import JudgmentSummaryResponse


async def summarize_judgment_pdf(file: UploadFile) -> JudgmentSummaryResponse:
    return JudgmentSummaryResponse(
        summary="This is a placeholder summary. Connect an LLM or PDF parser to extract real judgment content.",
        key_points=[
            "Key point 1: Placeholder",
            "Key point 2: Placeholder",
        ],
    )
