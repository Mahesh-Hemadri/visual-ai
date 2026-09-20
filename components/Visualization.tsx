"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Visualization } from "@/types/visualization";
import Token from "@/visualizations/primitives/Token";
import Arrow from "@/visualizations/primitives/Arrow";

type Props = {
  visualization: Visualization;
};

export default function VisualizationViewer({
  visualization,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = visualization.steps[currentStep];

  const nextStep = () => {
    if (currentStep < visualization.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <section className="mx-auto mt-12 max-w-5xl px-6 pb-20">

      {/* Header */}

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">
          {visualization.title}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-gray-400">
          {visualization.subtitle}
        </p>
      </div>

      {/* Progress */}

      <div className="mb-8 flex justify-center gap-2">
        {visualization.steps.map((item, index) => (
          <motion.div
            key={item.id}
            animate={{
              scaleX: index === currentStep ? 1.15 : 1,
            }}
            className={`h-1.5 w-16 origin-center rounded-full ${
              index <= currentStep
                ? "bg-blue-400"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Main visualization card */}

      <div className="min-h-[350px] rounded-2xl border border-white/10 bg-white/[0.03] p-8">

        {/* Step information */}

        <div className="mb-8">
          <div className="text-sm text-blue-400">
            STEP {currentStep + 1}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <h2 className="mt-2 text-2xl font-semibold">
                {step.title}
              </h2>

              <p className="mt-2 max-w-2xl text-gray-400">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visualization area */}

        <div className="flex min-h-[180px] items-center justify-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.35,
              }}
              className="flex w-full flex-col items-center gap-6"
            >

              {step.elements.map((element, index) => {

                if (element.type === "text") {
                  return (
                    <div
                      key={element.id}
                      className="rounded-xl border border-white/10 bg-black/30 px-8 py-5 text-2xl"
                    >
                      {element.label}
                    </div>
                  );
                }

                if (element.type === "token") {
                  return (
                    <Token
                      key={element.id}
                      value={element.label}
                      index={index}
                    />
                  );
                }

                if (element.type === "number") {
                  return (
                    <div
                      key={element.id}
                      className="flex items-center gap-3"
                    >

                      <div className="rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-blue-200">
                        {element.label}
                      </div>

                      <Arrow direction="right" />

                      <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 px-5 py-3 text-purple-200">
                        {element.value}
                      </div>

                    </div>
                  );
                }

                return null;
              })}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Controls */}

      <div className="mt-6 flex items-center justify-between">

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={previousStep}
          disabled={currentStep === 0}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </motion.button>

        <div className="text-sm text-gray-500">
          {currentStep + 1} / {visualization.steps.length}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          disabled={
            currentStep === visualization.steps.length - 1
          }
          className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next →
        </motion.button>

      </div>

    </section>
  );
}