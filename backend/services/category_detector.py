"""
Legal Category Detection Service
Detects the legal category from user query using keyword-based rules and LLM fallback.
"""

import os
import re
from groq import Groq

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Legal categories with keyword patterns
LEGAL_CATEGORIES = {
    "Criminal Law": [
        r"\b(murder|theft|robbery|assault|rape|kidnap|abduction|cheating|fraud|bribe|corruption)\b",
        r"\b(criminal|crime|fir|police|arrest|bail|custody|section 302|section 420|ipc|bnss)\b",
        r"\b(harassment|stalking|molestation|dowry|domestic violence)\b"
    ],
    "Family Law": [
        r"\b(divorce|marriage|separation|alimony|maintenance|husband|wife|spouse)\b",
        r"\b(matrimonial|family dispute|marital|dowry|streedhan)\b",
        r"\b(hindu marriage act|special marriage act|divorce petition)\b"
    ],
    "Child Custody": [
        r"\b(child custody|custody|children|kids|guardianship|visitation rights)\b",
        r"\b(parental rights|minor|adoption|juvenile)\b"
    ],
    "Domestic Violence": [
        r"\b(domestic violence|domestic abuse|protection order|pwdva|498a)\b",
        r"\b(wife beating|marital cruelty|harassment at home)\b"
    ],
    "Property Law": [
        r"\b(property|land|real estate|registry|mutation|property dispute|partition)\b",
        r"\b(ancestral property|inheritance|will|succession|title deed|sale deed)\b",
        r"\b(builder|flat|apartment|eviction|tenancy|rent|landlord|tenant)\b"
    ],
    "Cyber Law": [
        r"\b(cyber|online|internet|hacking|digital|phishing|data breach|cyber crime)\b",
        r"\b(social media|facebook|instagram|whatsapp|defamation online|morphed)\b",
        r"\b(it act|section 66|section 67|upi fraud|online fraud)\b"
    ],
    "Corporate Law": [
        r"\b(company|corporate|business|partnership|llp|pvt ltd|startup)\b",
        r"\b(shares|shareholders|directors|board meeting|moa|aoa|companies act)\b",
        r"\b(gst|income tax|compliance|roc|mca)\b"
    ],
    "Consumer Law": [
        r"\b(consumer|defective product|service deficiency|refund|warranty|guarantee)\b",
        r"\b(consumer forum|consumer court|consumer complaint|consumer protection act)\b",
        r"\b(online shopping|ecommerce|flipkart|amazon|defective goods)\b"
    ],
    "Labour Law": [
        r"\b(labour|employee|employer|termination|retrenchment|dismissal|pf|esi)\b",
        r"\b(salary|wages|unpaid salary|gratuity|resignation|notice period)\b",
        r"\b(industrial dispute|labor law|employment contract|wrongful termination)\b"
    ],
    "NI Act": [
        r"\b(cheque|cheque bounce|dishonor|negotiable instruments act|section 138)\b",
        r"\b(promissory note|bill of exchange|dishonoured cheque|ni act)\b"
    ]
}

# Urgency keywords
HIGH_URGENCY_KEYWORDS = [
    "urgent", "immediately", "today", "now", "emergency", "arrest", "police", 
    "fir", "bail", "custody", "domestic violence", "harassment", "threat"
]

MEDIUM_URGENCY_KEYWORDS = [
    "divorce", "cheque bounce", "property dispute", "termination", "eviction"
]


def detect_category_by_keywords(query: str) -> tuple:
    """
    Detect legal category using keyword-based pattern matching.
    
    Args:
        query: User's legal question
        
    Returns:
        tuple: (category_name, confidence_score)
    """
    query_lower = query.lower()
    
    matches = {}
    
    for category, patterns in LEGAL_CATEGORIES.items():
        score = 0
        for pattern in patterns:
            if re.search(pattern, query_lower, re.IGNORECASE):
                score += 1
        
        if score > 0:
            matches[category] = score
    
    if matches:
        # Return category with highest score
        best_category = max(matches, key=matches.get)
        confidence = min(matches[best_category] / 3, 1.0)  # Normalize to 0-1
        return best_category, confidence
    
    return None, 0.0


def detect_urgency(query: str) -> str:
    """
    Detect urgency level of the query.
    
    Args:
        query: User's legal question
        
    Returns:
        str: "High", "Medium", or "Low"
    """
    query_lower = query.lower()
    
    for keyword in HIGH_URGENCY_KEYWORDS:
        if keyword in query_lower:
            return "High"
    
    for keyword in MEDIUM_URGENCY_KEYWORDS:
        if keyword in query_lower:
            return "Medium"
    
    return "Low"


def detect_category_by_llm(query: str) -> tuple:
    """
    Fallback: Use LLM to detect category when keyword matching fails.
    
    Args:
        query: User's legal question
        
    Returns:
        tuple: (category_name, urgency)
    """
    categories_list = list(LEGAL_CATEGORIES.keys())
    
    prompt = f"""You are a legal category classifier for Indian law.

Available categories:
{', '.join(categories_list)}

User Query: "{query}"

Classify this query into ONE of the above categories. Consider Indian legal context.

Return ONLY the category name from the list above. If none match perfectly, return "General Legal Query".

Category:"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=50
        )
        
        category = response.choices[0].message.content.strip()
        
        # Validate category
        if category in categories_list:
            return category, 0.7  # LLM confidence
        else:
            return "General Legal Query", 0.5
            
    except Exception as e:
        print(f"LLM classification error: {e}")
        return "General Legal Query", 0.3


def detect_category(query: str) -> dict:
    """
    Main function to detect legal category and urgency.
    
    Args:
        query: User's legal question
        
    Returns:
        dict: {
            "category": str,
            "urgency": str,
            "confidence": float
        }
    """
    # Try keyword-based detection first
    category, confidence = detect_category_by_keywords(query)
    
    # If confidence is low or no match, use LLM
    if not category or confidence < 0.4:
        print("Using LLM for category detection...")
        category, confidence = detect_category_by_llm(query)
    
    # Detect urgency
    urgency = detect_urgency(query)
    
    return {
        "category": category,
        "urgency": urgency,
        "confidence": round(confidence, 2)
    }


# Test function
if __name__ == "__main__":
    test_queries = [
        "My husband is asking for divorce without reason",
        "Someone hacked my Instagram account",
        "Builder not giving possession of flat",
        "Boss terminated me without notice period",
        "Cheque bounced what to do"
    ]
    
    for query in test_queries:
        result = detect_category(query)
        print(f"\nQuery: {query}")
        print(f"Result: {result}")
