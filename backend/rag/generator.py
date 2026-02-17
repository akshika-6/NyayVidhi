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
# ---------------- PROMPT BUILDERS ----------------

def build_offence_prompt(query: str, contexts: list[dict]) -> str:
    """Prompt for classifying an offence (Standard Flow)"""
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

def build_punishment_prompt(query: str, contexts: list[dict]) -> str:
    """Prompt for extracting punishment details"""
    context_block = "\n\n".join(
        f"[Document: {ctx['source']}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are NyayVidhi.
The user is asking about the PUNISHMENT for a specific offence.

Using the provided LEGAL CONTEXT, extract the exact punishment (imprisonment term, fine, or both).

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Output STRICT JSON:
{{
 "summary": "Punishment for [Offence Name]",
 "legal_reasoning": "The prescribed punishment is [Details from context].",
 "sections": ["Relevant IPC Section"],
 "citations": [],
 "confidence": "high",
 "disclaimer": "This is not legal advice"
}}
"""

def build_explanation_prompt(query: str, contexts: list[dict]) -> str:
    """Prompt for explaining a legal concept"""
    context_block = "\n\n".join(
        f"[Document: {ctx['source']}]\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are NyayVidhi.
The user is asking for an EXPLANATION of a legal concept or section.

Using the provided LEGAL CONTEXT, explain the concept simply and clearly.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context_block}

Output STRICT JSON:
{{
 "summary": "Explanation of [Concept]",
 "legal_reasoning": "[Clear explanation of the concept based on context]",
 "sections": ["Relevant IPC Section"],
 "citations": [],
 "confidence": "high",
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
def generate_legal_response(query: str, contexts: list[dict], intent: str = "offence_description") -> dict:
    """Generate structured legal explanation based on intent"""

    if intent == "punishment_query":
        prompt = build_punishment_prompt(query, contexts)
    elif intent == "legal_information":
        prompt = build_explanation_prompt(query, contexts)
    else:
        # Default fallback
        prompt = build_offence_prompt(query, contexts)

    print(f"\n===== PROMPT SENT TO LLM (Intent: {intent}) =====\n")
    print(prompt[:1500])  # trimmed for logs
    print("\n===============================\n")

    response_str = _call_groq_llm(prompt)

    data = _safe_json_parse(response_str)
    data["disclaimer"] = "This is not legal advice"

    return data
