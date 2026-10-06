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

if (!content) {
  throw new Error(
    "The model returned an empty response."
  );
}

// The free model may occasionally add text before/after
// the JSON. Extract the JSON object before parsing it.
const jsonStart = content.indexOf("{");
const jsonEnd = content.lastIndexOf("}");

if (jsonStart === -1 || jsonEnd === -1) {
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