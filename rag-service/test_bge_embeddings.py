import pickle

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from app.reranking.reranker import Reranker
from app.evaluation.retrieval_eval import (
    EVALUATION_DATASET,
    is_relevant,
)


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"

MODEL_NAME = "BAAI/bge-small-en-v1.5"


def main():

    print("=" * 80)
    print("BGE EMBEDDING MODEL BENCHMARK")
    print("=" * 80)

    print(f"\nLoading model: {MODEL_NAME}")

    model = SentenceTransformer(
        MODEL_NAME
    )

    print("Embedding model loaded.")

    with open(
        CHUNKS_PATH,
        "rb",
    ) as file:
        chunks = pickle.load(file)

    print(
        f"Loaded chunks: {len(chunks)}"
    )

    texts = [
        chunk.text
        for chunk in chunks
    ]

    print("\nGenerating embeddings...")

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=True,
    )

    embeddings = np.asarray(
        embeddings,
        dtype="float32",
    )

    print(
        f"Embedding shape: "
        f"{embeddings.shape}"
    )

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

    reranker = Reranker()

    total_recall_1 = 0
    total_recall_3 = 0
    total_recall_5 = 0
    total_mrr = 0.0

    for item in EVALUATION_DATASET:

        question = item["question"]

        relevant_sources = item[
            "relevant_sources"
        ]

        print("\n" + "-" * 80)
        print(
            f"QUESTION: {question}"
        )
        print("-" * 80)

        query_embedding = model.encode(
            question,
            normalize_embeddings=True,
        )

        query_embedding = np.asarray(
            [query_embedding],
            dtype="float32",
        )

        scores, indices = index.search(
            query_embedding,
            10,
        )

        candidates = []

        print("\nBGE TOP 10:")

        for rank, (score, index_id) in enumerate(
            zip(scores[0], indices[0]),
            start=1,
        ):

            chunk = chunks[index_id]

            relevant = is_relevant(
                {
                    "source": chunk.source,
                    "page": chunk.page,
                },
                relevant_sources,
            )

            marker = "✓" if relevant else " "

            print(
                f"{rank:>2}. "
                f"{chunk.source:<10} "
                f"Page {chunk.page:>2} "
                f"{marker} "
                f"Score {score:>8.4f}"
            )

            candidates.append(
                chunk
            )

        reranked = reranker.rerank(
            query=question,
            chunks=candidates,
            top_k=10,
        )

        print("\nAFTER RERANKING:")

        for rank, (chunk, score) in enumerate(
            reranked,
            start=1,
        ):

            relevant = (
                chunk.source,
                chunk.page,
            ) in relevant_sources

            marker = "✓" if relevant else " "

            print(
                f"{rank:>2}. "
                f"{chunk.source:<10} "
                f"Page {chunk.page:>2} "
                f"{marker} "
                f"CE {score:>8.4f}"
            )

        recall_1 = int(
            any(
                is_relevant(
                    {
                        "source": result[0].source,
                        "page": result[0].page,
                    },
                    relevant_sources,
                )
                for result in reranked[:1]
            )
        )

        recall_3 = int(
            any(
                is_relevant(
                    {
                        "source": result[0].source,
                        "page": result[0].page,
                    },
                    relevant_sources,
                )
                for result in reranked[:3]
            )
        )

        recall_5 = int(
            any(
                is_relevant(
                    {
                        "source": result[0].source,
                        "page": result[0].page,
                    },
                    relevant_sources,
                )
                for result in reranked[:5]
            )
        )

        reciprocal_rank = 0.0

        for rank, (chunk, _) in enumerate(
            reranked,
            start=1,
        ):
            if (
                chunk.source,
                chunk.page,
            ) in relevant_sources:

                reciprocal_rank = (
                    1.0 / rank
                )

                break

        total_recall_1 += recall_1
        total_recall_3 += recall_3
        total_recall_5 += recall_5
        total_mrr += reciprocal_rank

        print(
            f"\nRecall@1: {recall_1}"
        )

        print(
            f"Recall@3: {recall_3}"
        )

        print(
            f"Recall@5: {recall_5}"
        )

        print(
            f"Reciprocal Rank: "
            f"{reciprocal_rank:.4f}"
        )

    total_questions = len(
        EVALUATION_DATASET
    )

    print("\n" + "=" * 80)
    print("BGE FINAL EVALUATION")
    print("=" * 80)

    print(
        f"\nRecall@1 : "
        f"{total_recall_1 / total_questions:.3f}"
    )

    print(
        f"Recall@3 : "
        f"{total_recall_3 / total_questions:.3f}"
    )

    print(
        f"Recall@5 : "
        f"{total_recall_5 / total_questions:.3f}"
    )

    print(
        f"MRR      : "
        f"{total_mrr / total_questions:.3f}"
    )


if __name__ == "__main__":
    main()