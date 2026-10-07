from app.ingestion.pdf_loader import load_pdf
from app.ingestion.chunker import create_chunks


PDF_PATH = "../data/knowledge-base/rag/rag.pdf"


def main():

    print("=" * 70)
    print("RAG CHUNKING TEST")
    print("=" * 70)

    # Step 1: Load PDF
    pages = load_pdf(PDF_PATH)

    print(f"\nLoaded pages: {len(pages)}")

    # Step 2: Create chunks
    chunks = create_chunks(pages)

    print(f"Created chunks: {len(chunks)}")

    print("\n" + "=" * 70)
    print("SAMPLE CHUNKS")
    print("=" * 70)

    # Show first 5 chunks
    for chunk in chunks[:5]:

        print("\n" + "-" * 70)

        print(f"Chunk ID : {chunk.chunk_id}")
        print(f"Source  : {chunk.source}")
        print(f"Page    : {chunk.page}")

        print("\nText:")
        print(chunk.text[:1000])

        print(f"\nWord count: {len(chunk.text.split())}")


if __name__ == "__main__":
    main()