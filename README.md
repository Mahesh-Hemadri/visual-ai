# VisualAI

> Turn complex AI/ML concepts into interactive visual explanations.

VisualAI is an interactive learning platform that combines **RAG, LLMs, and deterministic visualization** to explain technical concepts visually rather than relying only on text.

The system is designed around one core principle:

> **The AI decides what should be explained; the visualization engine decides how it should be rendered.**

---

## ✨ Features

- 🤖 AI-assisted concept understanding
- 📚 Grounded RAG pipeline with document citations
- 🔎 Semantic retrieval using BGE embeddings + FAISS
- 🎯 Cross-encoder reranking
- 🧠 Grounded LLM generation
- 🎬 Timeline-based interactive visualizations
- 📊 Real retrieval and reranking scores displayed in the UI
- 🛡️ Grounded responses with an out-of-context refusal
- 🧩 Modular visualization components

---

## 🏗️ Architecture

```text
                    User
                     │
                     ▼
              Concept / Question
                     │
                     ▼
              Next.js Application
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   Visualization API        RAG API
          │                     │
          ▼                     ▼
   Visualization Planner    Query Embedding
                                │
                                ▼
                             FAISS
                                │
                                ▼
                        Cross-Encoder
                           Reranking
                                │
                                ▼
                         Top-K Context
                                │
                                ▼
                         Grounded LLM
                                │
                                ▼
                       Answer + Sources
          │                     │
          └──────────┬──────────┘
                     ▼
          Deterministic Renderer
                     │
                     ▼
          Interactive Visualization

🔬 RAG Pipeline
The current RAG implementation follows:
PDF Documents
     │
     ▼
PyMuPDF Extraction
     │
     ▼
Page-level Chunking
     │
     ▼
BGE-small-en-v1.5
     │
     ▼
FAISS Vector Index
     │
     ▼
Top-10 Retrieval
     │
     ▼
Cross-Encoder Reranking
     │
     ▼
Top-3 Chunks
     │
     ▼
Grounded LLM
     │
     ▼
Answer + Source Citations

Embedding
Model:
BAAI/bge-small-en-v1.5

Embedding dimension:
384

Embeddings are normalized and searched using FAISS inner-product similarity.
Retrieval
The system retrieves the top 10 candidate chunks from FAISS before reranking them.
Reranking
Retrieved candidates are reranked using:
cross-encoder/ms-marco-MiniLM-L-6-v2

The top 3 reranked chunks are passed to the LLM as context.
Grounded Generation
The LLM is instructed to answer using only the retrieved context.
If the knowledge base does not contain sufficient information, the system returns:
I don't have enough information in the provided knowledge base.

Generated answers include source attribution such as:
[Source: rag.pdf, p. 1]

📈 Retrieval Evaluation
The retrieval pipeline was evaluated against a small question set.
Metric	Result
Recall@1	0.714
Recall@3	1.000
Recall@5	1.000
MRR	0.833


These results were used as the baseline for the current retrieval implementation.
🎬 Visualization Engine
VisualAI uses a deterministic rendering system rather than allowing the LLM to generate arbitrary frontend code.
The pipeline is:
Concept
   ↓
Visualization Specification
   ↓
Validation
   ↓
Timeline
   ↓
React Renderer
   ↓
Interactive Scene

The renderer contains reusable visualization primitives and scenes.
Current concepts include:
- Neuron
- Neural Networks
- Tokenization
- Retrieval-Augmented Generation
The RAG visualization exposes the actual pipeline:
User Query
     ↓
Query Embedding
     ↓
FAISS Retrieval
     ↓
Cross-Encoder Reranking
     ↓
Grounded LLM
     ↓
Grounded Answer
     ↓
Sources

The visualization displays real retrieval and reranking values produced by the backend.
🛠️ Tech Stack
Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
AI / ML
- Python
- Sentence Transformers
- BAAI/bge-small-en-v1.5
- Cross-Encoder
- FAISS
- OpenRouter / LLM API
Backend
- FastAPI
- Pydantic
Document Processing
- PyMuPDF
📁 Project Structure
visual-ai/
│
├── app/
│   ├── api/
│   │   ├── rag/
│   │   └── visualize/
│   ├── learn/
│   ├── playground/
│   └── visualize/
│
├── components/
│   ├── SceneRenderer.tsx
│   └── TimelineControls.tsx
│
├── types/
│   ├── visualization.ts
│   └── aiVisualization.ts
│
├── visualizations/
│   ├── computations/
│   ├── primitives/
│   └── scenes/
│
└── rag-service/
    ├── app/
    │   ├── embeddings/
    │   ├── evaluation/
    │   ├── ingestion/
    │   ├── llm/
    │   ├── reranking/
    │   ├── retrieval/
    │   └── vectorstore/
    ├── evaluation_questions.py
    └── test_*.py

Generated files such as the FAISS index, knowledge-base data, virtual environment, and environment variables are excluded from Git.
🚀 Running Locally
1. Clone the repository
git clone https://github.com/Mahesh-Hemadri/visual-ai
cd visual-ai

2. Install frontend dependencies
npm install

3. Configure environment variables
Create:
.env.local

and add the required API configuration.
The RAG service uses:
OPENROUTER_API_KEY

Create:
rag-service/.env

with the required key.
Never commit these files.
▶️ Start the Frontend
From the project root:
npm run dev

Open:
http://localhost:3000

▶️ Start the RAG Service
Open another terminal:
cd rag-service

Create/activate the virtual environment and install the Python dependencies.
Then:
uvicorn app.main:app --reload --port 8000

The RAG service will be available at:
http://127.0.0.1:8000

Health check:
http://127.0.0.1:8000/health

🧪 Example
Try:
What is Retrieval-Augmented Generation?

The system performs:
Query
 ↓
Embedding
 ↓
FAISS Top-10
 ↓
Cross-Encoder Reranking
 ↓
Top-3 Context
 ↓
LLM
 ↓
Grounded Answer

The UI then visualizes each stage of the pipeline.
Out-of-context questions are rejected rather than answered using unsupported information.
🧠 Design Decisions
Why separate AI planning from rendering?
LLMs are useful for understanding concepts and producing structured explanations, but deterministic rendering provides:
- predictable behavior
- consistent animations
- reusable components
- easier debugging
- safer execution
The LLM therefore determines what to explain, while the application determines how to visualize it.
Why FAISS?
FAISS provides efficient local vector similarity search and keeps the current prototype lightweight without requiring an external vector database.
Why reranking?
Vector similarity is useful for candidate retrieval, but the cross-encoder provides a second relevance-scoring stage before context is passed to the LLM.
Why grounded generation?
The system is designed to reduce hallucination by restricting generation to retrieved knowledge-base context and providing source attribution.
⚠️ Current Limitations
- The current knowledge base is a small local document collection.
- The RAG service currently runs locally.
- Document ingestion is currently focused on PDF text extraction.
- The visualization library currently supports a limited set of concepts.
- The project is currently optimized as a portfolio/MVP application rather than a production-scale deployment.
🔮 Future Improvements
Potential extensions include:
- Hybrid BM25 + semantic retrieval
- Larger document collections
- OCR support for scanned documents
- Streaming LLM responses
- Multi-turn conversations
- Dockerized deployment
- Cloud deployment
- Additional interactive AI/ML visualizations
📌 Project Status
MVP Complete
The current implementation demonstrates an end-to-end AI system combining:
- RAG
- semantic retrieval
- vector search
- reranking
- grounded generation
- source attribution
- deterministic visualization
- interactive frontend rendering