import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_intent(question: str) -> str:
    """
    Classifies the user's legal question into one of three categories:
    - offence_description: determining what crime was committed
    - punishment_query: determining the penalty for a specific crime
    - legal_information: general explanation of legal concepts or sections
    """
    
    prompt = f"""
    You are a precise intent classifier for a legal AI.
    Classify the following user question into EXACTLY ONE of these categories:
    
    1. "offence_description" -> if the user describes a situation/action and asks "is this a crime?" or "what offence is this?"
    2. "punishment_query" -> if the user asks about jail time, fine, or penalty for a specific crime (e.g., "punishment for theft").
    3. "legal_information" -> if the user simply asks "what is Section 420" or "explain eager robbery".
    
    USER QUESTION: "{question}"
    
    Output JSON ONLY:
    {{ "intent": "..." }}
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
        intent = data.get("intent", "legal_information")
        
        # Fallback if LLM hallucinates a different string
        valid_intents = {"offence_description", "punishment_query", "legal_information"}
        if intent not in valid_intents:
            return "legal_information"
            
        return intent

    except Exception as e:
        print(f"Intent Classification Error: {e}")
        return "offence_description" # Default safe fallback
