import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


def search(query: str, top_k: int = 5):

    # Load FAISS index
    index = faiss.read_index(INDEX_PATH)

    # Load chunk metadata
    with open(CHUNKS_PATH, "rb") as file:
        chunks = pickle.load(file)

    # Create embedding for the query
    embedding_service = EmbeddingService()

    query_embedding = embedding_service.embed_text(query)

    query_embedding = np.array(
        [query_embedding],
        dtype="float32",
    )

    # Search FAISS
    scores, indices = index.search(
        query_embedding,
        top_k,
    )

    print("\n" + "=" * 70)
    print("RETRIEVAL RESULTS")
    print("=" * 70)

    print(f"\nQuery: {query}")

    for rank, (score, index_id) in enumerate(
        zip(scores[0], indices[0]),
        start=1,
    ):

        chunk = chunks[index_id]

        print("\n" + "-" * 70)

        print(f"Rank       : {rank}")
        print(f"Score      : {score:.4f}")
        print(f"Chunk ID   : {chunk.chunk_id}")
        print(f"Source     : {chunk.source}")
        print(f"Page       : {chunk.page}")

        print("\nText:")
        print(chunk.text[:1000])


if __name__ == "__main__":

    print("\nEnter your questions.")
    print("Type 'exit' to stop.\n")

    while True:

        query = input("Enter your question: ").strip()

        if query.lower() == "exit":
            break

        if not query:
            print("Please enter a question.\n")
            continue

        search(query)