export type AIVisualizationSpec = {
  title: string;
  explanation: string;
  concept:
    | "neuron"
    | "tokenization"
    | "neural_network"
    | "attention"
    | "gradient_descent";

  steps: {
    title: string;
    description: string;
  }[];
};