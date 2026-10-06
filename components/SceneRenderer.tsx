"use client";

import NeuronScene from "@/visualizations/scenes/NeuronScene";
import NeuralNetworkScene from "@/visualizations/scenes/NeuralNetworkScene";
import TokenizationScene from "@/visualizations/scenes/TokenizationScene";

type Props = {
  concept: string;
  currentTime: number;
};

export default function SceneRenderer({
  concept,
  currentTime,
}: Props) {
  const normalizedConcept = concept
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  switch (normalizedConcept) {
    case "neuron":
      return (
        <NeuronScene
          currentTime={currentTime}
        />
      );

    case "neural_network":
      return (
        <NeuralNetworkScene
          currentTime={currentTime}
        />
      );

    case "tokenization": {
      let step = 0;

      if (currentTime >= 2) {
        step = 1;
      }

      if (currentTime >= 4) {
        step = 2;
      }

      return (
        <TokenizationScene
          step={step}
        />
      );
    }

    default:
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl">
              ✦
            </div>

            <h2 className="text-xl font-semibold">
              Visualization coming soon
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              We understand this concept, but the
              visual scene has not been built yet.
            </p>
          </div>
        </div>
      );
  }
}