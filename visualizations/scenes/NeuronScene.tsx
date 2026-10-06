"use client";

import Value from "@/visualizations/primitives/Value";
import { computeNeuron } from "@/visualizations/computations/neuron";
import { createNeuronTimeline } from "@/visualizations/computations/neuronTimeline";
import {
  isActionActive,
  getActiveAction,
} from "@/visualizations/computations/timelineState";

type Props = {
  currentTime: number;
};

export default function NeuronScene({
  currentTime,
}: Props) {
  // -----------------------------
  // 1. Neuron configuration
  // -----------------------------

  const inputs = [0.8, 0.3, 0.6];

  const weights = [0.4, 0.7, 0.2];

  // -----------------------------
  // 2. Perform computation
  // -----------------------------

  const computation = computeNeuron(
    inputs,
    weights
  );

  // -----------------------------
  // 3. Generate timeline
  // -----------------------------

  const timeline = createNeuronTimeline();

  const productsAction = getActiveAction(
    timeline,
    "products",
    currentTime
  );

  const sumAction = getActiveAction(
    timeline,
    "sum",
    currentTime
  );

  const reluAction = getActiveAction(
    timeline,
    "relu",
    currentTime
  );

  // -----------------------------
  // 4. Determine animation state
  // -----------------------------

  const showInputs = isActionActive(
    timeline,
    "appear",
    "inputs",
    currentTime
  );

  const showWeights = isActionActive(
    timeline,
    "appear",
    "weights",
    currentTime
  );

  const showProducts = isActionActive(
    timeline,
    "appear",
    "products",
    currentTime
  );

  const showSum = isActionActive(
    timeline,
    "appear",
    "sum",
    currentTime
  );

  const showActivation = isActionActive(
    timeline,
    "appear",
    "relu",
    currentTime
  );

  const highlightProducts = isActionActive(
    timeline,
    "highlight",
    "products",
    currentTime
  );

  const highlightSum = isActionActive(
    timeline,
    "highlight",
    "sum",
    currentTime
  );

  const highlightActivation = isActionActive(
    timeline,
    "highlight",
    "relu",
    currentTime
  );

  // -----------------------------
  // 5. Render
  // -----------------------------

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="flex items-center gap-6">

        {/* INPUTS */}

        {showInputs && (
          <div className="flex flex-col gap-4">
            <Value
              label="x₁"
              value={computation.inputs[0]}
            />

            <Value
              label="x₂"
              value={computation.inputs[1]}
            />

            <Value
              label="x₃"
              value={computation.inputs[2]}
            />
          </div>
        )}

        {/* WEIGHTS */}

        {showWeights && (
          <div className="flex flex-col gap-8">
            <span className="text-gray-400">
              × {computation.weights[0]}
            </span>

            <span className="text-gray-400">
              × {computation.weights[1]}
            </span>

            <span className="text-gray-400">
              × {computation.weights[2]}
            </span>
          </div>
        )}

        {/* PRODUCTS */}

        {showProducts && (
          <div className="flex flex-col gap-4">
            <Value
              label="x₁ × w₁"
              value={computation.products[0]}
              highlighted={highlightProducts}
            />

            <Value
              label="x₂ × w₂"
              value={computation.products[1]}
              highlighted={highlightProducts}
            />

            <Value
              label="x₃ × w₃"
              value={computation.products[2]}
              highlighted={highlightProducts}
            />
          </div>
        )}

        {/* SUM */}

        {showSum && (
          <>
            <div className="text-3xl text-gray-500">
              →
            </div>

            <Value
              label="Σ"
              value={computation.sum}
              highlighted={highlightSum}
            />
          </>
        )}

        {/* ACTIVATION */}

        {showActivation && (
          <>
            <div className="text-3xl text-gray-500">
              →
            </div>

            <Value
              label="ReLU"
              value={computation.output}
              highlighted={highlightActivation}
            />
          </>
        )}

      </div>
    </div>
  );
}