import { VisualObject } from "@/types/visualization";

type LayerConfig = {
  id: string;
  label: string;
  neurons: number;
  x: number;
};

export function createNeuralNetwork(
  layers: LayerConfig[]
): VisualObject[] {
  const objects: VisualObject[] = [];

  const neuronSpacing = 80;
  const startY = 100;

  layers.forEach((layer) => {
    const totalHeight =
      (layer.neurons - 1) * neuronSpacing;

    const layerStartY =
      startY + (300 - totalHeight) / 2;

    for (let i = 0; i < layer.neurons; i++) {
      objects.push({
        id: `${layer.id}-${i}`,
        type: "node",
        label: `${layer.label} ${i + 1}`,
        position: {
          x: layer.x,
          y: layerStartY + i * neuronSpacing,
        },
      });
    }
  });

  return objects;
}

export function createFullyConnectedLayers(
  layers: LayerConfig[]
) {
  const connections: {
    from: string;
    to: string;
  }[] = [];

  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentLayer = layers[layerIndex];
    const nextLayer = layers[layerIndex + 1];

    for (let i = 0; i < currentLayer.neurons; i++) {
      for (let j = 0; j < nextLayer.neurons; j++) {
        connections.push({
          from: `${currentLayer.id}-${i}`,
          to: `${nextLayer.id}-${j}`,
        });
      }
    }
  }

  return connections;
}
export function getLayerNeuronIds(
  layer: LayerConfig
): string[] {
  return Array.from(
    { length: layer.neurons },
    (_, index) => `${layer.id}-${index}`
  );
}