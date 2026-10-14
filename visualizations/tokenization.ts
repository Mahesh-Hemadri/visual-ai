
import type { Visualization } from "@/types/visualization";

export const tokenizationVisualization: Visualization = {
  title: "How Tokenization Works",
  subtitle:
    "An LLM doesn't read text directly. It converts text into smaller pieces called tokens.",

  scenes: [
    {
      objects: [
        {
          id: "sentence",
          type: "text",
          label: "The cat is sleeping",
        },
      ],
      timeline: [
        { at: 0, action: "appear", target: "sentence" },
      ],
    },

    {
      objects: [
        { id: "token-the", type: "token", label: "The" },
        { id: "token-cat", type: "token", label: "cat" },
        { id: "token-is", type: "token", label: "is" },
        { id: "token-sleep", type: "token", label: "sleep" },
        { id: "token-ing", type: "token", label: "ing" },
      ],
      timeline: [
        { at: 0, action: "appear", target: "token-the" },
        { at: 0.5, action: "appear", target: "token-cat" },
        { at: 1, action: "appear", target: "token-is" },
        { at: 1.5, action: "appear", target: "token-sleep" },
        { at: 2, action: "appear", target: "token-ing" },
      ],
    },

    {
      objects: [
        { id: "id-the", type: "number", label: "The", value: 464 },
        { id: "id-cat", type: "number", label: "cat", value: 3797 },
        { id: "id-is", type: "number", label: "is", value: 318 },
        { id: "id-sleep", type: "number", label: "sleep", value: 535 },
        { id: "id-ing", type: "number", label: "ing", value: 278 },
      ],
      timeline: [
        { at: 0, action: "appear", target: "id-the" },
        { at: 0.5, action: "appear", target: "id-cat" },
        { at: 1, action: "appear", target: "id-is" },
        { at: 1.5, action: "appear", target: "id-sleep" },
        { at: 2, action: "appear", target: "id-ing" },
      ],
    },
  ],
};
