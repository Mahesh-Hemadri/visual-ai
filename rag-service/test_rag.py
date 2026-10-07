from app.retrieval.retriever import Retriever
from app.llm.llm_service import LLMService


def main():

    print("=" * 70)
    print("GROUNDED RAG TEST")
    print("=" * 70)

    retriever = Retriever()
    llm = LLMService()

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

        print("\nRetrieving relevant knowledge...")

        results = retriever.retrieve(
            query=query,
            retrieval_k=10,
            final_k=3,
        )

        print(
            f"Retrieved {len(results)} final chunks."
        )

        print("\nGenerating grounded answer...")

        result = llm.generate_answer(
            query=query,
            retrieved_chunks=results,
        )

        print("\n" + "=" * 70)
        print("ANSWER")
        print("=" * 70)

        print(result["answer"])

        print("\n" + "=" * 70)
        print("SOURCES")
        print("=" * 70)

        for source in result["sources"]:

            print(
                f"- {source['source']} "
                f"(Page {source['page']})"
            )


if __name__ == "__main__":
    main()