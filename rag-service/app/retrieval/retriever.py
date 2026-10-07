import pickle

import faiss
import numpy as np

from app.embeddings.embedding_service import EmbeddingService
from app.reranking.reranker import Reranker


INDEX_PATH = "data/rag.index"
CHUNKS_PATH = "data/rag_chunks.pkl"


class Retriever:

    def __init__(
        self,
        index_path: str = INDEX_PATH,
        chunks_path: str = CHUNKS_PATH,
    ):

        print("Loading FAISS index...")

        self.index = faiss.read_index(index_path)

        print(
            f"FAISS index loaded: "
            f"{self.index.ntotal} vectors"
        )

        with open(chunks_path, "rb") as file:
            self.chunks = pickle.load(file)

        print(
            f"Chunk metadata loaded: "
            f"{len(self.chunks)} chunks"
        )

        self.embedding_service = EmbeddingService()
        self.reranker = Reranker()

    def retrieve(
        self,
        query: str,
        retrieval_k: int = 10,
        final_k: int = 3,
    ):

        # --------------------------------------------------
        # 1. Embed query
        # --------------------------------------------------

        query_embedding = (
            self.embedding_service.embed_text(query)
        )

        query_embedding = np.array(
            [query_embedding],
            dtype="float32",
        )

        # --------------------------------------------------
        # 2. FAISS candidate retrieval
        # --------------------------------------------------

        scores, indices = self.index.search(
            query_embedding,
            retrieval_k,
        )

        candidates = []

        for score, index_id in zip(
            scores[0],
            indices[0],
        ):

            candidates.append(
                {
                    "chunk": self.chunks[index_id],
                    "faiss_score": float(score),
                }
            )

        # --------------------------------------------------
        # 3. Cross-Encoder reranking
        # --------------------------------------------------

        candidate_chunks = [
            item["chunk"]
            for item in candidates
        ]

        reranked = self.reranker.rerank(
            query=query,
            chunks=candidate_chunks,
            top_k=final_k,
        )

        # --------------------------------------------------
        # 4. Build final retrieval results
        # --------------------------------------------------

        results = []

        for rank, (chunk, reranker_score) in enumerate(
            reranked,
            start=1,
        ):

            faiss_score = next(
                (
                    item["faiss_score"]
                    for item in candidates
                    if item["chunk"].chunk_id
                    == chunk.chunk_id
                ),
                None,
            )

            results.append(
                {
                    "rank": rank,
                    "chunk_id": chunk.chunk_id,
                    "text": chunk.text,
                    "source": chunk.source,
                    "page": chunk.page,
                    "faiss_score": faiss_score,
                    "reranker_score": float(
                        reranker_score
                    ),
                }
            )

        return results