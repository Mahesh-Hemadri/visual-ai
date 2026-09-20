"use client";

import { useEffect, useState } from "react";
import SceneRenderer from "@/components/SceneRenderer";
import { testVisualization } from "@/visualizations/testScene";

export default function PlaygroundPage() {
  const scene = testVisualization.scenes[0];

  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setCurrentTime((time) => {
        if (time >= 15) {
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
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Visualization Engine
          </h1>

          <p className="mt-3 text-gray-400">
            Timeline-based AI visualization prototype.
          </p>
        </div>

        <SceneRenderer
          scene={scene}
          currentTime={currentTime}
        />

        <div className="mt-8 flex items-center justify-center gap-4">

          <button
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
            onClick={() => {
              if (currentTime >= 6) {
                setCurrentTime(0);
              }

              setPlaying((value) => !value);
            }}
            className="rounded-xl bg-blue-500 px-6 py-2 font-medium hover:bg-blue-400"
          >
            {playing ? "Pause" : "▶ Play"}
          </button>

          <button
            onClick={() =>
              setCurrentTime((time) =>
                Math.min(15, time + 1)
              )
            }
            className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            →
          </button>

        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Timeline: {currentTime}s
        </div>

      </div>
    </main>
  );
}