from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.retrieval.retriever import Retriever
from app.llm.llm_service import LLMService


app = FastAPI(
    title="VisualAI RAG Service",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RAGRequest(BaseModel):
    query: str


# Load the models once when the service starts.
retriever = Retriever()
llm = LLMService()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "visualai-rag",
    }


@app.post("/api/rag")
def run_rag(request: RAGRequest):

    query = request.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Query is required.",
        )

    try:

        # -----------------------------------------
        # STEP 1 + 2 + 3
        # BGE → FAISS → Cross-Encoder
        # -----------------------------------------

        retrieved_chunks = retriever.retrieve(
            query=query,
            retrieval_k=10,
            final_k=3,
        )

        # -----------------------------------------
        # STEP 4
        # Grounded LLM
        # -----------------------------------------

        result = llm.generate_answer(
            query=query,
            retrieved_chunks=retrieved_chunks,
        )

        # -----------------------------------------
        # Return everything the visualization needs
        # -----------------------------------------

        return {
            "query": query,

            "answer": result["answer"],

            "retrieved_chunks": [
                {
                    "rank": chunk["rank"],
                    "source": chunk["source"],
                    "page": chunk["page"],
                    "chunk_id": chunk["chunk_id"],
                    "faiss_score": chunk["faiss_score"],
                    "reranker_score": chunk["reranker_score"],
                }
                for chunk in retrieved_chunks
            ],

            "sources": result["sources"],
        }

    except Exception as error:

        print("RAG request failed:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )