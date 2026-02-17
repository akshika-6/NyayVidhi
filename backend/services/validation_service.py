import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def validate_legal_query(query: str) -> dict:
    """
    Validates if the user query is a valid legal question related to Indian law.
    
    Returns:
        dict: {
            "is_valid": bool,
            "error_message": str (if invalid),
            "reason": str
        }
    """
    
    # Basic checks first (fast)
    query = query.strip()
    
    # Check minimum length
    if len(query) < 5:
        return {
            "is_valid": False,
            "error_message": "Please enter a valid legal question related to Indian law.",
            "reason": "too_short"
        }
    
    # Check if it's just symbols/numbers (allowing Unicode letters for Hindi/others)
    if not any(c.isalpha() for c in query):
        return {
            "is_valid": False,
            "error_message": "Please enter a valid legal question related to Indian law.",
            "reason": "no_letters"
        }
    
    # Check for common non-questions
    non_questions = ['hello', 'hi', 'hey', 'test', 'testing', 'hii', 'helo']
    if query.lower() in non_questions:
        return {
            "is_valid": False,
            "error_message": "Please enter a valid legal question related to Indian law.",
            "reason": "greeting"
        }
    
    # Use LLM to validate if it's a legal question
    prompt = f"""
You are a legal query validator for NyayVidhi - an Indian Legal Assistant.

Analyze the following user query and determine:
1. Is it a meaningful question (not random text)?
2. Is it related to Indian law (IPC, BNS, BNSS, BSA, Constitution, Contract Act, etc.)?
3. Does it have sufficient detail to answer?

USER QUERY: "{query}"

Classification rules:
- If query is random text, gibberish, or meaningless: NOT VALID
- If query is just a greeting (hello, hi, etc.): NOT VALID
- If query is about foreign law, not Indian law: NOT INDIAN LAW
- If query is too vague or unclear: UNCLEAR
- If query is a valid Indian legal question: VALID

Return STRICT JSON:
{{
 "is_valid": true/false,
 "category": "valid_legal" | "random_text" | "not_indian_law" | "unclear" | "greeting",
 "confidence": "high" | "medium" | "low"
}}
"""
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content
        data = json.loads(response_text)
        
        category = data.get("category", "unclear")
        is_valid = data.get("is_valid", False)
        
        if not is_valid:
            if category == "random_text" or category == "greeting":
                return {
                    "is_valid": False,
                    "error_message": "Please enter a valid legal question related to Indian law.",
                    "reason": category
                }
            elif category == "not_indian_law":
                return {
                    "is_valid": False,
                    "error_message": "NyayVidhi answers only Indian legal queries. Please ask a relevant legal question.",
                    "reason": category
                }
            elif category == "unclear":
                return {
                    "is_valid": False,
                    "error_message": "Please clarify your legal question so I can assist you accurately.",
                    "reason": category
                }
        
        return {
            "is_valid": True,
            "error_message": "",
            "reason": "valid"
        }
        
    except Exception as e:
        print(f"Validation error: {e}")
        # On error, allow the query to proceed (fail open)
        return {
            "is_valid": True,
            "error_message": "",
            "reason": "validation_error"
        }
