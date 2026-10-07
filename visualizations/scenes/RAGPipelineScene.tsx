"use client";

import { motion } from "motion/react";

type RAGPipelineSceneProps = {
  currentTime: number;
  query?: string;
  retrievedChunks?: Array<{
    source: string;
    page: number;
    faiss_score?: number;
    reranker_score?: number;
  }>;
  answer?: string;
};

const stages = [
  {
    id: "query",
    label: "User Query",
    description: "The question enters the RAG pipeline.",
  },
  {
    id: "embedding",
    label: "Query Embedding",
    description: "The question is converted into a vector representation.",
  },
  {
    id: "retrieval",
    label: "FAISS Retrieval",
    description: "The vector index retrieves candidate chunks.",
  },
  {
    id: "reranking",
    label: "Reranking",
    description: "A cross-encoder scores the retrieved candidates.",
  },
  {
    id: "llm",
    label: "Grounded LLM",
    description: "The model generates an answer using retrieved context.",
  },
  {
    id: "answer",
    label: "Answer + Sources",
    description: "The grounded answer and document sources are shown.",
  },
];

export default function RAGPipelineScene({
  currentTime,
  query = "What type of retriever does RAG use?",
  retrievedChunks = [],
  answer,
}: RAGPipelineSceneProps) {
  const visibleStage = Math.min(
    Math.floor(currentTime / 1.8),
    stages.length - 1
  );

  const showDocuments = currentTime >= 4.5;
  const showReranker = currentTime >= 6.3;
  const showLLM = currentTime >= 8.1;
  const showAnswer = currentTime >= 9.9;

  const chunks = retrievedChunks ?? [];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/20 p-6">
      <div className="mb-8 text-center">
        <div className="text-sm uppercase tracking-[0.2em] text-white/40">
          RAG Pipeline
        </div>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Retrieval-Augmented Generation
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Retrieval → reranking → grounded generation
        </p>
      </div>

      <div className="space-y-5">
        {/* QUERY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: currentTime >= 0 ? 1 : 0,
            y: currentTime >= 0 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 transition-all ${
            visibleStage === 0
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 1
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            User Query
          </div>

          <div className="mt-3 rounded-lg bg-black/30 p-3 text-sm text-white/80">
            {query}
          </div>
        </motion.div>

        {/* EMBEDDING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: currentTime >= 1.8 ? 1 : 0,
            y: currentTime >= 1.8 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 ${
            visibleStage === 1
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 2
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            Query Embedding
          </div>

          <div className="mt-3 rounded-lg bg-black/30 p-4">
            <div className="text-sm font-medium text-white">
                BGE-small-en-v1.5
            </div>

            <div className="mt-2 text-xs text-white/50">
                Query converted into a vector for semantic similarity search.
            </div>

            <div className="mt-3 text-xs text-white/60">
                Embedding dimension:{" "}
                <span className="font-mono text-white">
                384
                </span>
            </div>
            </div>
        </motion.div>

        {/* RETRIEVAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showDocuments ? 1 : 0,
            y: showDocuments ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 ${
            visibleStage === 2
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 3
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            FAISS Retrieval
          </div>

          <p className="mt-2 text-xs text-white/50">
            Candidate document chunks retrieved from the vector index.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {chunks.map((chunk, index) => (
              <motion.div
                key={`${chunk.source}-${chunk.page}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: showDocuments ? 1 : 0,
                  x: showDocuments ? 0 : -20,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                className="rounded-lg border border-white/10 bg-black/20 p-3"
              >
                <div className="text-xs text-white/40">
                  Candidate {index + 1}
                </div>

                <div className="mt-2 text-sm font-medium text-white">
                    {chunk.source}
                    </div>

                    <div className="text-xs text-white/50">
                    Page {chunk.page}
                    </div>

                    {typeof chunk.faiss_score === "number" && (
                    <div className="mt-2 font-mono text-xs text-white/40">
                        FAISS: {chunk.faiss_score.toFixed(4)}
                    </div>
                    )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RERANKING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showReranker ? 1 : 0,
            y: showReranker ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 ${
            visibleStage === 3
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 4
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            Cross-Encoder Reranking
          </div>

          <p className="mt-2 text-xs text-white/50">
            Retrieved candidates are scored for relevance to the query.
          </p>

          <div className="mt-4 space-y-2">
            {chunks.map((chunk, index) => (
              <motion.div
                key={`${chunk.source}-${chunk.page}-rank-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: showReranker ? 1 : 0,
                  x: showReranker ? 0 : -10,
                }}
                transition={{
                  delay: index * 0.12,
                }}
                className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2"
              >
                <div className="text-xs text-white/70">
                  #{index + 1} {chunk.source} · p.{chunk.page}
                </div>

                <div className="font-mono text-xs text-white/40">
                  {typeof chunk.reranker_score === "number"
                    ? chunk.reranker_score.toFixed(2)
                    : "—"}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* LLM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showLLM ? 1 : 0,
            y: showLLM ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 ${
            visibleStage === 4
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 5
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            Grounded LLM
          </div>

          <div className="mt-3 rounded-lg bg-black/30 p-4">
            <div className="text-xs text-white/40">
              Retrieved context
            </div>

            <div className="mt-2 text-xs text-white/60">
              {chunks
                .map(
                  (chunk) =>
                    `${chunk.source}, p.${chunk.page}`
                )
                .join("  ·  ")}
            </div>
          </div>
        </motion.div>

        {/* ANSWER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showAnswer ? 1 : 0,
            y: showAnswer ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border p-4 ${
            visibleStage === 5
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="text-xs text-white/40">
            STEP 6
          </div>

          <div className="mt-1 text-sm font-medium text-white">
            Grounded Answer
          </div>

          <div className="mt-3 rounded-lg bg-black/30 p-4 text-sm leading-6 text-white/80">
            {answer ||
              "RAG uses a dense retriever based on Dense Passage Retrieval (DPR)."}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chunks.map((chunk, index) => (
              <div
                key={`${chunk.source}-${chunk.page}-source-${index}`}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50"
              >
                {chunk.source} · p.{chunk.page}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}