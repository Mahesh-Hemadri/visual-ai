import { Visualization } from "@/types/visualization";

export const tokenizationVisualization: Visualization = {
  title: "How Tokenization Works",

  subtitle:
    "An LLM doesn't read text directly. It converts text into smaller pieces called tokens.",

  steps: [
    {
      id: "text",
      title: "Start with text",

      description:
        "We begin with a normal sentence that a human can read.",

      elements: [
        {
          id: "sentence",
          type: "text",
          label: "The cat is sleeping",
        },
      ],
    },

    {
      id: "tokens",
      title: "Split the text into tokens",

      description:
        "The tokenizer breaks the sentence into smaller pieces called tokens.",

      elements: [
        {
          id: "token-the",
          type: "token",
          label: "The",
        },
        {
          id: "token-cat",
          type: "token",
          label: "cat",
        },
        {
          id: "token-is",
          type: "token",
          label: "is",
        },
        {
          id: "token-sleep",
          type: "token",
          label: "sleep",
        },
        {
          id: "token-ing",
          type: "token",
          label: "ing",
        },
      ],
    },

    {
      id: "ids",
      title: "Convert tokens into IDs",

      description:
        "Each token is mapped to a numerical ID from the model's vocabulary.",

      elements: [
        {
          id: "id-the",
          type: "number",
          label: "The",
          value: 464,
        },
        {
          id: "id-cat",
          type: "number",
          label: "cat",
          value: 3797,
        },
        {
          id: "id-is",
          type: "number",
          label: "is",
          value: 318,
        },
        {
          id: "id-sleep",
          type: "number",
          label: "sleep",
          value: 535,
        },
        {
          id: "id-ing",
          type: "number",
          label: "ing",
          value: 278,
        },
      ],
    },
  ],
};