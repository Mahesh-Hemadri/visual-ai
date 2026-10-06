"use client";

import NeuronScene from "@/visualizations/scenes/NeuronScene";
import TokenizationScene from "@/visualizations/scenes/TokenizationScene";

type Props = {
  concept: string;
  currentTime: number;
};

export default function SceneRenderer({
  concept,
  currentTime,
}: Props) {
  /*
   * Different scenes currently use different animation controls:
   *
   * NeuronScene      -> currentTime
   * TokenizationScene -> step
   *
   * This component acts as the adapter between the
   * AI-generated concept and the correct visualization.
   */

  switch (concept) {
    case "neuron":
    case "neural_network":
      return (
        <NeuronScene
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
            <div className="mb-4 text-4xl">✦</div>

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