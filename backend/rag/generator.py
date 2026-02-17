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


# ---------------- MAIN GENERATOR ----------------
def generate_legal_response(query: str, contexts: list[dict], intent: str = "general") -> dict:
    """
    Generates a structured legal response using the RAG pattern.
    This version uses the new single, high-quality prompt structure.
    """
    print("Generator: Compressing context...")
    compressed_contexts = _compress_context(contexts)

    print("Generator: Building the new structured prompt...")
    prompt = build_structured_legal_prompt(query, compressed_contexts)

    print("Generator: Calling LLM for structured response...")
    llm_output_str = _call_groq_llm(prompt)

    if "RATE_LIMIT" in llm_output_str:
        response = "We are currently experiencing high traffic. Please try again in a few moments."
    elif "LLM_FAILURE" in llm_output_str or not llm_output_str:
        response = "I am currently unable to process this request. Please try rephrasing your question."
    else:
        response = llm_output_str

    # The new structure is a single text block, so we return it in the 'summary' field.
    return {
        "summary": response,
        "legal_reasoning": "",
        "sections": [],
        "citations": [],
        "confidence": "high" if compressed_contexts else "low",
        "disclaimer": "This is general legal information under Indian law and not a substitute for formal legal advice."
    }
