from backend.services.legal_service import ask_legal_question

# Test end-to-end with actual API call
queries = [
    "What is theft?",
    "Explain stalking laws in India"
]

for query in queries:
    print(f"\n{'='*70}")
    print(f"Query: {query}")
    print(f"{'='*70}\n")
    
    response = ask_legal_question(query)
    
    print(f"Summary: {response['summary']}\n")
    print(f"Legal Reasoning: {response['legal_reasoning'][:200]}...\n")
    print(f"Sections: {', '.join(response.get('sections', []))}")
    print(f"Confidence: {response.get('confidence', 'N/A')}")
    
    if 'citations' in response and response['citations']:
        print(f"\nCitations:")
        for cit in response['citations']:
            print(f"  • {cit}")
