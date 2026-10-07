from pathlib import Path
import pymupdf


def load_pdf(file_path: str) -> list[dict]:
    """
    Extract text from a PDF while preserving page-level metadata.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {path}")

    documents = []

    pdf = pymupdf.open(path)

    for page_number, page in enumerate(pdf, start=1):
        text = page.get_text("text").strip()

        if not text:
            continue

        documents.append(
            {
                "source": path.name,
                "page": page_number,
                "text": text,
            }
        )

    pdf.close()

    return documents