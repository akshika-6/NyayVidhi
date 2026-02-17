"""
Test script to validate input validation service integration.
"""

from backend.services.legal_service import ask_legal_question

# Test cases for validation
test_queries = [
    # Invalid queries
    "asdfgh",
    "hello",
    "xyz123",
    "hi there",
    "jjjjj",
    "What is Section 302 US Code?",
    "legal",
    "law",
    
    # Valid queries
    "What is theft under IPC?",
    "What are the punishments for assault?",
    "Is verbal agreement valid?",
]

print("=" * 80)
print("TESTING INPUT VALIDATION")
print("=" * 80)

for query in test_queries:
    print(f"\n{'='*80}")
    print(f"QUERY: {query}")
    print(f"{'='*80}")
    
    result = ask_legal_question(query)
    
    print(f"\nRESPONSE:")
    print(f"Summary: {result['summary'][:200]}...")
    print(f"Confidence: {result['confidence']}")
    print(f"Sections: {len(result.get('sections', []))}")
