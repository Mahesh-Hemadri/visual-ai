import { Visualization } from "@/types/visualization";
import {
  createNeuralNetwork,
  createFullyConnectedLayers,
} from "@/visualizations/neuralNetwork";

const layers = [
  {
    id: "input",
    label: "Input",
    neurons: 4,
    x: 100,
  },
  {
    id: "hidden1",
    label: "Hidden",
    neurons: 6,
    x: 350,
  },
  {
    id: "hidden2",
    label: "Hidden",
    neurons: 6,
    x: 600,
  },
  {
    id: "output",
    label: "Output",
    neurons: 3,
    x: 850,
  },
];

const neurons = createNeuralNetwork(layers);

const connections = createFullyConnectedLayers(layers);

export const testVisualization: Visualization = {
  title: "Deep Neural Network",
  subtitle:
    "A network generated dynamically from layer definitions.",

  scenes: [
    {
      objects: neurons,

      timeline: [
        {
          at: 0,
          action: "appear",
          target: "input-0",
        },

        {
          at: 1,
          action: "appear",
          target: "input-1",
        },

        {
          at: 2,
          action: "appear",
          target: "input-2",
        },

        {
          at: 3,
          action: "appear",
          target: "input-3",
        },

        ...neurons
          .filter((neuron) =>
            neuron.id.startsWith("hidden1")
          )
          .map((neuron) => ({
            at: 4,
            action: "appear" as const,
            target: neuron.id,
          })),

        ...neurons
          .filter((neuron) =>
            neuron.id.startsWith("hidden2")
          )
          .map((neuron) => ({
            at: 5,
            action: "appear" as const,
            target: neuron.id,
          })),

        ...neurons
          .filter((neuron) =>
            neuron.id.startsWith("output")
          )
          .map((neuron) => ({
            at: 6,
            action: "appear" as const,
            target: neuron.id,
          })),

        ...connections.map((connection) => ({
          at: 7,
          action: "connect" as const,
          from: connection.from,
          to: connection.to,
        })),

        {
          at: 8,
          action: "flow",
          from: "input-0",
          to: "hidden1-0",
        },

        {
          at: 9,
          action: "highlight",
          target: "hidden1-0",
        },

        {
          at: 10,
          action: "flow",
          from: "hidden1-0",
          to: "hidden2-0",
        },

        {
          at: 11,
          action: "highlight",
          target: "hidden2-0",
        },

        {
          at: 12,
          action: "flow",
          from: "hidden2-0",
          to: "output-0",
        },

        {
          at: 13,
          action: "highlight",
          target: "output-0",
        },
      ],
    },
  ],
};