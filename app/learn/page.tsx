"use client";

import { useEffect, useState } from "react";
import TokenizationScene from "@/visualizations/scenes/TokenizationScene";
import TimelineControls from "@/components/TimelineControls";

const steps = [
  {
    title: "Start with text",
    description:
      "An LLM receives text, but the model cannot process raw words directly.",
  },
  {
    title: "Break text into tokens",
    description:
      "The tokenizer splits the text into smaller pieces called tokens.",
  },
  {
    title: "Convert tokens into IDs",
    description:
      "Each token is mapped to a number from the model's vocabulary.",
  },
];

export default function LearnPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const nextStep = () => {
    setCurrentStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );
  };

  const previousStep = () => {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const playPause = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
      setPlaying(true);
      return;
    }

    setPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setPlaying(false);
          return prev;
        }

        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [playing]);

  const step = steps[currentStep];

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">

      {/* Header */}

      <div className="mx-auto max-w-4xl text-center">

        <div className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
          LLM Fundamentals
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          How Tokenization Works
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-400">
          Watch how a sentence transforms into the numerical
          representation an LLM can process.
        </p>

      </div>

      {/* Step description */}

      <div className="mx-auto mt-12 max-w-4xl text-center">

        <div className="text-sm text-blue-400">
          STEP {currentStep + 1}
        </div>

        <h2 className="mt-2 text-2xl font-semibold">
          {step.title}
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-gray-400">
          {step.description}
        </p>

      </div>

      {/* Scene */}

      <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">

        <TokenizationScene
          step={currentStep}
        />

      </div>

      {/* Timeline */}

      <TimelineControls
        currentStep={currentStep}
        totalSteps={steps.length}
        playing={playing}
        onPrevious={previousStep}
        onNext={nextStep}
        onPlayPause={playPause}
      />

    </main>
  );
}