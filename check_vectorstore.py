import pickle
from pathlib import Path

meta_path = Path("vectorstore/meta.pkl")

with open(meta_path, "rb") as f:
    metadata = pickle.load(f)

sources = {}
for m in metadata:
    source = m['source']
    if source not in sources:
        sources[source] = 0
    sources[source] += 1

print(f"Total chunks: {len(metadata)}")
print(f"\nChunks per source:")
for source, count in sources.items():
    print(f"  {source}: {count} chunks")

# Show sample chunks from each source
print(f"\nSample chunks:")
for source in sources.keys():
    sample = next(m for m in metadata if m['source'] == source)
    print(f"\n{source}:")
    print(f"  Chunk text preview: {sample['text'][:200]}...")
