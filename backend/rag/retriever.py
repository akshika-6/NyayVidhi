import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path
from functools import lru_cache


CURRENT_FILE = Path(__file__).resolve()
RAG_DIR = CURRENT_FILE.parent              # backend/rag
BACKEND_DIR = RAG_DIR.parent               # backend
PROJECT_ROOT = BACKEND_DIR.parent          # NyayVidhi root

VECTORSTORE_DIR = PROJECT_ROOT / "vectorstore"
INDEX_PATH = VECTORSTORE_DIR / "index.faiss"
META_PATH = VECTORSTORE_DIR / "meta.pkl"
DATA_DIR = PROJECT_ROOT / "data"

# ================= CONFIG =================
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 5
# ==========================================


# ---------- Load resources once ----------

@lru_cache(maxsize=1)
def load_resources():
    print("Loading vector database...")

    index = faiss.read_index(str(INDEX_PATH))

    with open(META_PATH, "rb") as f:
        metadata = pickle.load(f)

    model = SentenceTransformer(EMBEDDING_MODEL)

    print("Retriever ready.")
    return index, metadata, model



# ---------- Search Function ----------
def search_legal_context(query: str, k: int = 5) -> list[dict]:
    index, metadata, model = load_resources()

    # Create normalized query embedding (cosine similarity)
    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")

    # Search FAISS
    scores, indices = index.search(query_embedding, k)

    results = []

    for i in range(len(indices[0])):
        idx = indices[0][i]
        similarity = float(scores[0][i])   # cosine similarity

        meta = metadata[idx]

        results.append({
            "text": meta["text"],
            "source": meta["source"],
            "score": similarity
        })

    return results


# ---------- Test ----------
if __name__ == "__main__":
    query = "Someone cheated me in online transaction what can I do?"

    results = search_legal_context(query)

    print("\nTop Results:\n")
    for r in results:
        print(f"[Score: {r['score']:.3f}] {r['source']}")
        print(r["text"][:300])
        print("-" * 80)
