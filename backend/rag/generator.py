import json
import os
from groq import Groq, RateLimitError
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# cheaper + stable model
GENERATOR_MODEL = "llama-3.1-8b-instant"

# ---------------- GROQ CALL ----------------
def _call_groq_llm(prompt: str) -> str:
    """Calls Groq LLM safely (never crashes server)"""

    try:
        completion = client.chat.completions.create(
            model=GENERATOR_MODEL,
            messages=[
                {"role": "system", "content": "You output ONLY valid JSON. No markdown. No explanation."},
                {"role": "user", "content": prompt[:6000]}  # hard token protection
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        return completion.choices[0].message.content

    except RateLimitError:
        return '{"error":"RATE_LIMIT"}'

    except Exception as e:
        print("LLM ERROR:", e)
        return '{"error":"LLM_FAILURE"}'


# ---------------- CONTEXT LIMITER ----------------
def _compress_context(contexts: list[dict], max_chars: int = 1200) -> list[dict]:
    """Reduce tokens so Groq doesn't die"""
    trimmed = []
    total = 0

    for ctx in contexts[:2]:  # top_k = 2 only
        text = ctx["text"][:max_chars]
        total += len(text)

        trimmed.append({
            "source": ctx["source"],
            "score": ctx["score"],
            "text": text
        })

        if total > max_chars:
            break

    return trimmed


# ---------------- PROMPT BUILDERS ----------------
def build_offence_prompt(query: str, contexts: list[dict]) -> str:
    context_block = "\n\n".join(
        f"[Legal Reference]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are a senior Indian criminal lawyer.

Give answers in a clean, structured, and highly readable format.

STRICT FORMAT RULES:
1. Maximum 8-12 lines total
2. No long paragraphs
3. Use short bullet points
4. Be precise and legally accurate
5. Mention correct legal sections
6. Mention punishment clearly
7. Provide clear action steps
8. Do NOT add disclaimers
9. Do NOT write unnecessary explanations

USE THIS EXACT FORMAT:

⚖️ Offence:
(Write exact applicable offence)

📘 Applicable Law:
- Section ___ IPC
- Section ___ POCSO (if minor involved)
- Section ___ BNS (if applicable)

🔍 Why it applies:
(1-2 short lines only)

⛔ Punishment:
(Clearly mention imprisonment + fine)

🚨 What should be done immediately:
- Step 1
- Step 2
- Step 3

CLIENT QUESTION:
{query}

LEGAL REFERENCES:
{context_block}

Return ONLY VALID JSON:
{{
 "summary": "Your response in the EXACT format above",
 "legal_reasoning": "",
 "sections": ["Section XXX IPC", "Section YYY POCSO"],
 "citations": [],
 "confidence": "high"
}}

Put the ENTIRE formatted response in 'summary'. Leave 'legal_reasoning' empty.
"""


def build_punishment_prompt(query: str, contexts: list[dict]) -> str:
    context_block = "\n\n".join(
        f"[Legal Reference]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are a senior Indian criminal lawyer.

Answer punishment queries in clean, structured, TEXT format with emojis.

USE THIS EXACT TEXT FORMAT (NOT nested JSON):

📘 Offence:
(Name of offence)

⛔ Punishment:
- Imprisonment: ___ years (minimum to maximum)
- Fine: Rs. ___
- Bailable/Non-bailable: ___
- Cognizable/Non-cognizable: ___

⚖️ Additional Info:
- Special provisions (if any)
- Repeat offender consequences (if applicable)

🚨 Bail Considerations:
(1-2 short lines)

Keep it under 10 lines. No disclaimers. No long explanations.
Output as plain TEXT with emojis, NOT as nested dictionary.

CLIENT QUESTION:
{query}

LEGAL REFERENCES:
{context_block}

Return ONLY VALID JSON with formatted text in summary:
{{
 "summary": "Your response formatted as TEXT with emojis (not nested objects)",
 "legal_reasoning": "",
 "sections": ["Section XXX IPC"],
 "citations": [],
 "confidence": "high"
}}
"""


def build_explanation_prompt(query: str, contexts: list[dict]) -> str:
    context_block = "\n\n".join(
        f"[Legal Reference]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are a senior Indian criminal lawyer.

Explain legal concepts in clean, structured format with emojis.

MANDATORY: Use EXACTLY this format with emojis and structure:

📖 Legal Concept:
(Name in 2-3 words)

📘 Applicable Law:
- Section ___ (Act name)
- Section ___ (if multiple)

✅ Definition:
(2-3 short sentences explaining what it means)

⚖️ Key Requirements/Points:
- Requirement 1
- Requirement 2
- Requirement 3

⛔ Consequences/Punishment (if crime):
(Brief mention, or write "N/A - Civil matter")

🔍 Practical Note:
(1-2 lines about how this works in practice)

STRICT RULES:
- Use the EXACT emoji format shown above
- Keep total response under 12 lines
- No long paragraphs
- No disclaimers
- Be precise and clear

CLIENT QUESTION:
{query}

LEGAL REFERENCES:
{context_block}

Return ONLY VALID JSON:
{{
 "summary": "Your response in the EXACT emoji format above",
 "legal_reasoning": "",
 "sections": ["Section XXX Act"],
 "citations": [],
 "confidence": "high"
}}

Put the ENTIRE formatted response with emojis in 'summary'. Leave 'legal_reasoning' EMPTY.
"""


# ---------------- SAFE JSON PARSER ----------------
def _safe_json_parse(text: str) -> dict:
    if "RATE_LIMIT" in text:
        return {
            "summary": "Service temporarily busy",
            "legal_reasoning": "The legal AI is currently handling many requests. Please try again shortly.",
            "sections": [],
            "citations": [],
            "confidence": "low",
            "disclaimer": "This is not legal advice"
        }

    if "LLM_FAILURE" in text:
        return {
            "summary": "AI processing error",
            "legal_reasoning": "The AI could not process the request right now.",
            "sections": [],
            "citations": [],
            "confidence": "low",
            "disclaimer": "This is not legal advice"
        }

    try:
        return json.loads(text)
    except:
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            return json.loads(text[start:end])
        except:
            return {
                "summary": "Unable to generate legal explanation",
                "legal_reasoning": "",
                "sections": [],
                "citations": [],
                "confidence": "low",
                "disclaimer": "This is not legal advice"
            }


# ---------------- MAIN FUNCTION ----------------
def generate_legal_response(query: str, contexts: list[dict], intent: str = "offence_description") -> dict:

    contexts = _compress_context(contexts)

    if intent == "punishment_query":
        prompt = build_punishment_prompt(query, contexts)
    elif intent == "legal_information":
        prompt = build_explanation_prompt(query, contexts)
    else:
        prompt = build_offence_prompt(query, contexts)

    print(f"\n===== INTENT: {intent} =====")

    response_str = _call_groq_llm(prompt)
    data = _safe_json_parse(response_str)

    # Fix: If LLM put answer in legal_reasoning instead of summary, swap them
    if data.get("legal_reasoning") and (not data.get("summary") or data.get("summary") == query or len(data.get("summary", "")) < 50):
        # If summary is empty, same as query, or too short, use legal_reasoning
        if data.get("legal_reasoning"):
            data["summary"] = data["legal_reasoning"]
            data["legal_reasoning"] = ""

    # Add source PDF citations from retrieved contexts
    source_citations = []
    for ctx in contexts:
        citation = f"Document: {ctx['source']} | Similarity: {ctx['score']:.3f}"
        if citation not in source_citations:
            source_citations.append(citation)
    
    # Merge with any LLM-generated citations
    if "citations" in data and data["citations"]:
        data["citations"] = source_citations + data["citations"]
    else:
        data["citations"] = source_citations

    data["disclaimer"] = "This analysis is provided for informational purposes only and does not constitute legal advice."
    return data
