from backend.rag.retriever import search_legal_context

# Test query about a common IPC section
query = "What is Section 302 IPC?"

results = search_legal_context(query, k=5)

print(f"Query: {query}")
print(f"\nTotal results: {len(results)}")
print("\nResults by source:")

sources_found = {}
for r in results:
    source = r['source']
    if source not in sources_found:
        sources_found[source] = []
    sources_found[source].append(r['score'])

for source, scores in sources_found.items():
    print(f"\n{source}:")
    print(f"  Count: {len(scores)}")
    print(f"  Scores: {[f'{s:.3f}' for s in scores]}")

print("\n\nDetailed results:")
for i, r in enumerate(results, 1):
    print(f"\n{i}. Source: {r['source']}")
    print(f"   Score: {r['score']:.3f}")
    print(f"   Text preview: {r['text'][:150]}...")
