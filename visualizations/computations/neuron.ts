export type NeuronComputation = {
  inputs: number[];
  weights: number[];
  products: number[];
  sum: number;
  output: number;
};

export function computeNeuron(
  inputs: number[],
  weights: number[]
): NeuronComputation {
  if (inputs.length !== weights.length) {
    throw new Error(
      "Inputs and weights must have the same length."
    );
  }

  const products = inputs.map(
    (input, index) => input * weights[index]
  );

  const sum = products.reduce(
    (total, value) => total + value,
    0
  );

  // ReLU
  const output = Math.max(0, sum);

  return {
    inputs,
    weights,
    products,
    sum,
    output,
  };
}