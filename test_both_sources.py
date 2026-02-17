from backend.rag.retriever import search_legal_context

# Test queries for both laws
queries = [
    "What is Section 302 IPC murder?",
    "What is theft under BNS?",
    "stalking and harassment laws"
]

for query in queries:
    print(f"\n{'='*70}")
    print(f"Query: {query}")
    print(f"{'='*70}")
    
    results = search_legal_context(query, k=5)
    
    sources_found = {}
    for r in results:
        source = r['source']
        if source not in sources_found:
            sources_found[source] = 0
        sources_found[source] += 1
    
    print(f"\nTotal results: {len(results)}")
    print("Sources retrieved:")
    for source, count in sources_found.items():
        print(f"  • {source}: {count} chunks")
    
    print("\nTop 3 results:")
    for i, r in enumerate(results[:3], 1):
        print(f"\n  {i}. {r['source']} (Score: {r['score']:.3f})")
        print(f"     {r['text'][:120]}...")
