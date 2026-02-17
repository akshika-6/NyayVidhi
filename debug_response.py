from backend.services.legal_service import ask_legal_question
import json

# Test a simple query
query = "Is verbal agreement valid?"

print(f"Testing query: {query}\n")
print("="*70)

response = ask_legal_question(query)

print("\nFull API Response:")
print(json.dumps(response, indent=2))

print("\n" + "="*70)
print("\nSummary field:")
print(response.get('summary', 'NO SUMMARY'))
