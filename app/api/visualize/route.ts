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

Your ONLY job is to return the JSON object required by the
response schema.

DO NOT output:
- safety classifications
- moderation messages
- "User Safety"
- explanations outside the JSON
- Markdown
- code fences
- text before the JSON
- text after the JSON

Return ONLY the JSON object.

VisualAI teaches AI and machine-learning concepts visually.

Given a user's topic, decide which supported visualization
concept best matches the request.

Supported concepts:

- neuron
- tokenization
- neural_network
- attention
- gradient_descent

The response must be technically accurate and appropriate
for the requested learning level.

The visualization system will use the "concept" field to
select the correct animation.

Do not generate React code.
Do not generate HTML.
Do not generate CSS.
Do not invent unsupported visualization types.
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

const result = JSON.parse(jsonContent);

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