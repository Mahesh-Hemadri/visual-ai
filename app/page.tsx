"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");

  const concepts = [
    "Neural Networks",
    "Transformers",
    "Backpropagation",
    "CNNs",
    "Attention",
    "Gradient Descent",
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">
          Visual<span className="text-blue-400">AI</span>
        </div>

        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">
            Learn
          </a>
          <a href="#" className="hover:text-white">
            Explore
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center">
        <div className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
          Interactive AI learning
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Understand AI
          <br />
          <span className="text-blue-400">visually.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Don't just read how AI works. Explore it, visualize it, and
          understand what is happening under the hood.
        </p>

        {/* Input */}
        <div className="mt-12 w-full">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to understand?"
              rows={3}
              className="w-full resize-none bg-transparent px-4 py-3 text-lg outline-none placeholder:text-gray-600"
            />

            <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Level selector */}
              <div className="flex gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLevel(item)}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      level === item
                        ? "bg-white text-black"
                        : "text-gray-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Visualize button */}
              <button
                type="button"
                onClick={() => {
                  const concept = topic.trim() || "neural-network";

                  router.push(
                    `/visualize?concept=${encodeURIComponent(concept)}`
                  );
                }}
                className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400"
              >
                Visualize →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular concepts */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-24">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Popular concepts</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start with one of these.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <button
              key={concept}
              type="button"
              onClick={() => setTopic(`Explain ${concept}`)}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{concept}</span>
                <span className="text-gray-600 transition group-hover:text-blue-400">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}