
from pathlib import Path

import pymupdf


def load_pdf(file_path: str | Path) -> list[dict]:
    """
    Extract non-empty PDF pages while preserving source and page metadata.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not a valid PDF.
    """
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(f"PDF not found: {path}")

    documents = []

    try:
        with pymupdf.open(path) as pdf:
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
    except pymupdf.FileDataError as exc:
        raise ValueError(f"Invalid or unreadable PDF: {path}") from exc

    return documents
