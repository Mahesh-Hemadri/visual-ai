from app.ingestion.pdf_loader import load_pdf


PDF_PATH = "../data/knowledge-base/rag/rag.pdf"


documents = load_pdf(PDF_PATH)

print(f"\nLoaded {len(documents)} pages\n")

for document in documents[:3]:
    print("=" * 70)
    print(f"SOURCE : {document['source']}")
    print(f"PAGE   : {document['page']}")
    print("=" * 70)
    print(document["text"][:1000])
    print()