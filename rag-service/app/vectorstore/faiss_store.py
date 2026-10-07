from pathlib import Path
import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService
from app.ingestion.pdf_loader import load_pdf
from app.ingestion.chunker import create_chunks


KNOWLEDGE_BASE_PATH = "../data/knowledge-base/rag"

INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


def build_index():

    print("=" * 70)
    print("BUILDING RAG FAISS INDEX")
    print("=" * 70)

    knowledge_base_path = Path(KNOWLEDGE_BASE_PATH)

    pdf_files = sorted(
        knowledge_base_path.glob("*.pdf")
    )

    if not pdf_files:
        raise FileNotFoundError(
            f"No PDF files found in: {knowledge_base_path}"
        )

    print(
        f"\nFound {len(pdf_files)} PDF files:"
    )

    for pdf_file in pdf_files:
        print(f"  - {pdf_file.name}")

    # --------------------------------------------------
    # 1. LOAD ALL PDFs
    # --------------------------------------------------

    all_pages = []

    for pdf_file in pdf_files:

        print(
            f"\nLoading: {pdf_file.name}"
        )

        pages = load_pdf(
            str(pdf_file)
        )

        print(
            f"  Pages loaded: {len(pages)}"
        )

        all_pages.extend(pages)

    print(
        f"\nTotal pages loaded: "
        f"{len(all_pages)}"
    )

    # --------------------------------------------------
    # 2. CREATE CHUNKS
    # --------------------------------------------------

    chunks = create_chunks(
        all_pages
    )

    print(
        f"Total chunks created: "
        f"{len(chunks)}"
    )

    # --------------------------------------------------
    # 3. CREATE EMBEDDINGS
    # --------------------------------------------------

    embedding_service = EmbeddingService()

    texts = [
        chunk.text
        for chunk in chunks
    ]

    embeddings = embedding_service.embed_texts(
        texts
    )

    embeddings = np.array(
        embeddings,
        dtype="float32",
    )

    print(
        f"Embedding matrix shape: "
        f"{embeddings.shape}"
    )

    # --------------------------------------------------
    # 4. BUILD FAISS INDEX
    # --------------------------------------------------

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(
        dimension
    )

    index.add(
        embeddings
    )

    print(
        f"FAISS index size: "
        f"{index.ntotal}"
    )

    # --------------------------------------------------
    # 5. SAVE INDEX + METADATA
    # --------------------------------------------------

    Path("data").mkdir(
        exist_ok=True
    )

    faiss.write_index(
        index,
        INDEX_PATH,
    )

    with open(
        CHUNKS_PATH,
        "wb",
    ) as file:

        pickle.dump(
            chunks,
            file,
        )

    print(
        "\nIndex saved successfully."
    )

    print(
        f"FAISS index : {INDEX_PATH}"
    )

    print(
        f"Chunks      : {CHUNKS_PATH}"
    )


if __name__ == "__main__":
    build_index()