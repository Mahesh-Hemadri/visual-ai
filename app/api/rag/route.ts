import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = "http://127.0.0.1:8000/api/rag";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const query = body?.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 }
      );
    }

    const response = await fetch(RAG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.detail || "RAG service failed.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("RAG API error:", error);

    return NextResponse.json(
      {
        error: "Unable to connect to the RAG service.",
      },
      { status: 500 }
    );
  }
}