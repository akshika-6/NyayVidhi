import fitz  # PyMuPDF
import re
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import pickle
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
RAG_DIR = CURRENT_FILE.parent
BACKEND_DIR = RAG_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

DATA_DIR = PROJECT_ROOT / "data"
VECTORSTORE_DIR = PROJECT_ROOT / "vectorstore"
INDEX_PATH = VECTORSTORE_DIR / "index.faiss"
META_PATH = VECTORSTORE_DIR / "meta.pkl"


# Config
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 50


def extract_text_from_pdf(pdf_path: Path) -> str:
    try:
        doc = fitz.open(pdf_path)
        return "".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return ""


def clean_text(text: str) -> str:
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s\.,\-]", "", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int, overlap: int):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk_words = words[i:i + chunk_size]
        chunks.append(" ".join(chunk_words))
    return chunks


def main():
    print("Starting ingestion pipeline...")

    VECTORSTORE_DIR.mkdir(exist_ok=True)

    pdf_files = list(DATA_DIR.glob("*.pdf"))
    if not pdf_files:
        print("No PDFs found.")
        return

    all_chunks = []
    metadata = []

    for pdf_path in pdf_files:
        print(f"Processing {pdf_path.name}")

        raw_text = extract_text_from_pdf(pdf_path)
        cleaned_text = clean_text(raw_text)
        chunks = chunk_text(cleaned_text, CHUNK_SIZE, CHUNK_OVERLAP)

        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            metadata.append({
                "text": chunk,              # ⭐ STORE TEXT DIRECTLY
                "source": pdf_path.name,
                "chunk_id": i
            })

    print(f"Generated {len(all_chunks)} chunks")

    # Embeddings
    model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = model.encode(
        all_chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")

    # FAISS (cosine similarity)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)

    faiss.write_index(index, str(INDEX_PATH))
    print("FAISS saved")

    with open(META_PATH, "wb") as f:
        pickle.dump(metadata, f)

    print("Metadata saved")
    print("Ingestion completed successfully")


if __name__ == "__main__":
    main()
