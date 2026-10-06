import { TimelineAction } from "@/types/visualization";

export function createNeuronTimeline(): TimelineAction[] {
  return [
    {
      at: 0,
      action: "appear",
      target: "inputs",
    },

    {
      at: 1,
      action: "appear",
      target: "weights",
    },

    {
      at: 2,
      action: "calculate",
      target: "products",
      duration: 1,
    },

    {
      at: 3,
      action: "appear",
      target: "products",
    },

    {
      at: 4,
      action: "calculate",
      target: "sum",
      duration: 1,
    },

    {
      at: 5,
      action: "appear",
      target: "sum",
    },

    {
      at: 6,
      action: "calculate",
      target: "relu",
      duration: 1,
    },

    {
      at: 7,
      action: "appear",
      target: "relu",
    },
  ];
}