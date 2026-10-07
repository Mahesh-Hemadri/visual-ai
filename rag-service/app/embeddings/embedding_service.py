from sentence_transformers import SentenceTransformer


MODEL_NAME = "BAAI/bge-small-en-v1.5"


class EmbeddingService:

    def __init__(self):

        print(
            f"Loading embedding model: "
            f"{MODEL_NAME}"
        )

        self.model = SentenceTransformer(
            MODEL_NAME
        )

        print(
            "Embedding model loaded."
        )

    def embed_text(
        self,
        text: str,
    ) -> list[float]:

        embedding = self.model.encode(
            text,
            normalize_embeddings=True,
        )

        return embedding.tolist()

    def embed_texts(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True,
        )

        return embeddings.tolist()