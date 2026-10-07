import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


QUERIES = [
    "What type of retriever does RAG use?",
    "What retriever does RAG use?",
    "What is the RAG retriever?",
    "Which retrieval model does RAG use?",
    "What is the DPR retriever in RAG?",
    "What retrieval component does RAG use?",
]


EXPECTED_SOURCES = [
    ("rag.pdf", 3),
    ("dpr.pdf", 3),
]


def main():

    print("=" * 80)
    print("QUERY VARIANT DIAGNOSTIC")
    print("=" * 80)

    index = faiss.read_index(
        INDEX_PATH
    )

    with open(
        CHUNKS_PATH,
        "rb",
    ) as file:

        chunks = pickle.load(file)

    embedding_service = EmbeddingService()

    for query in QUERIES:

        print("\n" + "-" * 80)
        print(f"QUERY: {query}")
        print("-" * 80)

        query_embedding = (
            embedding_service.embed_text(query)
        )

        query_embedding = np.array(
            [query_embedding],
            dtype="float32",
        )

        scores, indices = index.search(
            query_embedding,
            10,
        )

        found = False

        for rank, (score, index_id) in enumerate(
            zip(scores[0], indices[0]),
            start=1,
        ):

            chunk = chunks[index_id]

            relevant = (
                chunk.source,
                chunk.page,
            ) in EXPECTED_SOURCES

            marker = "✓" if relevant else " "

            if relevant:
                found = True

            print(
                f"{rank:>2}. "
                f"{chunk.source:<10} "
                f"Page {chunk.page:>2} "
                f"{marker} "
                f"Score {score:>8.4f}"
            )

        if found:

            print(
                "\n✓ Relevant source found "
                "in FAISS top-10."
            )

        else:

            print(
                "\n✗ Relevant source NOT found "
                "in FAISS top-10."
            )


if __name__ == "__main__":
    main()