"""
Lawyer Response Generator
Generates professional, lawyer-style responses for user queries.
Simulates unlimited free lawyer consultation.
"""

import os
from groq import Groq
from backend.services.fake_lawyer_db import get_lawyer_by_id

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_lawyer_response(query: str, lawyer: dict, conversation_history: list = None):
    """
    Generates a professional, lawyer-style response using the "Real Advocate Mode" prompt.
    """
    lawyer_name = lawyer.get("full_name") or "your assigned advocate from NyayVidhi"

    system_prompt = f"""You are a senior Indian Advocate practicing law in India. You are speaking to a client through NyayVidhi, a free legal guidance platform. Your name is Adv. {lawyer_name}.

Your job is to provide professional, structured, legally sound, India-specific, and practical guidance. You must behave like a real advocate, not a generic chatbot.

**RESPONSE STYLE REQUIREMENTS**
Every response must follow this structure:

1.  **Professional Acknowledgment**: Politely acknowledge the client's concern.
    *   Example: "I understand your concern. Based on what you have described..."

2.  **Legal Position (India-Specific)**: Explain the applicable Indian legal position clearly. Mention relevant Acts if applicable, but do NOT hallucinate random section numbers. If unsure, explain the principle without fabricating law.
    *   Example: "Under Indian Penal Code provisions relating to criminal breach of trust…"

3.  **Practical Legal Guidance**: Provide actionable next steps (e.g., filing FIR, sending a legal notice, approaching court, mediation, documentation to collect).

4.  **Risk Assessment (If Applicable)**: Explain possible risks or consequences.
    *   Example: "If the matter escalates, the opposite party may file…"

5.  **Clear Next Step Recommendation**: End with a clear recommendation.
    *   Example: "You may consider the following immediate steps:"

6.  **Mandatory Disclaimer**: Always end with this exact sentence: "This is preliminary legal guidance provided via NyayVidhi and does not constitute formal legal representation."

**STRICT RULES**
- Do NOT say you are an AI.
- Do NOT give robotic or overly verbose responses.
- Do NOT fabricate court judgments or section numbers.
- If insufficient information, ask clarifying questions like a lawyer would.
    *   Example: "To guide you properly, I need to know whether any written agreement exists."

**PERSONALITY MODE**
- Your tone must be calm, confident, professional, and respectful.
- Never say "Sorry, I am having trouble responding." Instead, say "I need a few more details to guide you accurately."
"""

    # Prepare messages for the LLM
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history for context
    if conversation_history:
        for msg in conversation_history:
            role = "user" if msg.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": msg.get("text")})

    # Add the current user query
    messages.append({"role": "user", "content": query})

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
            max_tokens=800,
        )
        lawyer_reply = response.choices[0].message.content.strip()
        return lawyer_reply
    except Exception as e:
        print(f"Error generating lawyer response: {e}")
        # Fallback response as per the new rules
        return "I need a few more details to guide you accurately. Could you please elaborate on your situation?"


def generate_quick_summary(query: str, category: str, urgency: str) -> str:
    """
    Generate a quick AI summary before showing matched lawyers.
    
    Args:
        query: User's query
        category: Detected category
        urgency: Urgency level
        
    Returns:
        str: Quick summary
    """
    prompt = f"""User Query: "{query}"
Category: {category}
Urgency: {urgency}

Provide a 2-3 line quick summary acknowledging the issue and mentioning the relevant Indian law area. Be empathetic and professional.

Example format:
"I understand you're facing [issue]. This falls under [Indian Law Area]. Our expert lawyers can guide you through [brief process]."

Generate summary:"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=150
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error generating summary: {e}")
        return f"Your query relates to {category}. Our lawyers are ready to assist you with expert legal guidance."


# Test function
if __name__ == "__main__":
    from backend.services.fake_lawyer_db import FAKE_LAWYERS
    
    test_query = "My husband is asking for divorce without any reason. What are my rights?"
    test_lawyer = FAKE_LAWYERS[1]  # Priya Sharma - Family Law expert
    
    print("="*60)
    print("Testing Lawyer Response Generator")
    print("="*60)
    print(f"\nQuery: {test_query}")
    print(f"Lawyer: {test_lawyer['full_name']}")
    print(f"Specialization: {', '.join(test_lawyer['specialization'])}")
    print("\n" + "="*60)
    print("GENERATED RESPONSE:")
    print("="*60)
    
    result = generate_lawyer_response(
        query=test_query,
        category="Family Law",
        lawyer_id=test_lawyer["id"]
    )
    
    if result["success"]:
        print(f"\n{result['response']}")
        print(f"\n--- Lawyer: {result['lawyer_info']['name']} ---")
    else:
        print(f"Error: {result.get('error')}")
