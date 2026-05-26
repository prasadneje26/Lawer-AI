from models.schemas import DocumentGenerationRequest, DocumentGenerationResponse

TEMPLATES = {
    "FIR Draft": """
IN THE {court}
{police_station} POLICE STATION, {district}, {state}

FIRST INFORMATION REPORT

Date: {date}
Time: {time}

To,
The Station House Officer,
{police_station} Police Station,
{district} - {state}

Subject: FIR regarding {subject}

Respected Sir/Madam,

I, {complainant_name}, aged {age} years, residing at {address}, hereby lodge this First Information Report (FIR) regarding the following incident:

1. DETAILS OF THE COMPLAINANT:
   Name: {complainant_name}
   Father's/Husband's Name: {father_name}
   Address: {address}
   Contact No.: {phone}

2. DETAILS OF THE INCIDENT:
   Date of Incident: {incident_date}
   Time of Incident: {incident_time}
   Place of Incident: {incident_place}

3. DESCRIPTION OF THE INCIDENT:
{incident_description}

4. ACCUSED PERSONS (if known):
   Name: {accused_name}
   Address: {accused_address}
   Description: {accused_description}

5. WITNESSES (if any):
   Name: {witness_name}
   Address: {witness_address}

6. RELEVANT SECTIONS:
   The incident falls under the following provisions:
   {sections}

7. EVIDENCE AND DOCUMENTS:
   {evidence}

I hereby declare that the information given above is true and correct to the best of my knowledge and belief.

Yours faithfully,

(Signature)
{complainant_name}
Date: {date}
""",
    "Bail Application": """
IN THE HON'BLE COURT OF {court}
AT {city}

BAIL APPLICATION No. _______ of {year}

IN THE MATTER OF:
{accused_name}                    ...APPLICANT/ACCUSED
Versus
STATE OF {state}                  ...RESPONDENT

APPLICATION FOR BAIL UNDER SECTION 437/439 Cr.P.C.

MOST RESPECTFULLY SHOWETH:

1. That the Applicant/Accused {accused_name} aged {age} years, son/daughter of {father_name}, residing at {address} has been arrested on {arrest_date} in connection with Case No. {case_number} under Section(s) {sections} of {act}.

2. That the Applicant is innocent and has been falsely implicated in the present case.

3. GROUNDS FOR BAIL:

   (a) That the Applicant has deep roots in the society and is not likely to abscond.

   (b) That the Applicant has no prior criminal record and is a person of good character and reputation.

   (c) That the investigation is complete and the Applicant's continued detention is not necessary.

   (d) That the Applicant is the sole breadwinner of his/her family consisting of {family_details}.

   (e) That the offence alleged is bailable/the applicant deserves bail in view of the facts and circumstances.

   (f) That the Applicant undertakes to abide by all conditions imposed by this Hon'ble Court.

4. That the Applicant is ready and willing to furnish surety and bail bond as may be required by this Hon'ble Court.

5. That this is the first bail application filed on behalf of the Applicant before this Hon'ble Court.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Release the Applicant on bail on such terms and conditions as this Hon'ble Court may deem fit and proper.

(b) Pass such other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

                                                    Respectfully submitted,
                                                    
                                                    (Advocate Name)
                                                    Advocate for the Applicant
                                                    Enroll. No.: {enroll_number}
                                                    
Place: {city}
Date: {date}
""",
    "Legal Notice": """
LEGAL NOTICE

Date: {date}

To,
{recipient_name}
{recipient_address}

Via: Registered A.D. / Speed Post

Subject: Legal Notice for {subject}

Sir/Madam,

Under instructions from and on behalf of my client, {client_name}, residing at {client_address}, I hereby serve upon you this Legal Notice as under:

1. That my client is {client_description}.

2. That {facts_of_case}

3. That you are liable for {liability_details} under {applicable_law}.

4. That my client has suffered {loss_details} due to your acts/omissions.

5. That you are hereby called upon to {demand} within {days} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings, both civil and criminal, against you before the competent court of law, at your risk, cost, and consequences.

6. This notice is issued without prejudice to all other rights and remedies available to my client under law.

Please take notice accordingly.

Issued by:

{advocate_name}
Advocate
Bar Council No.: {bar_number}
Address: {advocate_address}
Phone: {advocate_phone}

Note: All costs of this notice shall be recoverable from you.
""",
    "Affidavit": """
AFFIDAVIT

I, {deponent_name}, aged {age} years, son/daughter of {father_name}, resident of {address}, do hereby solemnly affirm and state as under:

1. That I am the deponent herein and am fully conversant with the facts stated herein.

2. That {statement_1}

3. That {statement_2}

4. That {statement_3}

5. That this affidavit is executed for the purpose of {purpose}.

VERIFICATION:

I, {deponent_name}, the deponent above named, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

Verified at {place} on this {date}.

                                                    (Deponent's Signature)
                                                    {deponent_name}

SWORN/AFFIRMED before me on this {date}

                                                    (Signature and Seal)
                                                    Notary/Oath Commissioner
                                                    Place: {place}
""",
    "RTI Application": """
APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005

Date: {date}

To,
The Public Information Officer,
{department}
{address}

Subject: Request for Information Under Section 6(1) of the RTI Act, 2005

Sir/Madam,

I, {applicant_name}, son/daughter of {father_name}, residing at {applicant_address}, Phone: {phone}, wish to obtain the following information:

INFORMATION SOUGHT:

1. {question_1}

2. {question_2}

3. {question_3}

4. {question_4}

TIME PERIOD: {time_period}

PREFERRED FORMAT: {format} (Hard Copy / Soft Copy)

I am enclosing a demand draft/IPO/court fee stamp of Rs. 10/- towards the application fee as required under the RTI Act, 2005.

If the information requested is not available with your office, I request you to transfer this application to the concerned Public Information Officer as required under Section 6(3) of the RTI Act, 2005.

Yours faithfully,

(Signature)
{applicant_name}
Address: {applicant_address}
Phone: {phone}
Email: {email}

Enclosures:
1. Application fee of Rs. 10/-
2. {other_enclosures}
""",
    "Agreement": """
THIS AGREEMENT is entered into on {date} at {place}

BETWEEN:

{party_1_name}, aged {party_1_age} years, residing at {party_1_address} (hereinafter referred to as "Party A")

AND

{party_2_name}, aged {party_2_age} years, residing at {party_2_address} (hereinafter referred to as "Party B")

WHEREAS:

1. Party A and Party B desire to enter into this agreement for the purpose of {purpose}.

2. Both parties have agreed to the terms and conditions set out herein.

NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SCOPE OF AGREEMENT:
{scope}

2. OBLIGATIONS OF PARTY A:
{obligations_a}

3. OBLIGATIONS OF PARTY B:
{obligations_b}

4. CONSIDERATION:
{consideration}

5. DURATION:
This Agreement shall commence from {start_date} and shall remain in force until {end_date} unless terminated earlier.

6. CONFIDENTIALITY:
Both parties agree to maintain confidentiality of all information shared during the term of this Agreement.

7. DISPUTE RESOLUTION:
Any dispute arising from this Agreement shall be resolved through mutual negotiation, and if unresolved, through arbitration under the Arbitration and Conciliation Act, 1996, at {arbitration_place}.

8. GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

PARTY A:                           PARTY B:
(Signature)                        (Signature)
{party_1_name}                     {party_2_name}
Date:                              Date:

WITNESSES:
1. Name: _________________ Signature: _________________
2. Name: _________________ Signature: _________________
""",
    "Petition": """
IN THE HON'BLE {court}
AT {city}

WRIT PETITION (CIVIL/CRIMINAL) No. _______ of {year}

IN THE MATTER OF:
{petitioner_name}                         ...PETITIONER(S)
Versus
{respondent_name}                         ...RESPONDENT(S)

PETITION UNDER ARTICLE {article} OF THE CONSTITUTION OF INDIA

MOST RESPECTFULLY SHOWETH:

1. BRIEF FACTS:
{brief_facts}

2. LEGAL GROUNDS:
{legal_grounds}

3. THAT the petitioner has no other adequate remedy available except to approach this Hon'ble Court.

4. THAT the petitioner has not filed any other petition in this regard before any court.

PRAYER:
In view of the facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) {prayer_1}

(b) {prayer_2}

(c) Pass such other order(s) as this Hon'ble Court may deem fit and proper.

INTERIM RELIEF PRAYED:
{interim_relief}

                                                    Respectfully submitted,
                                                    PETITIONER(S) THROUGH
                                                    
                                                    {advocate_name}
                                                    Advocate for Petitioner
                                                    
Place: {city}
Date: {date}
""",
}

DEFAULT_TEMPLATE = """
LEGAL DOCUMENT — {document_type}

Prepared by: Lawer-AI 2.0
Date: {date}

PARTIES INVOLVED:
{parties}

SUBJECT:
{subject}

DETAILS:
{details}

TERMS AND CONDITIONS:
1. This document has been prepared based on the information provided.
2. {term_1}
3. {term_2}
4. {term_3}

CONCLUSION:
{conclusion}

SIGNATURES:
________________________
Authorized Signatory
Date: {date}
"""


async def generate_legal_document(payload: DocumentGenerationRequest) -> "DocumentGenerationResponse":
    from models.schemas import DocumentGenerationResponse
    from datetime import date

    template = TEMPLATES.get(payload.document_type, DEFAULT_TEMPLATE)

    details = payload.details or {}
    details.setdefault("date", date.today().strftime("%d/%m/%Y"))
    details.setdefault("document_type", payload.document_type)
    details.setdefault("court", "Sessions Court")
    details.setdefault("city", "New Delhi")
    details.setdefault("state", "Delhi")
    details.setdefault("year", str(date.today().year))
    details.setdefault("place", "New Delhi")
    details.setdefault("subject", "Legal Matter")
    details.setdefault("parties", "As per records")

    for key, val in details.items():
        details[key] = str(val)

    try:
        document_text = template
        for key, value in details.items():
            document_text = document_text.replace("{" + key + "}", value)

        import re
        document_text = re.sub(r'\{[^}]+\}', '[To be filled]', document_text)
    except Exception:
        document_text = DEFAULT_TEMPLATE.format(**{k: str(v) for k, v in details.items()})

    title = f"{payload.document_type} — {details.get('subject', 'Legal Document')}"
    word_count = len(document_text.split())

    return DocumentGenerationResponse(
        document=document_text.strip(),
        document_type=payload.document_type,
        title=title,
        word_count=word_count,
    )
