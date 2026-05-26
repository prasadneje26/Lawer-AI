import random
from models.schemas import LawSectionRequest, LawSectionResponse, LawSectionResult

LAW_DATABASE = [
    {"section": "Section 302", "act": "Indian Penal Code, 1860", "title": "Punishment for Murder",
     "description": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
     "related": ["Section 300 IPC", "Section 304 IPC", "Section 307 IPC"]},
    {"section": "Section 420", "act": "Indian Penal Code, 1860", "title": "Cheating and Dishonestly Inducing Delivery of Property",
     "description": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, shall be punished with imprisonment up to 7 years and fine.",
     "related": ["Section 415 IPC", "Section 417 IPC", "Section 405 IPC"]},
    {"section": "Section 376", "act": "Indian Penal Code, 1860", "title": "Punishment for Rape",
     "description": "Whoever commits rape shall be punished with rigorous imprisonment not less than 10 years which may extend to imprisonment for life, and fine.",
     "related": ["Section 375 IPC", "Section 376A IPC", "Section 376B IPC"]},
    {"section": "Section 498A", "act": "Indian Penal Code, 1860", "title": "Cruelty by Husband or His Relatives",
     "description": "Whoever subjects a woman to cruelty shall be punished with imprisonment up to 3 years and fine. Includes harassment for dowry demands.",
     "related": ["Section 304B IPC", "Section 406 IPC", "Dowry Prohibition Act"]},
    {"section": "Section 138", "act": "Negotiable Instruments Act, 1881", "title": "Dishonour of Cheque for Insufficiency of Funds",
     "description": "Where a cheque drawn by a person is returned unpaid, such person shall be deemed to have committed an offence punishable with imprisonment up to 2 years or fine up to twice the cheque amount.",
     "related": ["Section 139 NI Act", "Section 141 NI Act", "Section 142 NI Act"]},
    {"section": "Section 25", "act": "Indian Contract Act, 1872", "title": "Agreement Without Consideration is Void",
     "description": "An agreement made without consideration is void unless it is a written and registered agreement, or a promise to compensate past voluntary service, or a promise to pay a time-barred debt.",
     "related": ["Section 2(d) ICA", "Section 10 ICA", "Section 23 ICA"]},
    {"section": "Article 21", "act": "Constitution of India", "title": "Protection of Life and Personal Liberty",
     "description": "No person shall be deprived of his life or personal liberty except according to procedure established by law. This has been expansively interpreted to include right to health, education, privacy, and dignified life.",
     "related": ["Article 14", "Article 19", "Article 32"]},
    {"section": "Article 14", "act": "Constitution of India", "title": "Equality Before Law",
     "description": "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
     "related": ["Article 15", "Article 16", "Article 21"]},
    {"section": "Section 17", "act": "Protection of Women from Domestic Violence Act, 2005", "title": "Right to Reside in Shared Household",
     "description": "Every woman in a domestic relationship shall have the right to reside in the shared household, whether or not she has any right, title or beneficial interest in the same.",
     "related": ["Section 18 PWDVA", "Section 19 PWDVA", "Section 20 PWDVA"]},
    {"section": "Section 125", "act": "Code of Criminal Procedure, 1973", "title": "Order for Maintenance of Wives, Children and Parents",
     "description": "If any person having sufficient means neglects or refuses to maintain his wife, legitimate/illegitimate minor child, or aged parents, a Magistrate may order monthly allowance for maintenance.",
     "related": ["Section 126 CrPC", "Section 127 CrPC", "Hindu Adoption and Maintenance Act"]},
    {"section": "Section 9", "act": "Hindu Marriage Act, 1955", "title": "Restitution of Conjugal Rights",
     "description": "When either party withdraws from the society of the other without reasonable excuse, the aggrieved party may apply for restitution of conjugal rights.",
     "related": ["Section 13 HMA", "Section 10 HMA", "Article 21 Constitution"]},
    {"section": "Section 437", "act": "Code of Criminal Procedure, 1973", "title": "When Bail may be Taken in Case of Non-Bailable Offence",
     "description": "Any person accused of non-bailable offence may be released on bail by officer in charge or court, subject to conditions. Bail should be the rule and jail the exception.",
     "related": ["Section 436 CrPC", "Section 439 CrPC", "Section 167 CrPC"]},
]


async def find_law_sections(payload: LawSectionRequest) -> LawSectionResponse:
    query_lower = payload.query.lower()
    results = []

    for law in LAW_DATABASE:
        score = random.uniform(0.50, 0.80)

        words = query_lower.split()
        matches = sum(
            1 for w in words
            if w in law["title"].lower() or w in law["description"].lower()
               or w in law["section"].lower() or w in law["act"].lower()
        )
        if matches:
            score = min(0.99, score + matches * 0.06)

        if payload.act and payload.act.lower() not in law["act"].lower():
            score -= 0.3

        if score > 0.4:
            results.append(LawSectionResult(
                section=law["section"],
                act=law["act"],
                title=law["title"],
                description=law["description"],
                relevance_score=round(score, 3),
                related_sections=law["related"],
            ))

    results.sort(key=lambda x: x.relevance_score, reverse=True)

    return LawSectionResponse(sections=results[:8], query=payload.query)
