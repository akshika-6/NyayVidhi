import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.1-8b-instant"

import json

def build_strategy_prompt(data: dict) -> str:
    return f"""
📌 SYSTEM ROLE

You are a senior litigation strategist advising Indian MSMEs.

You must generate a structured legal strategy report.

You MUST return valid JSON only.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return extra text outside JSON.

📌 OUTPUT FORMAT (STRICT JSON)

Return the response strictly in this format:

{{
  "situation_overview": "string",
  "legal_position": "string",
  "strategic_options": {{
    "pre_litigation": "string",
    "litigation": "string",
    "settlement": "string"
  }},
  "risk_assessment": {{
    "legal_risk": "Low/Medium/High",
    "financial_risk": "Low/Medium/High",
    "reputational_risk": "Low/Medium/High",
    "counterclaim_risk": "Low/Medium/High",
    "analysis_notes": "string"
  }},
  "documentation_checklist": [
    "item 1",
    "item 2",
    "item 3"
  ],
  "recommended_next_steps": [
    "step 1",
    "step 2",
    "step 3"
  ]
}}

📌 STRICT RULES

Every field must contain meaningful content.

No empty strings.

Minimum 150 words for:

legal_position

each strategic option

If information is limited, still provide a reasoned analysis.

Do not omit any section.

Output must be valid JSON (parsable).

📌 INPUT DATA

Business Type: {data.get('businessType')}
Dispute Type: {data.get('disputeType')}
Contract Exists: {data.get('contractExists')}
Amount: {data.get('amountInvolved')}
Opponent: {data.get('opponentType')}
Jurisdiction: {data.get('jurisdiction')}
Description: {data.get('description')}

📌 DEPTH REQUIREMENT

This is a professional strategy document.
The content must be detailed, analytical, and India-specific.

Return only JSON.
"""

def generate_case_strategy(data: dict):
    prompt = build_strategy_prompt(data)
    
    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3, # Lower temperature for strictly structured output
            max_tokens=2500,
            top_p=0.9,
            response_format={"type": "json_object"}
        )
        strategy_content = completion.choices[0].message.content
        
        # Ensure it's valid JSON
        try:
            strategy_json = json.loads(strategy_content)
            return {"strategy": strategy_json}
        except json.JSONDecodeError:
            print("Failed to parse JSON response")
            return {"strategy": {"raw": strategy_content}}
            
    except Exception as e:
        print(f"Error generating strategy: {e}")
        return {"strategy": {"error": str(e)}}
