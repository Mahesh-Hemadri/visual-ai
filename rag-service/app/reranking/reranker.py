from sentence_transformers import CrossEncoder


MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"


class Reranker:

    def __init__(self):

        print(f"Loading reranker model: {MODEL_NAME}")

        self.model = CrossEncoder(MODEL_NAME)

        print("Reranker model loaded.")

    def rerank(
        self,
        query: str,
        chunks: list,
        top_k: int = 3,
    ):

        pairs = [
            (query, chunk.text)
            for chunk in chunks
        ]

        scores = self.model.predict(pairs)

        ranked = sorted(
            zip(chunks, scores),
            key=lambda item: item[1],
            reverse=True,
        )

        return ranked[:top_k]