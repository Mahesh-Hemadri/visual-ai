from dataclasses import dataclass
from typing import List


@dataclass
class DocumentChunk:
    chunk_id: str
    text: str
    source: str
    page: int


def normalize_text(text: str) -> str:
    """
    Clean extracted PDF text while preserving readable content.
    """

    text = text.replace("\r", "\n")

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    return " ".join(lines)


def chunk_text(
    text: str,
    chunk_size: int = 400,
    chunk_overlap: int = 75,
) -> List[str]:
    """
    Split text into overlapping word-based chunks.
    """

    words = text.split()

    if not words:
        return []

    if chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be smaller than chunk_size"
        )

    chunks = []

    start = 0

    while start < len(words):

        end = min(start + chunk_size, len(words))

        chunk = " ".join(words[start:end])

        chunks.append(chunk)

        if end >= len(words):
            break

        start = end - chunk_overlap

    return chunks


def create_chunks(pages) -> List[DocumentChunk]:
    """
    Convert page-level documents into smaller chunks.

    Each chunk retains its source and page metadata.
    """

    all_chunks: List[DocumentChunk] = []

    for page_doc in pages:

        text = normalize_text(page_doc["text"])

        page_chunks = chunk_text(
            text=text,
            chunk_size=400,
            chunk_overlap=75,
        )

        for index, chunk in enumerate(page_chunks):

            source = page_doc["source"]
            page = page_doc["page"]

            chunk_id = (
                f"{source.replace('.', '_')}"
                f"_page_{page:03d}"
                f"_chunk_{index:03d}"
            )

            all_chunks.append(
                DocumentChunk(
                    chunk_id=chunk_id,
                    text=chunk,
                    source=source,
                    page=page,
                )
            )

    return all_chunks