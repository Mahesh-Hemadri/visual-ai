from app.ingestion.pdf_loader import load_pdf
from app.ingestion.chunker import create_chunks
from app.embeddings.embedding_service import EmbeddingService


PDF_PATH = "../data/knowledge-base/rag/rag.pdf"


def main():

    print("=" * 70)
    print("EMBEDDING TEST")
    print("=" * 70)

    # -----------------------------
    # 1. Load PDF
    # -----------------------------

    pages = load_pdf(PDF_PATH)

    print(f"\nLoaded pages: {len(pages)}")

    # -----------------------------
    # 2. Create chunks
    # -----------------------------

    chunks = create_chunks(pages)

    print(f"Created chunks: {len(chunks)}")

    # -----------------------------
    # 3. Load embedding model
    # -----------------------------

    embedding_service = EmbeddingService()

    # -----------------------------
    # 4. Embed first 3 chunks
    # -----------------------------

    sample_chunks = chunks[:3]

    texts = [
        chunk.text
        for chunk in sample_chunks
    ]

    embeddings = embedding_service.embed_texts(texts)

    # -----------------------------
    # 5. Inspect results
    # -----------------------------

    print("\n" + "=" * 70)
    print("EMBEDDING RESULTS")
    print("=" * 70)

    for chunk, embedding in zip(
        sample_chunks,
        embeddings,
    ):

        print("\n" + "-" * 70)

        print(f"Chunk ID      : {chunk.chunk_id}")
        print(f"Source       : {chunk.source}")
        print(f"Page         : {chunk.page}")
        print(f"Vector size  : {len(embedding)}")

        print("\nFirst 10 values:")
        print(embedding[:10])


if __name__ == "__main__":
    main()