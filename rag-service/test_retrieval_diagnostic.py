import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService
from app.reranking.reranker import Reranker


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


def retrieve_faiss(
    query,
    embedding_service,
    index,
    chunks,
    top_k=10,
):

    query_embedding = (
        embedding_service.embed_text(query)
    )

    query_embedding = np.array(
        [query_embedding],
        dtype="float32",
    )

    scores, indices = index.search(
        query_embedding,
        top_k,
    )

    results = []

    for rank, (score, index_id) in enumerate(
        zip(scores[0], indices[0]),
        start=1,
    ):

        chunk = chunks[index_id]

        results.append(
            {
                "faiss_rank": rank,
                "faiss_score": float(score),
                "chunk": chunk,
            }
        )

    return results


def run_diagnostic(
    query,
    expected_sources,
    embedding_service,
    reranker,
    index,
    chunks,
):

    print("\n" + "=" * 80)
    print(f"QUERY: {query}")
    print("=" * 80)

    print("\nExpected relevant sources:")

    for source, page in expected_sources:
        print(
            f"  - {source}, page {page}"
        )

    # --------------------------------------------------
    # STEP 1 — FAISS
    # --------------------------------------------------

    faiss_results = retrieve_faiss(
        query=query,
        embedding_service=embedding_service,
        index=index,
        chunks=chunks,
        top_k=10,
    )

    print("\n" + "-" * 80)
    print("STEP 1 — FAISS TOP 10")
    print("-" * 80)

    for result in faiss_results:

        chunk = result["chunk"]

        relevant = (
            chunk.source,
            chunk.page,
        ) in expected_sources

        marker = "✓" if relevant else " "

        print(
            f"{result['faiss_rank']:>2}. "
            f"{chunk.source:<10} "
            f"Page {chunk.page:>2} "
            f"{marker} "
            f"Score {result['faiss_score']:>8.4f}"
        )

    # --------------------------------------------------
    # Check whether expected chunks reached FAISS
    # --------------------------------------------------

    print("\nExpected chunks found in FAISS:")

    found_in_faiss = False

    for result in faiss_results:

        chunk = result["chunk"]

        if (
            chunk.source,
            chunk.page,
        ) in expected_sources:

            found_in_faiss = True

            print(
                f"  ✓ FAISS rank "
                f"{result['faiss_rank']}: "
                f"{chunk.source}, "
                f"page {chunk.page}"
            )

    if not found_in_faiss:

        print(
            "  ✗ None of the expected "
            "source/page pairs are in FAISS top 10."
        )

    # --------------------------------------------------
    # STEP 2 — CROSS ENCODER
    # --------------------------------------------------

    candidate_chunks = [
        result["chunk"]
        for result in faiss_results
    ]

    reranked = reranker.rerank(
        query=query,
        chunks=candidate_chunks,
        top_k=10,
    )

    print("\n" + "-" * 80)
    print("STEP 2 — CROSS-ENCODER RERANKING")
    print("-" * 80)

    for rank, (chunk, score) in enumerate(
        reranked,
        start=1,
    ):

        relevant = (
            chunk.source,
            chunk.page,
        ) in expected_sources

        marker = "✓" if relevant else " "

        original_faiss_rank = next(
            result["faiss_rank"]
            for result in faiss_results
            if result["chunk"].chunk_id
            == chunk.chunk_id
        )

        print(
            f"{rank:>2}. "
            f"{chunk.source:<10} "
            f"Page {chunk.page:>2} "
            f"{marker} "
            f"CE {score:>8.4f} "
            f"| Original FAISS rank "
            f"{original_faiss_rank}"
        )

    # --------------------------------------------------
    # SHOW TOP CHUNK TEXT
    # --------------------------------------------------

    print("\n" + "-" * 80)
    print("TOP RERANKED CHUNKS")
    print("-" * 80)

    for rank, (chunk, score) in enumerate(
        reranked[:5],
        start=1,
    ):

        print(
            f"\n[{rank}] "
            f"{chunk.source}, "
            f"page {chunk.page}"
        )

        print(
            f"Cross-Encoder score: "
            f"{score:.4f}"
        )

        print("\nText:")

        print(
            chunk.text[:1200]
        )


def main():

    print("=" * 80)
    print("RETRIEVAL DIAGNOSTIC")
    print("=" * 80)

    index = faiss.read_index(
        INDEX_PATH
    )

    with open(
        CHUNKS_PATH,
        "rb",
    ) as file:

        chunks = pickle.load(file)

    print(
        f"\nLoaded FAISS index: "
        f"{index.ntotal} vectors"
    )

    print(
        f"Loaded chunks: "
        f"{len(chunks)}"
    )

    embedding_service = EmbeddingService()

    reranker = Reranker()

    # --------------------------------------------------
    # TEST 1
    # --------------------------------------------------

    run_diagnostic(
        query="What type of retriever does RAG use?",
        expected_sources=[
            ("rag.pdf", 3),
            ("dpr.pdf", 3),
        ],
        embedding_service=embedding_service,
        reranker=reranker,
        index=index,
        chunks=chunks,
    )

    # --------------------------------------------------
    # TEST 2
    # --------------------------------------------------

    run_diagnostic(
        query="How can the knowledge index be updated?",
        expected_sources=[
            ("rag.pdf", 7),
            ("rag.pdf", 8),
            ("rag.pdf", 9),
        ],
        embedding_service=embedding_service,
        reranker=reranker,
        index=index,
        chunks=chunks,
    )


if __name__ == "__main__":
    main()