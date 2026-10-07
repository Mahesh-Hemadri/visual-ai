import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService
from app.reranking.reranker import Reranker


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


def retrieve(query: str, top_k: int = 10):

    index = faiss.read_index(INDEX_PATH)

    with open(CHUNKS_PATH, "rb") as file:
        chunks = pickle.load(file)

    embedding_service = EmbeddingService()

    query_embedding = embedding_service.embed_text(query)

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

        results.append(
            {
                "faiss_rank": rank,
                "faiss_score": float(score),
                "chunk": chunks[index_id],
            }
        )

    return results


def main():

    query = input("\nEnter your question: ").strip()

    if not query:
        print("Please enter a question.")
        return

    # --------------------------------------------------
    # STEP 1 — FAISS
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 1 — FAISS RETRIEVAL")
    print("=" * 70)

    retrieved = retrieve(
        query,
        top_k=10,
    )

    print("\nFAISS ranking:\n")

    for result in retrieved:

        chunk = result["chunk"]

        print(
            f"FAISS Rank {result['faiss_rank']:>2} "
            f"| Score {result['faiss_score']:>7.4f} "
            f"| Page {chunk.page}"
        )

    # --------------------------------------------------
    # STEP 2 — CROSS-ENCODER
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 2 — CROSS-ENCODER RERANKING")
    print("=" * 70)

    reranker = Reranker()

    chunks = [
        result["chunk"]
        for result in retrieved
    ]

    reranked = reranker.rerank(
        query,
        chunks,
        top_k=10,
    )

    # Map chunk ID → reranker information
    reranker_map = {}

    for reranker_rank, (chunk, score) in enumerate(
        reranked,
        start=1,
    ):

        reranker_map[chunk.chunk_id] = {
            "reranker_rank": reranker_rank,
            "reranker_score": float(score),
        }

    # --------------------------------------------------
    # STEP 3 — COMPARE
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("RANKING COMPARISON")
    print("=" * 70)

    print(
        "\n"
        f"{'FAISS':<10}"
        f"{'RERANK':<10}"
        f"{'FAISS SCORE':<14}"
        f"{'CE SCORE':<12}"
        f"{'PAGE':<8}"
    )

    print("-" * 70)

    # Sort by reranker rank
    comparison = []

    for result in retrieved:

        chunk = result["chunk"]

        rerank_info = reranker_map[
            chunk.chunk_id
        ]

        comparison.append(
            {
                "faiss_rank": result["faiss_rank"],
                "faiss_score": result["faiss_score"],
                "reranker_rank": rerank_info["reranker_rank"],
                "reranker_score": rerank_info["reranker_score"],
                "page": chunk.page,
                "chunk": chunk,
            }
        )

    comparison.sort(
        key=lambda item: item["reranker_rank"]
    )

    for item in comparison:

        print(
            f"{item['faiss_rank']:<10}"
            f"{item['reranker_rank']:<10}"
            f"{item['faiss_score']:<14.4f}"
            f"{item['reranker_score']:<12.4f}"
            f"{item['page']:<8}"
        )

    # --------------------------------------------------
    # STEP 4 — FINAL RESULTS
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("FINAL TOP 3")
    print("=" * 70)

    for rank, item in enumerate(
        comparison[:3],
        start=1,
    ):

        chunk = item["chunk"]

        print("\n" + "-" * 70)

        print(f"Final Rank       : {rank}")
        print(f"Original FAISS   : {item['faiss_rank']}")
        print(f"Reranker score   : {item['reranker_score']:.4f}")
        print(f"Source           : {chunk.source}")
        print(f"Page             : {chunk.page}")
        print(f"Chunk ID         : {chunk.chunk_id}")

        print("\nText:")
        print(chunk.text[:800])


if __name__ == "__main__":
    main()