"""
Simple language detection utility for Indian languages.
Uses Unicode ranges to detect common Indian scripts.
"""

def detect_language(text: str) -> str:
    """
    Detects the language of input text based on Unicode ranges.
    Returns language name or "English" if not detected.
    """
    if not text or not isinstance(text, str):
        return "English"
    
    text = text.strip()
    if not text:
        return "English"
    
    # Count characters in different Unicode ranges
    hindi_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
    marathi_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')  # Same range as Hindi
    gujarati_chars = sum(1 for char in text if '\u0A80' <= char <= '\u0AFF')
    tamil_chars = sum(1 for char in text if '\u0B80' <= char <= '\u0BFF')
    telugu_chars = sum(1 for char in text if '\u0C00' <= char <= '\u0C7F')
    kannada_chars = sum(1 for char in text if '\u0C80' <= char <= '\u0CFF')
    bengali_chars = sum(1 for char in text if '\u0980' <= char <= '\u09FF')
    malayalam_chars = sum(1 for char in text if '\u0D00' <= char <= '\u0D7F')
    punjabi_chars = sum(1 for char in text if '\u0A00' <= char <= '\u0A7F')
    
    # Count total non-ASCII characters (likely Indic scripts)
    total_indic_chars = hindi_chars + gujarati_chars + tamil_chars + telugu_chars + \
                       kannada_chars + bengali_chars + malayalam_chars + punjabi_chars
    
    # If more than 30% of characters are Indic script, detect language
    total_chars = len([c for c in text if c.isalnum() or c.isspace()])
    if total_chars == 0:
        return "English"
    
    indic_ratio = total_indic_chars / total_chars if total_chars > 0 else 0
    
    if indic_ratio < 0.3:  # Less than 30% Indic characters, likely English
        return "English"
    
    # Determine which language based on character counts
    language_counts = {
        "Hindi": hindi_chars,
        "Gujarati": gujarati_chars,
        "Tamil": tamil_chars,
        "Telugu": telugu_chars,
        "Kannada": kannada_chars,
        "Bengali": bengali_chars,
        "Malayalam": malayalam_chars,
        "Punjabi": punjabi_chars,
    }
    
    # Return the language with most characters
    detected_lang = max(language_counts.items(), key=lambda x: x[1])
    
    # If Hindi/Marathi have characters, default to Hindi (they share Unicode range)
    if hindi_chars > 0:
        return "Hindi"
    
    # Return detected language if it has significant characters
    if detected_lang[1] > 0:
        return detected_lang[0]
    
    return "English"
