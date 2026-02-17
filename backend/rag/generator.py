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
    """Calls Groq LLM safely for a structured text response."""
    try:
        completion = client.chat.completions.create(
            model=GENERATOR_MODEL,
            messages=[
                {"role": "system", "content": "You are a specialized Indian Legal AI. You MUST output ONLY valid JSON. If a specific language is requested in the prompt, you MUST write all descriptive values in that language accurately."},
                {"role": "user", "content": prompt[:10000]}  # Increased token limit
            ],
            temperature=0.4,
            max_tokens=1200,
            top_p=0.9,
            frequency_penalty=0.2,
            presence_penalty=0.1,
        )
        return completion.choices[0].message.content
    except RateLimitError:
        return '{"error":"RATE_LIMIT"}'
    except Exception as e:
        print("LLM ERROR:", e)
        return '{"error":"LLM_FAILURE"}'


# ---------------- CONTEXT LIMITER ----------------
def _compress_context(contexts: list[dict], max_chars: int = 6000) -> list[dict]:
    """Reduce tokens so Groq doesn't die"""
    trimmed = []
    total = 0
    for ctx in contexts[:4]:  # top_k = 4
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


# ---------------- PROMPT BUILDER (FINAL) ----------------
def build_structured_legal_prompt(query: str, contexts: list[dict]) -> str:
    """
    Builds the final, high-quality legal prompt based on the "NON-NEGOTIABLE" structure.
    """
    context_block = "\n\n".join(
        f"**Legal Context from {ctx['source']}**:\n{ctx['text']}"
        for ctx in contexts
    )

    return f"""
You are NyayVidhi Legal Assistant, a senior advocate trained in Indian law. Your response should reflect the analytical depth of a senior advocate preparing a legal advisory note.

**User's Query**: "{query}"

**Relevant Legal Information**:
{context_block}

---
**MANDATORY RESPONSE STRUCTURE (NON-NEGOTIABLE)**:
You must generate a response that follows this exact markdown structure. Do NOT deviate. Use `###` for headings.

### Understanding Your Situation
(Briefly restate the user's issue in professional language.)

### Legal Framework Under Indian Law
(Explain the relevant Act, legal grounds, and important principles from the context. Only cite sections if you are confident. Do NOT hallucinate. Explain in clear language.)

### Your Legal Rights
(Clearly explain the user's rights, including available defenses, burden of proof if relevant, and entitlements like maintenance, protection, or compensation.)

### Step-by-Step Course of Action
(Provide a numbered list of concrete, actionable steps. Include immediate actions, documentation to collect, legal notices, and the appropriate authority/court to approach.)

### Strategic Considerations
(Discuss potential risks, counter-arguments from the opposite party, the pros and cons of settlement vs. litigation, and potential cost/time impacts.)

### Professional Closing
(End with a concluding paragraph. Finally, add this exact sentence on a new line: "This guidance is based on general principles of Indian law and is intended for informational purposes only.")

---
**STRICT PROHIBITIONS & DEPTH ENFORCEMENT**:
- Before sending the response, internally check: Is it under 350 words? If yes, expand it with more detail in the 'Strategic Considerations' and 'Practical Steps' sections.
- The final response must be comprehensive and well-structured.
- Do NOT give 2-3 line generic answers.
- Do NOT promote the platform or say "Our expert lawyers can help."
- Do NOT fabricate judgments, cases, or section numbers.
- Avoid emojis and unnecessary legal jargon.

Generate the detailed and structured response now.
"""


def build_punishment_prompt(query: str, contexts: list[dict]) -> str:
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
 "sections": ["Section XXX IPC"],
 "citations": [],
 "confidence": "high"
}}

Put the ENTIRE formatted response in 'summary'. Leave 'legal_reasoning' empty.
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
        if text.strip().startswith("```json"):
            text = text.split("```json")[1].split("```")[0].strip()
        elif text.strip().startswith("```"):
            text = text.split("```")[1].split("```")[0].strip()
        
        return json.loads(text)
    except:
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
            raise ValueError("No JSON found")
        except:
            # Fallback: If text is substantial and looks like content, return it as summary
            if len(text) > 50 and not "error" in text.lower():
                return {
                    "summary": text,
                    "legal_reasoning": "",
                    "sections": [],
                    "citations": [],
                    "confidence": "medium",
                    "disclaimer": "This analysis is provided for informational purposes only."
                }
            
            return {
                "summary": "Unable to generate legal explanation",
                "legal_reasoning": "",
                "sections": [],
                "citations": [],
                "confidence": "low",
                "disclaimer": "This is not legal advice"
            }


# ---------------- MAIN FUNCTION ----------------
def generate_legal_response(query: str, contexts: list[dict], intent: str = "offence_description", language: str = "English") -> dict:

    contexts = _compress_context(contexts)

    if intent == "punishment_query":
        prompt = build_punishment_prompt(query, contexts)
    elif intent == "legal_information":
        prompt = build_explanation_prompt(query, contexts)
    else:
        prompt = build_structured_legal_prompt(query, contexts)

    # 🌍 Multilingual Instruction
    if language != "English":
        prompt += f"\n\nIMPORTANT: Generate the ENTIRE 'summary' content (including headers like 'Offence', 'Applicable Law', 'Punishment' etc.) accurately in {language} language instead of English."

    print(f"\n===== INTENT: {intent} | LANGUAGE: {language} =====")

    response_str = _call_groq_llm(prompt)
    data = _safe_json_parse(response_str)

    # Fix: If LLM put answer in legal_reasoning instead of summary, swap them
    if data.get("legal_reasoning") and (not data.get("summary") or data.get("summary") == query or len(data.get("summary", "")) < 50):
        # If summary is empty, same as query, or too short, use legal_reasoning
        if data.get("legal_reasoning"):
            data["summary"] = data["legal_reasoning"]
            data["legal_reasoning"] = ""

    # Ensure summary is always a string (handle edge cases where LLM returns object/null)
    if "summary" in data:
        if not isinstance(data["summary"], str):
            # If summary is a dict/object, convert it to a formatted string
            if isinstance(data["summary"], dict):
                # Convert dict to readable string format
                formatted_parts = []
                for key, value in data["summary"].items():
                    formatted_parts.append(f"{key}: {value}")
                data["summary"] = "\n\n".join(formatted_parts)
            else:
                data["summary"] = str(data["summary"]) if data["summary"] else "Unable to generate response"
    else:
        data["summary"] = "Unable to generate response"

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
