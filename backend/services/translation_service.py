import requests
import os
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

# Mapping of language names to Sarvam language codes
SARVAM_LANG_CODES = {
    "English": "en-IN",
    "Hindi": "hi-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Kannada": "kn-IN",
    "Bengali": "bn-IN",
    "Malayalam": "ml-IN",
    "Punjabi": "pa-IN"
}

def translate_text(text: str, target_language: str, source_language: str = "English") -> str:
    """
    Translates text using Sarvam AI Translate API.
    """
    if not SARVAM_API_KEY:
        print("SARVAM_API_KEY not found. Skipping translation.")
        return text

    if target_language == source_language:
        return text

    target_code = SARVAM_LANG_CODES.get(target_language)
    source_code = SARVAM_LANG_CODES.get(source_language)

    if not target_code or not source_code:
        print(f"Unsupported language: {target_language} or {source_language}")
        return text

    url = "https://api.sarvam.ai/translate"
    
    payload = {
        "input": text,
        "source_language_code": source_code,
        "target_language_code": target_code,
        "mode": "formal"
    }
    
    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("translated_text", text)
    except Exception as e:
        print(f"Sarvam Translation Error: {e}")
        return text

def translate_query_to_english(text: str, source_language: str) -> str:
    """Helper to translate user query to English for RAG processing"""
    return translate_text(text, "English", source_language)

def translate_response_from_english(text: str, target_language: str) -> str:
    """Helper to translate English response back to user's preferred language"""
    return translate_text(text, target_language, "English")
