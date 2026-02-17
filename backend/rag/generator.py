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
        f"[Document: {ctx['source']} | Similarity: {ctx['score']:.3f}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are NyayVidhi — Indian Legal Reasoning Engine.

Classify the offence from the IPC.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Return STRICT JSON:
{{
 "summary": "Offence name",
 "legal_reasoning": "Why IPC applies",
 "sections": ["IPC XXX"],
 "citations": [],
 "confidence": "low | medium | high",
 "disclaimer": "This is not legal advice"
}}
"""


def build_punishment_prompt(query: str, contexts: list[dict]) -> str:
    context_block = "\n\n".join(
        f"[Document: {ctx['source']}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
Extract ONLY punishment from IPC law.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Return STRICT JSON:
{{
 "summary": "Punishment for offence",
 "legal_reasoning": "Punishment details",
 "sections": ["IPC XXX"],
 "citations": [],
 "confidence": "high",
 "disclaimer": "This is not legal advice"
}}
"""


def build_explanation_prompt(query: str, contexts: list[dict]) -> str:
    context_block = "\n\n".join(
        f"[Document: {ctx['source']}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
Explain the law in simple terms.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Return STRICT JSON:
{{
 "summary": "Concept explanation",
 "legal_reasoning": "Simple explanation",
 "sections": ["IPC XXX"],
 "citations": [],
 "confidence": "high",
 "disclaimer": "This is not legal advice"
}}
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

    data["disclaimer"] = "This is not legal advice"
    return data
