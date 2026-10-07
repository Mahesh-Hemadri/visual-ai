"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import SceneRenderer from "@/components/SceneRenderer";

type RAGData = {
  query: string;
  answer: string;
  retrieved_chunks: {
    rank: number;
    source: string;
    page: number;
    chunk_id: string;
    faiss_score: number;
    reranker_score: number;
  }[];
  sources: {
    source: string;
    page: number;
    chunk_id: string;
  }[];
};
type VisualizationResult = {
  title: string;
  explanation: string;
  concept:
    | "neuron"
    | "tokenization"
    | "neural_network"
    | "attention"
    | "gradient_descent"
    | "rag";

  steps: {
    title: string;
    description: string;
  }[];
};

export default function VisualizePage() {
  const searchParams = useSearchParams();

  const topic =
  searchParams.get("concept") ||
  searchParams.get("topic") ||
  "Neural Networks";

  const level =
    searchParams.get("level") || "Beginner";

  const [result, setResult] =
    useState<VisualizationResult | null>(null);

  const [ragData, setRagData] =
    useState<RAGData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [currentTime, setCurrentTime] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  /*
   * Maximum duration of our current animation.
   *
   * NeuronScene:
   * 0 → 7 seconds
   *
   * Tokenization:
   * 0 → 4 seconds
   */

  const maxTime =
  result?.concept === "tokenization"
    ? 4
    : result?.concept === "rag"
      ? 12
      : 7;

  /*
   * Generate visualization specification
   */

  useEffect(() => {
    async function generateVisualization() {
      try {
        setLoading(true);
        setError("");
        setResult(null);
        setCurrentTime(0);
        setPlaying(false);
        setRagData(null);

        

        const response = await fetch(
          "/api/visualize",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              topic,
              level,
            }),
          }
        );

        const data = await response.json();
        

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to generate visualization."
          );
        }

        setResult(data);
        if (data.concept === "rag") {
  const ragResponse = await fetch("/api/rag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:
        topic.trim().toLowerCase() === "rag"
          ? "What is Retrieval-Augmented Generation?"
          : topic,
    }),
  });

  const ragDataResponse = await ragResponse.json();

  if (!ragResponse.ok) {
    throw new Error(
      ragDataResponse.error ||
        "Failed to run the RAG pipeline."
    );
  }

  setRagData(ragDataResponse);
}
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    generateVisualization();
  }, [topic, level]);

  /*
   * Animation loop
   */

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((previous) => {
        const next = previous + 0.1;

        if (next >= maxTime) {
          setPlaying(false);

          return maxTime;
        }

        return next;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [playing, maxTime]);

  /*
   * Controls
   */

  function togglePlay() {
    if (currentTime >= maxTime) {
      setCurrentTime(0);
      setPlaying(true);
      return;
    }

    setPlaying((previous) => !previous);
  }

  function resetAnimation() {
    setPlaying(false);
    setCurrentTime(0);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← VisualAI
          </Link>

          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
            {level}
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

              <h2 className="text-xl font-semibold">
                Building your visualization...
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Understanding "{topic}"
              </p>

            </div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <h2 className="text-xl font-semibold">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              {error}
            </p>

          </div>
        )}

        {/* Result */}

        {!loading && result && (
          <>
            {/* Title */}

            <div className="mb-8">

              <div className="text-sm uppercase tracking-widest text-blue-400">
                {result.concept.replace(
                  "_",
                  " "
                )}
              </div>

              <h1 className="mt-3 text-4xl font-bold">
                {result.title}
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                {result.explanation}
              </p>

            </div>

            {/* Visualization */}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

              {/* Timeline controls */}

              <div className="border-b border-white/10 px-5 py-4">

                <div className="flex items-center gap-4">

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                  >
                    {playing
                      ? "Pause"
                      : currentTime >= maxTime
                        ? "Replay"
                        : "Play"}
                  </button>

                  <button
                    type="button"
                    onClick={resetAnimation}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Reset
                  </button>

                  <input
                    type="range"
                    min="0"
                    max={maxTime}
                    step="0.1"
                    value={currentTime}
                    onChange={(event) => {
                      setPlaying(false);

                      setCurrentTime(
                        Number(event.target.value)
                      );
                    }}
                    className="flex-1"
                  />

                  <span className="min-w-[70px] text-right text-xs text-gray-500">
                    {currentTime.toFixed(1)}s
                  </span>

                </div>

              </div>

              {/* Visualization */}

              <div className="min-h-[500px]">
                <SceneRenderer
                  concept={result.concept}
                  currentTime={currentTime}
                  ragData={ragData ?? undefined}
                />
              </div>

            </div>

              

            {/* Explanation */}

            <div className="mt-10">

              <h2 className="mb-5 text-xl font-semibold">
                How it works
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {(result.steps ?? []).map(
                  (step, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                    >

                      <div className="mb-3 text-sm text-blue-400">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <h3 className="font-medium">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {step.description}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </>
        )}

      </div>
    </main>
  );
}