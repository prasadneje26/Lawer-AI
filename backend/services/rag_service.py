import random
from models.schemas import CaseSearchRequest, CaseSearchResponse, CaseResult

SAMPLE_CASES = [
    {
        "case_id": "AIR-2020-SC-1234",
        "title": "State of Maharashtra v. Praful Desai",
        "summary": "Landmark judgment on video conferencing in criminal trials. The Supreme Court held that examination of a witness through video conferencing is valid and does not violate the rights of the accused.",
        "case_type": "Criminal",
        "court": "Supreme Court of India",
        "year": 2020,
        "outcome": "Allowed",
        "relevant_sections": ["Section 273 CrPC", "Article 21 Constitution"],
        "key_points": ["Video conferencing permissible", "Right to fair trial not violated", "Technology in judicial process"],
    },
    {
        "case_id": "AIR-2017-SC-4733",
        "title": "Shayara Bano v. Union of India",
        "summary": "Triple Talaq (instant divorce) declared unconstitutional. The Supreme Court ruled that instant triple talaq is manifestly arbitrary and violates fundamental rights of Muslim women.",
        "case_type": "Constitutional",
        "court": "Supreme Court of India",
        "year": 2017,
        "outcome": "Allowed",
        "relevant_sections": ["Article 14", "Article 15", "Article 21", "Muslim Personal Law"],
        "key_points": ["Triple talaq unconstitutional", "Gender equality", "Fundamental rights"],
    },
    {
        "case_id": "AIR-2018-SC-1665",
        "title": "Navtej Singh Johar v. Union of India",
        "summary": "Section 377 IPC read down to decriminalize consensual same-sex acts among adults. Historic constitutional bench judgment affirming LGBTQ+ rights.",
        "case_type": "Constitutional",
        "court": "Supreme Court of India",
        "year": 2018,
        "outcome": "Allowed",
        "relevant_sections": ["Section 377 IPC", "Article 14", "Article 19", "Article 21"],
        "key_points": ["Section 377 decriminalized", "LGBTQ+ rights recognized", "Privacy and dignity"],
    },
    {
        "case_id": "AIR-2019-SC-849",
        "title": "Roger Mathew v. South Indian Bank Ltd",
        "summary": "Tribunal system and judicial independence. Constitutional validity of Financial Resolution and Deposit Insurance Bill examined. Court emphasized separation of powers.",
        "case_type": "Civil",
        "court": "Supreme Court of India",
        "year": 2019,
        "outcome": "Partially Allowed",
        "relevant_sections": ["Article 14", "Article 21", "Article 323-B"],
        "key_points": ["Tribunal reform", "Judicial independence", "Separation of powers"],
    },
    {
        "case_id": "AIR-2021-SC-2357",
        "title": "Satish Chandra Ahuja v. Sneha Ahuja",
        "summary": "Right of a daughter-in-law to reside in matrimonial home. The Supreme Court upheld the right under the Protection of Women from Domestic Violence Act.",
        "case_type": "Family",
        "court": "Supreme Court of India",
        "year": 2021,
        "outcome": "Dismissed",
        "relevant_sections": ["Section 17 PWDVA", "Section 2(s) PWDVA"],
        "key_points": ["Shared household definition", "Women's right to residence", "Domestic violence"],
    },
    {
        "case_id": "AIR-2022-SC-3897",
        "title": "Common Cause v. Union of India",
        "summary": "Right to die with dignity recognized. Supreme Court held that passive euthanasia and advance medical directives are legal. Expanded scope of Article 21.",
        "case_type": "Constitutional",
        "court": "Supreme Court of India",
        "year": 2022,
        "outcome": "Allowed",
        "relevant_sections": ["Article 21 Constitution", "Medical Ethics Guidelines"],
        "key_points": ["Right to die with dignity", "Passive euthanasia allowed", "Living will valid"],
    },
    {
        "case_id": "AIR-2016-SC-4411",
        "title": "NALSA v. Union of India (Follow-up)",
        "summary": "Implementation of transgender persons' rights. Court directed states to implement welfare schemes, provide reservations, and ensure legal recognition.",
        "case_type": "Constitutional",
        "court": "Supreme Court of India",
        "year": 2016,
        "outcome": "Allowed",
        "relevant_sections": ["Article 14", "Article 15", "Article 21"],
        "key_points": ["Transgender rights", "Self-identification", "Anti-discrimination"],
    },
    {
        "case_id": "AIR-2023-SC-1021",
        "title": "Jaswant Singh Sumra v. State of Gujarat",
        "summary": "Bail jurisprudence and personal liberty. Court reiterated that bail is the rule and jail is the exception, emphasizing speedy trial rights.",
        "case_type": "Criminal",
        "court": "Supreme Court of India",
        "year": 2023,
        "outcome": "Allowed",
        "relevant_sections": ["Section 437 CrPC", "Section 439 CrPC", "Article 21"],
        "key_points": ["Bail as rule", "Personal liberty", "Speedy trial"],
    },
]


async def search_similar_cases(payload: CaseSearchRequest) -> CaseSearchResponse:
    query_lower = payload.query.lower()
    results = []

    for case in SAMPLE_CASES:
        score = random.uniform(0.60, 0.95)

        keywords = query_lower.split()
        matches = sum(1 for kw in keywords if kw in case["title"].lower() or kw in case["summary"].lower())
        if matches > 0:
            score = min(0.98, score + matches * 0.05)

        if payload.case_type and payload.case_type.lower() != case["case_type"].lower():
            score -= 0.15
        if payload.court and payload.court.lower() not in case["court"].lower():
            score -= 0.1
        if payload.year_from and case["year"] < payload.year_from:
            score -= 0.2
        if payload.year_to and case["year"] > payload.year_to:
            score -= 0.2

        if score > 0.3:
            results.append(CaseResult(
                case_id=case["case_id"],
                title=case["title"],
                summary=case["summary"],
                case_type=case["case_type"],
                court=case["court"],
                year=case["year"],
                outcome=case["outcome"],
                similarity_score=round(score, 3),
                relevant_sections=case["relevant_sections"],
                key_points=case["key_points"],
            ))

    results.sort(key=lambda x: x.similarity_score, reverse=True)
    results = results[:payload.top_k or 5]

    return CaseSearchResponse(
        results=results,
        total=len(results),
        query=payload.query,
    )
