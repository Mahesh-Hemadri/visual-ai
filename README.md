# VisualAI

> Turn complex AI/ML concepts into interactive visual explanations.

VisualAI is an interactive learning platform that combines RAG, LLMs, and deterministic visualization to explain technical concepts visually rather than relying only on text.

The core idea is simple:

**The AI decides what should be explained. The visualization engine decides how it should be rendered.**

---

## Features

- AI-assisted concept understanding
- Grounded Retrieval-Augmented Generation (RAG)
- Semantic retrieval using BGE embeddings and FAISS
- Cross-encoder reranking
- Grounded LLM generation
- Timeline-based interactive visualizations
- Real retrieval and reranking scores displayed in the UI
- Source attribution and out-of-context refusal
- Reusable visualization primitives and scenes
- Next.js frontend with a FastAPI RAG backend

---

## Architecture

```text
                         USER
                           |
                           v
                  Concept / Question
                           |
                           v
                  +-----------------+
                  | Next.js Frontend|
                  +--------+--------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
     Visualization API              RAG API
             |                           |
             |                           v
             |                    Query Embedding
             |                           |
             |                           v
             |                         FAISS
             |                           |
             |                           v
             |                    Top-K Retrieval
             |                           |
             |                           v
             |                  Cross-Encoder
             |                    Reranking
             |                           |
             |                           v
             |                     Top-3 Chunks
             |                           |
             |                           v
             |                    Grounded LLM
             |                           |
             |                           v
             |                    Answer + Sources
             |                           |
             +-------------+-------------+
                           |
                           v
                 Deterministic Renderer
                           |
                           v
                 Interactive Visualization
```

---

## RAG Pipeline

The RAG implementation follows this pipeline:

```text
PDF Documents
      |
      v
PyMuPDF Extraction
      |
      v
Page-based Chunking
      |
      v
BGE-small-en-v1.5 Embeddings
      |
      v
FAISS Vector Search
      |
      v
Top-10 Candidates
      |
      v
Cross-Encoder Reranking
      |
      v
Top-3 Chunks
      |
      v
Grounded LLM
      |
      v
Answer + Source Citations
```

### 1. Document Ingestion

PDF documents are processed using **PyMuPDF**.

The extracted content is divided into chunks using:

- 400-word chunk size
- 75-word overlap
- Page-level source metadata

Each chunk retains information such as:

```text
Source
Page
Chunk ID
Text
```

This metadata is later used for source attribution.

### 2. Embeddings

The project uses:

```text
BAAI/bge-small-en-v1.5
```

The embedding dimension is:

```text
384
```

Embeddings are normalized before being stored in the vector index.

### 3. Vector Retrieval

FAISS is used for semantic similarity search.

The current implementation uses:

```text
FAISS IndexFlatIP
```

The query is embedded using the same embedding model and compared against the indexed document chunks.

The system initially retrieves:

```text
Top 10 candidates
```

### 4. Reranking

The retrieved candidates are reranked using:

```text
cross-encoder/ms-marco-MiniLM-L-6-v2
```

The cross-encoder evaluates the relevance between the query and retrieved chunks.

The final:

```text
Top 3 chunks
```

are passed to the LLM.

> FAISS similarity scores and cross-encoder scores use different scoring systems. They are used primarily to determine ranking rather than being directly compared as equivalent values.

### 5. Grounded Generation

The LLM receives the user's question together with the retrieved context.

The generation prompt instructs the model to:

- Use only the supplied context
- Avoid unsupported information
- Include source attribution
- Refuse to answer when the knowledge base does not contain enough information

For example:

```text
I don't have enough information in the provided knowledge base.
```

This provides an explicit fallback for out-of-context questions.

---

## Retrieval Evaluation

The retrieval pipeline was evaluated using a 7-question evaluation set.

| Metric | Result |
|---|---:|
| Recall@1 | 0.714 |
| Recall@3 | 1.000 |
| Recall@5 | 1.000 |
| MRR | 0.833 |

These results represent the current baseline for the implemented retrieval pipeline.

---

## Visualization Engine

VisualAI uses a deterministic visualization system rather than allowing the LLM to generate arbitrary frontend code.

The visualization pipeline is:

```text
Concept
   |
   v
Visualization Specification
   |
   v
Validation
   |
   v
Timeline
   |
   v
React Renderer
   |
   v
Interactive Scene
```

The renderer is built around reusable visualization primitives and scenes.

Current visualization concepts include:

- Neural Networks
- Neurons
- Tokenization
- Retrieval-Augmented Generation

---

## RAG Visualization

The RAG visualization represents the actual retrieval pipeline:

```text
User Query
    |
    v
Query Embedding
    |
    v
FAISS Retrieval
    |
    v
Cross-Encoder Reranking
    |
    v
Top-3 Chunks
    |
    v
Grounded LLM
    |
    v
Grounded Answer
    |
    v
Sources
```

The visualization displays actual values returned by the RAG backend, including:

- FAISS similarity scores
- Cross-encoder reranking scores
- Retrieved document names
- Page numbers
- Grounded answer
- Source references

This connects the visual explanation to the actual backend execution rather than using hardcoded demonstration values.

---

## Design Philosophy

VisualAI separates **AI reasoning** from **visual rendering**.

### AI Layer

The AI is responsible for:

- Understanding the user's question
- Retrieving relevant knowledge
- Generating grounded explanations
- Producing structured information for visualization

### Rendering Layer

The application is responsible for:

- Validating visualization data
- Managing timelines
- Rendering reusable components
- Controlling animations
- Producing predictable visual output

This separation provides:

- Predictable rendering
- Reusable visualization components
- Easier debugging
- Safer execution
- Consistent animations
- Clear separation between AI and application logic

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion

### AI / ML

- Python
- Sentence Transformers
- BAAI/bge-small-en-v1.5
- Cross-Encoder
- FAISS
- OpenRouter

### Backend

- FastAPI
- Pydantic

### Document Processing

- PyMuPDF

---

## Project Structure

```text
visual-ai/
|
├── app/
│   ├── api/
│   │   ├── rag/
│   │   └── visualize/
│   │
│   ├── learn/
│   ├── playground/
│   ├── visualize/
│   └── page.tsx
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
├── rag-service/
│   ├── app/
│   │   ├── embeddings/
│   │   ├── evaluation/
│   │   ├── ingestion/
│   │   ├── llm/
│   │   ├── reranking/
│   │   ├── retrieval/
│   │   └── vectorstore/
│   │
│   ├── evaluation_questions.py
│   └── test_*.py
│
├── package.json
├── README.md
└── .gitignore
```

Generated files such as:

- Python virtual environments
- Environment variables
- FAISS indexes
- Knowledge-base data
- Python cache files
- Next.js build files

are excluded from Git.

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Python 3.10+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Mahesh-Hemadri/visual-ai
cd visual-ai
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create:

```text
.env.local
```

in the project root.

The RAG service requires an OpenRouter API key.

Create:

```text
rag-service/.env
```

with:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Do not commit API keys or environment files to Git.

### 4. Start the Frontend

From the project root:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

### 5. Start the RAG Backend

Open a second terminal:

```bash
cd rag-service
```

Activate the Python virtual environment and install the required dependencies.

Then start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "visualai-rag"
}
```

---

## Example

Ask:

```text
What is Retrieval-Augmented Generation?
```

VisualAI processes the question through:

```text
Query
  |
  v
BGE Embedding
  |
  v
FAISS Top-10 Retrieval
  |
  v
Cross-Encoder Reranking
  |
  v
Top-3 Context
  |
  v
Grounded LLM
  |
  v
Answer + Sources
```

The frontend then visualizes the pipeline and displays the retrieved sources.

For a question outside the knowledge base, the system can return:

```text
I don't have enough information in the provided knowledge base.
```

instead of generating an unsupported answer.

---

## Grounding and Source Attribution

Each retrieved chunk maintains metadata including:

```text
Source
Page
Chunk ID
```

This metadata is passed through the retrieval and generation pipeline.

Generated answers can therefore reference their supporting material using citations such as:

```text
[Source: rag.pdf, p. 1]
```

This provides traceability between the generated answer and the retrieved document content.

---

## Current Knowledge Base

The current prototype uses a small local knowledge base focused on RAG-related material.

The current indexed documents include:

```text
rag.pdf
dpr.pdf
```

The knowledge base is intentionally kept small for the prototype and evaluation workflow.

---

## Current Limitations

VisualAI is currently a portfolio/MVP implementation and has several limitations:

- The knowledge base is currently a small local document collection.
- The RAG service runs locally.
- PDF ingestion currently focuses on text extraction.
- Scanned PDF/OCR processing is not currently implemented.
- The visualization library currently supports a limited number of concepts.
- The application is not yet optimized for production-scale document collections.
- Authentication and multi-user access control are not currently implemented.

---

## Future Improvements

Potential future improvements include:

- Hybrid BM25 + semantic retrieval
- Larger document collections
- OCR support for scanned PDFs
- Streaming LLM responses
- Multi-turn conversations
- Multi-document knowledge bases
- Duplicate chunk detection
- Dockerized deployment
- Cloud deployment
- Additional AI/ML visualizations
- Automated retrieval evaluation
- More advanced visualization planning

---

## Project Status

**MVP Complete**

The current implementation demonstrates an end-to-end AI application combining:

- Retrieval-Augmented Generation
- Semantic vector search
- FAISS retrieval
- Cross-encoder reranking
- Grounded LLM generation
- Source attribution
- No-answer handling
- FastAPI backend
- Next.js frontend
- Deterministic visualization
- Interactive timeline-based rendering

The project is designed as a demonstration of how **AI reasoning, retrieval, backend services, and interactive frontend visualization can be combined into a single AI application.**

---

## Author

**Mahesh**

AI/ML Engineer | GenAI | RAG | Python | Next.js | MLOps

---

## License

This project is intended for educational and portfolio purposes.
