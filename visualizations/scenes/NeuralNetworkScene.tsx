"use client";

type Props = {
  currentTime: number;
};

type Point = {
  x: number;
  y: number;
};

const inputValues = [0.8, 0.3, 0.6];

const inputNodes: Point[] = [
  { x: 100, y: 100 },
  { x: 100, y: 180 },
  { x: 100, y: 260 },
];

const hiddenNodes: Point[] = [
  { x: 300, y: 70 },
  { x: 300, y: 140 },
  { x: 300, y: 210 },
  { x: 300, y: 280 },
];

const outputNodes: Point[] = [
  { x: 500, y: 175 },
];

// Simple illustrative weights for the educational visualization.
const inputToHiddenWeights = [
  [0.5, 0.2, 0.1],
  [0.2, 0.6, 0.3],
  [0.1, 0.3, 0.7],
  [0.4, 0.2, 0.5],
];

const hiddenToOutputWeights = [0.4, 0.3, 0.5, 0.2];

function relu(value: number) {
  return Math.max(0, value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolate(
  from: Point,
  to: Point,
  progress: number
): Point {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

export default function NeuralNetworkScene({
  currentTime,
}: Props) {
  // --------------------------------
  // 1. Forward-pass computation
  // --------------------------------

  const hiddenValues = inputToHiddenWeights.map((weights) => {
    const weightedSum = weights.reduce(
      (sum, weight, index) =>
        sum + inputValues[index] * weight,
      0
    );

    return relu(weightedSum);
  });

  const outputSum = hiddenValues.reduce(
    (sum, value, index) =>
      sum + value * hiddenToOutputWeights[index],
    0
  );

  const outputValue = relu(outputSum);

  // --------------------------------
  // 2. Timeline phases
  // --------------------------------

  const showInputs = currentTime >= 0.5;
  const showHidden = currentTime >= 2;
  const showOutput = currentTime >= 4;

  const inputFlowProgress = clamp(
    (currentTime - 1) / 1,
    0,
    1
  );

  const hiddenFlowProgress = clamp(
    (currentTime - 3) / 1,
    0,
    1
  );

  const inputToHiddenFlow =
    currentTime >= 1 && currentTime < 2;

  const hiddenToOutputFlow =
    currentTime >= 3 && currentTime < 4;

  const allComplete = currentTime >= 4;

  return (
    <div className="flex min-h-[520px] items-center justify-center">
      <div className="w-full max-w-3xl">

        {/* Explanation */}
        <div className="mb-5 text-center">
          <p className="text-sm text-gray-500">
            {currentTime < 1
              ? "Input data enters the network"
              : currentTime < 2
              ? "Signals travel through the first layer"
              : currentTime < 3
              ? "Hidden neurons process the information"
              : currentTime < 4
              ? "The hidden representation moves toward the output"
              : "The network produces its prediction"}
          </p>
        </div>

        {/* Network */}
        <div className="relative mx-auto h-[360px] w-[620px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

          <svg
            viewBox="0 0 620 360"
            className="absolute inset-0 h-full w-full"
          >
            {/* -------------------------------- */}
            {/* Input → Hidden connections */}
            {/* -------------------------------- */}

            {inputNodes.map((input, inputIndex) =>
              hiddenNodes.map((hidden, hiddenIndex) => {
                const active =
                  showInputs &&
                  (showHidden || inputToHiddenFlow);

                return (
                  <line
                    key={`input-${inputIndex}-hidden-${hiddenIndex}`}
                    x1={input.x}
                    y1={input.y}
                    x2={hidden.x}
                    y2={hidden.y}
                    stroke="currentColor"
                    strokeWidth={
                      active ? 1.8 : 1
                    }
                    className={
                      active
                        ? "text-blue-400/50"
                        : "text-white/10"
                    }
                  />
                );
              })
            )}

            {/* -------------------------------- */}
            {/* Hidden → Output connections */}
            {/* -------------------------------- */}

            {hiddenNodes.map((hidden, hiddenIndex) => {
              const active =
                showHidden &&
                (showOutput || hiddenToOutputFlow);

              return (
                <line
                  key={`hidden-output-${hiddenIndex}`}
                  x1={hidden.x}
                  y1={hidden.y}
                  x2={outputNodes[0].x}
                  y2={outputNodes[0].y}
                  stroke="currentColor"
                  strokeWidth={
                    active ? 1.8 : 1
                  }
                  className={
                    active
                      ? "text-blue-400/50"
                      : "text-white/10"
                  }
                />
              );
            })}

            {/* -------------------------------- */}
            {/* Animated input signal */}
            {/* -------------------------------- */}

            {inputToHiddenFlow &&
              inputNodes.map((input, inputIndex) => {
                const target =
                  hiddenNodes[inputIndex];

                const point = interpolate(
                  input,
                  target,
                  inputFlowProgress
                );

                return (
                  <circle
                    key={`input-signal-${inputIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    className="fill-blue-400"
                  />
                );
              })}

            {/* -------------------------------- */}
            {/* Animated hidden signal */}
            {/* -------------------------------- */}

            {hiddenToOutputFlow &&
              hiddenNodes.map((hidden, hiddenIndex) => {
                const point = interpolate(
                  hidden,
                  outputNodes[0],
                  hiddenFlowProgress
                );

                return (
                  <circle
                    key={`hidden-signal-${hiddenIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    className="fill-blue-400"
                  />
                );
              })}
          </svg>

          {/* -------------------------------- */}
          {/* Input nodes */}
          {/* -------------------------------- */}

          {inputNodes.map((node, index) => (
            <div
              key={`input-node-${index}`}
              className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
                showInputs
                  ? "border-blue-400/60 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.15)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
              style={{
                left: `${(node.x / 620) * 100}%`,
                top: `${(node.y / 360) * 100}%`,
              }}
            >
              <span className="text-sm font-semibold">
                {inputValues[index].toFixed(1)}
              </span>
            </div>
          ))}

          {/* -------------------------------- */}
          {/* Hidden nodes */}
          {/* -------------------------------- */}

          {hiddenNodes.map((node, index) => (
            <div
              key={`hidden-node-${index}`}
              className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
                showHidden
                  ? "border-purple-400/60 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
              style={{
                left: `${(node.x / 620) * 100}%`,
                top: `${(node.y / 360) * 100}%`,
              }}
            >
              <span className="text-sm font-semibold">
                {showHidden
                  ? hiddenValues[index].toFixed(2)
                  : "·"}
              </span>
            </div>
          ))}

          {/* -------------------------------- */}
          {/* Output node */}
          {/* -------------------------------- */}

          <div
            className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
              showOutput
                ? "border-green-400/70 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                : "border-white/10 bg-white/[0.02]"
            }`}
            style={{
              left: `${(outputNodes[0].x / 620) * 100}%`,
              top: `${(outputNodes[0].y / 360) * 100}%`,
            }}
          >
            <span className="text-sm font-semibold">
              {showOutput
                ? outputValue.toFixed(2)
                : "·"}
            </span>
          </div>

          {/* Layer labels */}

          <div
            className="absolute text-xs font-medium uppercase tracking-wider text-gray-500"
            style={{
              left: "6%",
              bottom: "8%",
            }}
          >
            Input
          </div>

          <div
            className="absolute text-xs font-medium uppercase tracking-wider text-gray-500"
            style={{
              left: "42%",
              bottom: "8%",
            }}
          >
            Hidden
          </div>

          <div
            className="absolute text-xs font-medium uppercase tracking-wider text-gray-500"
            style={{
              right: "5%",
              bottom: "8%",
            }}
          >
            Output
          </div>
        </div>

        {/* Computation summary */}

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div
            className={`rounded-xl border p-4 text-center transition ${
              showInputs
                ? "border-blue-400/30 bg-blue-500/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Input
            </p>
            <p className="mt-1 text-sm text-gray-300">
              3 values
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 text-center transition ${
              showHidden
                ? "border-purple-400/30 bg-purple-500/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Hidden
            </p>
            <p className="mt-1 text-sm text-gray-300">
              4 neurons
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 text-center transition ${
              showOutput
                ? "border-green-400/30 bg-green-500/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Prediction
            </p>
            <p className="mt-1 text-sm text-gray-300">
              {allComplete
                ? outputValue.toFixed(2)
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}