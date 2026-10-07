from app.retrieval.retriever import Retriever
from evaluation_questions import EVALUATION_DATASET


def is_relevant(result, relevant_sources):
    """
    Check whether a retrieved result matches
    one of the expected source + page pairs.
    """

    result_source = result["source"]
    result_page = result["page"]

    return (
        result_source,
        result_page,
    ) in relevant_sources


def calculate_metrics(
    retrieved_results,
    relevant_sources,
):

    # --------------------------------------------------
    # Recall@1
    # --------------------------------------------------

    recall_at_1 = int(
        is_relevant(
            retrieved_results[0],
            relevant_sources,
        )
    )

    # --------------------------------------------------
    # Recall@3
    # --------------------------------------------------

    recall_at_3 = int(
        any(
            is_relevant(
                result,
                relevant_sources,
            )
            for result in retrieved_results[:3]
        )
    )

    # --------------------------------------------------
    # Recall@5
    # --------------------------------------------------

    recall_at_5 = int(
        any(
            is_relevant(
                result,
                relevant_sources,
            )
            for result in retrieved_results[:5]
        )
    )

    # --------------------------------------------------
    # Reciprocal Rank
    # --------------------------------------------------

    reciprocal_rank = 0.0

    for rank, result in enumerate(
        retrieved_results,
        start=1,
    ):

        if is_relevant(
            result,
            relevant_sources,
        ):

            reciprocal_rank = 1.0 / rank
            break

    return (
        recall_at_1,
        recall_at_3,
        recall_at_5,
        reciprocal_rank,
    )


def main():

    print("=" * 70)
    print("RETRIEVAL EVALUATION")
    print("=" * 70)

    retriever = Retriever()

    total_recall_1 = 0
    total_recall_3 = 0
    total_recall_5 = 0
    total_mrr = 0.0

    for item in EVALUATION_DATASET:

        question = item["question"]

        relevant_sources = item[
            "relevant_sources"
        ]

        print("\n" + "-" * 70)

        print(
            f"Question: {question}"
        )

        print(
            "Expected sources:"
        )

        for source, page in relevant_sources:

            print(
                f"  - {source}, page {page}"
            )

        # --------------------------------------------------
        # RETRIEVE
        # --------------------------------------------------

        results = retriever.retrieve(
            query=question,
            retrieval_k=10,
            final_k=10,
        )

        print("\nRetrieved ranking:")

        for rank, result in enumerate(
            results,
            start=1,
        ):

            relevant = is_relevant(
                result,
                relevant_sources,
            )

            marker = "✓" if relevant else " "

            print(
                f"{rank:>2}. "
                f"{result['source']:<10} "
                f"Page {result['page']:>2} "
                f"{marker} "
                f"Score "
                f"{result['reranker_score']:>8.4f}"
            )

        # --------------------------------------------------
        # METRICS
        # --------------------------------------------------

        (
            recall_1,
            recall_3,
            recall_5,
            reciprocal_rank,
        ) = calculate_metrics(
            results,
            relevant_sources,
        )

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

        total_recall_1 += recall_1
        total_recall_3 += recall_3
        total_recall_5 += recall_5
        total_mrr += reciprocal_rank

    # ------------------------------------------------------
    # FINAL METRICS
    # ------------------------------------------------------

    total_questions = len(
        EVALUATION_DATASET
    )

    print("\n" + "=" * 70)
    print("FINAL EVALUATION")
    print("=" * 70)

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