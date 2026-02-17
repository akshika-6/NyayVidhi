from backend.rag.retriever import search_legal_context
from backend.rag.generator import generate_legal_response
from backend.services.intent_service import classify_intent
from backend.services.validation_service import validate_legal_query
from backend.services.translation_service import translate_query_to_english, translate_response_from_english
from backend.services.language_detection import detect_language


def translate_error(msg: str, lang: str) -> str:
    from backend.rag.generator import _call_groq_llm
    import json
    prompt = f"Translate this legal assistant error message into {lang}. Keep it short and professional:\n\n{msg}"
    response = _call_groq_llm(f'{{"error_translation": "{prompt}"}}')
    try:
        data = json.loads(response)
        return data.get("error_translation", msg)
    except: return msg

def ask_legal_question(query: str, preferred_language: str = "English") -> dict:
    """
    Orchestrates the RAG pipeline to answer a legal question with multilingual support.
    """
    
    # Auto-detect language from query if not explicitly set or if "English" but query is in another language
    detected_lang = detect_language(query)
    if preferred_language == "English" and detected_lang != "English":
        # User typed in a non-English language but didn't select it - use detected language
        preferred_language = detected_lang
        print(f"Service: Auto-detected language: {detected_lang} from user query")
    elif preferred_language == "English":
        # Keep English if explicitly selected or if detection failed
        preferred_language = "English"
    
    # 1. Translate query to English if needed for RAG processing
    processing_query = query
    if preferred_language != "English":
        print(f"Service: Translating query from {preferred_language} to English")
        processing_query = translate_query_to_english(query, preferred_language)
        print(f"Service: Final English Query: {processing_query}")

    # 0. Validate query first
    print(f"Service: Validating query: '{processing_query}'")
    validation = validate_legal_query(processing_query)
    
    if not validation["is_valid"]:
        error_msg = validation["error_message"]
        if preferred_language != "English":
            # Try Sarvam fallback, then LLM
            sarvam_translated = translate_response_from_english(error_msg, preferred_language)
            if sarvam_translated == error_msg:
                error_msg = translate_error(error_msg, preferred_language)
            else:
                error_msg = sarvam_translated
            
        return {
            "summary": error_msg,
            "legal_reasoning": "",
            "sections": [],
            "citations": [],
            "confidence": "low",
            "disclaimer": ""
        }
    
    # 0. Classify Intent
    intent = classify_intent(processing_query)
    
    # 1. Call search_legal_context
    contexts = search_legal_context(processing_query)

    if not contexts:
        summary = "I could not find relevant legal information in the available statutes."
        if preferred_language != "English":
            summary = translate_response_from_english(summary, preferred_language)
            
        return {
            "summary": summary,
            "legal_reasoning": "",
            "sections": [],
            "citations": [],
            "confidence": "low",
            "disclaimer": "This is not legal advice"
        }

    # 2. Generate response with native language support via LLM
    structured_response = generate_legal_response(
        processing_query, 
        contexts, 
        intent=intent, 
        language=preferred_language
    )
    
    # 3. Fallback translation: Always use Sarvam to ensure response is in target language
    # This ensures reliable translation even if LLM doesn't generate in the correct language
    if preferred_language != "English" and structured_response.get("summary"):
        summary = structured_response["summary"]
        # Check if summary appears to be in English (heuristic check)
        # Translate using Sarvam to ensure it's in the user's language
        english_indicators = ["Offence:", "Applicable Law:", "Punishment:", "What should be done", "Section", "IPC", "imprisonment", "fine"]
        
        # Check if response contains English indicators (likely still in English)
        is_likely_english = any(indicator.lower() in summary.lower() for indicator in english_indicators)
        
        if is_likely_english:
            print(f"Service: Detected English response, translating to {preferred_language} using Sarvam...")
            translated_summary = translate_response_from_english(summary, preferred_language)
            if translated_summary and translated_summary != summary:  # Only update if translation succeeded
                structured_response["summary"] = translated_summary
                print(f"Service: Successfully translated summary to {preferred_language}")
            else:
                print(f"Service: Warning - Sarvam translation may have failed or returned same text. Check SARVAM_API_KEY.")
        
        # Also translate disclaimer if present
        if structured_response.get("disclaimer"):
            disclaimer = structured_response["disclaimer"]
            if any(indicator.lower() in disclaimer.lower() for indicator in ["This analysis", "legal advice", "informational", "not constitute"]):
                translated_disclaimer = translate_response_from_english(disclaimer, preferred_language)
                if translated_disclaimer and translated_disclaimer != disclaimer:
                    structured_response["disclaimer"] = translated_disclaimer

    return structured_response

# Example Usage (for direct script execution)
if __name__ == '__main__':
    print("--- Testing Legal Service ---")
    
    # Ensure you have run the ingest.py script first to create the vectorstore
    print("Please ensure 'python -m backend.rag.ingest' has been run to create the vectorstore.")
    
    test_query = "What happens if a contract is breached with fraudulent intent?"
    
    response = ask_legal_question(test_query)
    
    import json
    print("--- Final Legal Service Response ---")
    print(json.dumps(response, indent=2))
    print("------------------------------------")
