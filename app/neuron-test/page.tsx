"use client";

import { useEffect, useState } from "react";
import NeuronScene from "@/visualizations/scenes/NeuronScene";

const TOTAL_TIME = 7;

export default function NeuronTestPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setCurrentTime((time) => {
        if (time >= TOTAL_TIME) {
          setPlaying(false);
          return time;
        }

        return time + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playing]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-10 text-center">
          <div className="text-sm uppercase tracking-widest text-blue-400">
            Deep Learning
          </div>

          <h1 className="mt-3 text-4xl font-bold">
            Inside a Neuron
          </h1>

          <p className="mt-3 text-gray-400">
            Watch a neuron transform inputs into an output.
          </p>
        </div>

        {/* VISUALIZATION */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <NeuronScene
            currentTime={currentTime}
          />
        </div>

        {/* TIMELINE */}

        <div className="mx-auto mt-8 max-w-5xl">

          <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-500"
              style={{
                width: `${(currentTime / TOTAL_TIME) * 100}%`,
              }}
            />
          </div>

          {/* CONTROLS */}

          <div className="flex items-center justify-center gap-4">

            <button
              type="button"
              onClick={() =>
                setCurrentTime((time) =>
                  Math.max(0, time - 1)
                )
              }
              className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentTime >= TOTAL_TIME) {
                  setCurrentTime(0);
                }

                setPlaying((value) => !value);
              }}
              className="rounded-xl bg-blue-500 px-6 py-2 font-medium hover:bg-blue-400"
            >
              {playing ? "Pause" : "▶ Play"}
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentTime((time) =>
                  Math.min(TOTAL_TIME, time + 1)
                )
              }
              className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5"
            >
              →
            </button>

          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            {currentTime}s / {TOTAL_TIME}s
          </div>

        </div>

      </div>

    </main>
  );
}