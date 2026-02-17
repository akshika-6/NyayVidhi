from backend.rag.retriever import search_legal_context
from backend.rag.generator import generate_legal_response



def ask_legal_question(query: str) -> dict:
    """
    Orchestrates the RAG pipeline to answer a legal question.

    Steps:
    1. Retrieves relevant legal contexts based on the query.
    2. Generates a structured legal response using the query and contexts.

    Args:
        query (str): The user's legal question.

    Returns:
        dict: A structured JSON response containing summary, legal reasoning, etc.
    """
    print(f"Service: Searching for contexts for query: '{query}'")
    # 1. Call search_legal_context from rag/retriever.py
    contexts = search_legal_context(query)

    if not contexts:
        print("Service: No contexts found for the query.")
        return {
            "summary": "No relevant legal context found to answer your question.",
            "legal_reasoning": "",
            "sections": [],
            "citations": [],
            "confidence": "low",
            "disclaimer": "This is not legal advice"
        }

    print(f"Service: Found {len(contexts)} relevant contexts. Generating response...")
    # 2. Pass results to generate_legal_response from rag/generator.py
    structured_response = generate_legal_response(query, contexts)
    
    # 3. Return final structured JSON
    print("Service: Legal response generated.")
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
