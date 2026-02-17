import json
import os
from groq import Groq
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ---------------- GROQ CALL ----------------
def _call_groq_llm(prompt: str) -> str:
    """Calls Groq LLM for legal reasoning"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You output ONLY valid JSON. No markdown. No explanation."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        response_format={"type": "json_object"}
    )

    return completion.choices[0].message.content


# ---------------- PROMPT BUILDER ----------------
def build_legal_prompt(query: str, contexts: list[dict]) -> str:
    """Creates grounded legal classification prompt"""

    context_block = "\n\n".join(
        f"[Document: {ctx['source']} | Similarity: {ctx['score']:.3f}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are NyayVidhi — Indian Legal Reasoning Engine.

You must ANALYZE the user question and CLASSIFY the legal offence
using the provided IPC legal context.

Follow this reasoning pipeline STRICTLY:

STEP 1: Identify the action in the user's question
Examples:
- taking property → theft
- hitting person → assault
- false document → forgery
- deception for money → cheating

STEP 2: From the LEGAL CONTEXT find matching IPC section
You MUST quote section numbers that explicitly match the action.

STEP 3: If no clear match → confidence LOW and empty sections

You are NOT summarizing.
You are performing legal classification.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Output STRICT JSON:

{{
 "summary": "Short description of offence",
 "legal_reasoning": "Why IPC section applies",
 "sections": ["IPC XXX"],
 "citations": [],
 "confidence": "low | medium | high",
 "disclaimer": "This is not legal advice"
}}
"""


# ---------------- SAFE JSON PARSER ----------------
def _safe_json_parse(text: str) -> dict:
    """Repairs and parses JSON from LLM"""
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
def generate_legal_response(query: str, contexts: list[dict]) -> dict:
    """Generate structured legal explanation"""

    prompt = build_legal_prompt(query, contexts)

    print("\n===== PROMPT SENT TO LLM =====\n")
    print(prompt[:1500])  # trimmed for logs
    print("\n===============================\n")

    response_str = _call_groq_llm(prompt)

    data = _safe_json_parse(response_str)
    data["disclaimer"] = "This is not legal advice"

    return data
