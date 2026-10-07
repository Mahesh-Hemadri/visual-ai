from app.retrieval.retriever import Retriever


def main():

    print("=" * 70)
    print("RETRIEVER TEST")
    print("=" * 70)

    retriever = Retriever()

    while True:

        query = input(
            "\nEnter your question "
            "(type 'exit' to stop): "
        ).strip()

        if query.lower() == "exit":
            break

        if not query:
            print("Please enter a question.")
            continue

        results = retriever.retrieve(
            query=query,
            retrieval_k=10,
            final_k=3,
        )

        print("\n" + "=" * 70)
        print("FINAL RETRIEVAL RESULTS")
        print("=" * 70)

        for result in results:

            print("\n" + "-" * 70)

            print(f"Rank           : {result['rank']}")
            print(f"Source         : {result['source']}")
            print(f"Page           : {result['page']}")
            print(f"Chunk ID        : {result['chunk_id']}")
            print(
                f"FAISS score    : "
                f"{result['faiss_score']:.4f}"
            )
            print(
                f"Reranker score : "
                f"{result['reranker_score']:.4f}"
            )

            print("\nText:")
            print(result["text"][:800])


if __name__ == "__main__":
    main()