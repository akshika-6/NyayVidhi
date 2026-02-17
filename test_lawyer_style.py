from backend.services.legal_service import ask_legal_question

# Test the new lawyer-style responses
queries = [
    "A 60-year-old man is repeatedly messaging a 10-year-old girl despite her saying no. What can be done legally?",
    "What is the punishment for theft in India?"
]

for query in queries:
    print(f"\n{'='*80}")
    print(f"QUESTION: {query}")
    print(f"{'='*80}\n")
    
    response = ask_legal_question(query)
    
    print("LAWYER'S RESPONSE:")
    print(response['summary'])
    print(f"\n\nSections Referenced: {', '.join(response.get('sections', ['None']))}")
    
    if response.get('citations'):
        print(f"\nSource Documents:")
        for cit in response['citations'][:3]:  # Show first 3
            print(f"  • {cit}")
    
    print("\n" + "="*80)
