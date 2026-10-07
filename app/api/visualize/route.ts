import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const topic = body.topic;
    const level = body.level || "Beginner";

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic is required." },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
        model: "openrouter/free",

      messages: [
        {
          role: "system",
          content: `
You are the planning engine for VisualAI.

Your ONLY job is to return ONE valid JSON object matching the schema.

VisualAI teaches AI and machine-learning concepts visually.

Given the user's topic, choose the best supported visualization concept.

Supported concepts:
- neuron
- tokenization
- neural_network
- attention
- gradient_descent
- rag

The JSON MUST contain:
- title
- explanation
- concept
- steps

"steps" MUST contain 3 to 5 educational steps.

Each step MUST contain:
- title
- description

The title must be the actual topic title.
The explanation must clearly explain the topic at the requested learning level.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT return Markdown.
- Do NOT use code fences.
- Do NOT write "JSON" as the title.
- Do NOT write "No extra text."
- Do NOT include safety classifications.
- Do NOT include "User Safety".
- Do NOT include commentary outside the JSON.
- Do NOT generate React, HTML, or CSS.
- Do NOT invent unsupported visualization types.

Example structure:

{
  "title": "Neural Networks",
  "explanation": "A neural network is a machine learning model made of interconnected layers of neurons.",
  "concept": "neural_network",
  "steps": [
    {
      "title": "Input Layer",
      "description": "The input layer receives the initial data."
    },
    {
      "title": "Hidden Layers",
      "description": "Hidden layers transform the input using learned weights."
    },
    {
      "title": "Output",
      "description": "The output layer produces the final prediction."
    }
  ]
}

Return ONLY the JSON object.
`,
        },
        {
          role: "user",
          content: `Topic: ${topic}
Learning level: ${level}`,
        },
      ],

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "visualization_spec",
          strict: true,
          schema: {
            type: "object",

            properties: {
              title: {
                type: "string",
              },

              explanation: {
                type: "string",
              },

              concept: {
                type: "string",
                enum: [
                  "neuron",
                  "tokenization",
                  "neural_network",
                  "attention",
                  "gradient_descent",
                    "rag",
                ],
              },

              steps: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    title: {
                      type: "string",
                    },

                    description: {
                      type: "string",
                    },
                  },

                  required: [
                    "title",
                    "description",
                  ],

                  additionalProperties: false,
                },
              },
            },

            required: [
              "title",
              "explanation",
              "concept",
              "steps",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const content =
  response.choices[0]?.message?.content;

/*
 * Fallback for RAG.
 *
 * The free model can occasionally return moderation/safety
 * text instead of the requested JSON. Since RAG already has
 * a deterministic visualization scene, we can safely return
 * the RAG specification ourselves.
 */
if (!content) {
  if (topic.toLowerCase().includes("rag")) {
    return NextResponse.json({
      title: "Retrieval-Augmented Generation (RAG)",

      explanation:
        "Retrieval-Augmented Generation (RAG) retrieves relevant information from a knowledge base and provides that context to a language model before generating an answer.",

      concept: "rag",

      steps: [
        {
          title: "User Query",
          description:
            "The user asks a question.",
        },
        {
          title: "Query Embedding",
          description:
            "The question is converted into a numerical vector representation.",
        },
        {
          title: "Vector Retrieval",
          description:
            "FAISS searches the knowledge base for relevant chunks.",
        },
        {
          title: "Reranking",
          description:
            "A cross-encoder reranker scores the retrieved chunks and selects the most relevant ones.",
        },
        {
          title: "Grounded Generation",
          description:
            "The selected context is provided to the language model to generate a grounded answer.",
        },
      ],
    });
  }

  throw new Error(
    "The model returned an empty response."
  );
}

// Extract JSON from the model response.
const jsonStart = content.indexOf("{");
const jsonEnd = content.lastIndexOf("}");

if (jsonStart === -1 || jsonEnd === -1) {
  /*
   * The model returned something like:
   *
   * User Safety: safe
   *
   * instead of JSON.
   *
   * For RAG, use the deterministic fallback.
   */
  if (topic.toLowerCase().includes("rag")) {
    return NextResponse.json({
      title: "Retrieval-Augmented Generation (RAG)",

      explanation:
        "RAG combines information retrieval with language generation. Relevant knowledge is retrieved first and then provided to the language model as context.",

      concept: "rag",

      steps: [
        {
          title: "User Query",
          description:
            "The user asks a question.",
        },
        {
          title: "Query Embedding",
          description:
            "The question is converted into an embedding.",
        },
        {
          title: "FAISS Retrieval",
          description:
            "The vector database retrieves relevant knowledge chunks.",
        },
        {
          title: "Cross-Encoder Reranking",
          description:
            "Retrieved chunks are reranked according to their relevance.",
        },
        {
          title: "Grounded LLM",
          description:
            "The language model generates an answer using the retrieved context.",
        },
      ],
    });
  }

  throw new Error(
    `Model did not return valid JSON: ${content}`
  );
}

const jsonContent = content.slice(
  jsonStart,
  jsonEnd + 1
);

const parsed = JSON.parse(jsonContent);

const result = {
  ...parsed,

  title:
    typeof parsed.title === "string" &&
    parsed.title.trim() &&
    parsed.title.toLowerCase() !== "json"
      ? parsed.title
      : topic,

  explanation:
    typeof parsed.explanation === "string" &&
    parsed.explanation.trim() &&
    parsed.explanation !== "No extra text."
      ? parsed.explanation
      : `An interactive explanation of ${topic}.`,

  steps: Array.isArray(parsed.steps)
    ? parsed.steps
    : [],
};

return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Visualization generation failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate visualization.",
      },
      { status: 500 }
    );
  }
}