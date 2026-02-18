"""
Judgment Comparison Service
Analyzes and compares relevant legal judgments for a query
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def find_relevant_judgments(query: str, legal_context: str) -> dict:
    """
    Find and compare relevant judgments for the legal query
    """
    
    prompt = f"""You are an Indian legal expert. Analyze this query and provide 2 relevant Supreme Court judgments.

Query: {query}
Context: {legal_context[:800]}

Return ONLY this JSON structure (no markdown, no extra text):
{{
  "judgments": [
    {{"case_name": "Name", "citation": "Citation", "court": "Supreme Court of India", "year": "2020", "relevance": "Why relevant"}},
    {{"case_name": "Name", "citation": "Citation", "court": "Supreme Court of India", "year": "2019", "relevance": "Why relevant"}}
  ],
  "comparison": {{
    "differences": ["Difference 1", "Difference 2"],
    "common_principles": ["Principle 1", "Principle 2"],
    "practical_impact": "Impact explanation"
  }},
  "recommendation": "Most applicable judgment and why"
}}

Include ONLY real, verified Indian Supreme Court judgments."""

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert Indian legal researcher. Return ONLY valid JSON, no markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1200,
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Clean markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        # Remove any leading/trailing whitespace and newlines
        response_text = response_text.strip()
        
        # Try to parse JSON
        data = json.loads(response_text)
        
        # Validate structure
        if not isinstance(data.get("judgments"), list) or len(data["judgments"]) == 0:
            raise ValueError("Invalid judgments structure")
        
        return {
            "success": True,
            "data": data
        }
        
    except json.JSONDecodeError as e:
        print(f"Judgment JSON parse error: {e}")
        print(f"Response text: {response_text[:500]}")
        return {
            "success": False,
            "data": None
        }
    except Exception as e:
        print(f"Judgment analysis error: {e}")
        return {
            "success": False,
            "data": None
        }


def format_judgment_response(judgment_data: dict) -> str:
    """
    Format judgment data for display
    """
    if not judgment_data.get("success") or not judgment_data.get("data", {}).get("judgments"):
        return ""
    
    data = judgment_data["data"]
    judgments = data.get("judgments", [])
    comparison = data.get("comparison", {})
    
    formatted = "\n\n### 📚 Relevant Judgments & Case Law\n\n"
    
    for idx, judgment in enumerate(judgments, 1):
        formatted += f"**{idx}. {judgment.get('case_name', 'N/A')}**\n"
        formatted += f"- Citation: {judgment.get('citation', 'N/A')}\n"
        formatted += f"- Court: {judgment.get('court', 'N/A')} ({judgment.get('year', 'N/A')})\n"
        formatted += f"- Relevance: {judgment.get('relevance', 'N/A')}\n\n"
    
    if comparison.get("common_principles"):
        formatted += "**Common Legal Principles:**\n"
        for principle in comparison["common_principles"]:
            formatted += f"- {principle}\n"
        formatted += "\n"
    
    if comparison.get("practical_impact"):
        formatted += f"**Impact on Your Case:** {comparison['practical_impact']}\n\n"
    
    if data.get("recommendation"):
        formatted += f"**Expert Recommendation:** {data['recommendation']}\n"
    
    return formatted
