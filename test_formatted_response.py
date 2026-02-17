from backend.services.legal_service import ask_legal_question
import json

# Test with the stalking scenario to see formatted output
query = "A 60-year-old man is repeatedly messaging a 10-year-old girl. What legal action can be taken?"

print(f"Testing query: {query}\n")
print("="*70)

response = ask_legal_question(query)

print("\nFormatted Response:")
print(response.get('summary', 'NO SUMMARY'))

print("\n" + "="*70)
print(f"\nSections: {', '.join(response.get('sections', []))}")
print(f"Confidence: {response.get('confidence', 'N/A')}")
