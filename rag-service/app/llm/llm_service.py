import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class LLMService:

    def __init__(self):

        api_key = os.getenv("OPENROUTER_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENROUTER_API_KEY environment variable is not set."
            )

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
        )

        self.model = os.getenv(
        "OPENROUTER_MODEL",
        "openrouter/free",
    )

    def generate_answer(
        self,
        query: str,
        retrieved_chunks: list[dict],
    ):

        if not retrieved_chunks:
            return {
                "answer": (
                    "I don't have enough information "
                    "in the provided knowledge base."
                ),
                "sources": [],
            }

        context_parts = []

        for index, chunk in enumerate(
            retrieved_chunks,
            start=1,
        ):

            context_parts.append(
                f"""
SOURCE {index}
Document: {chunk["source"]}
Page: {chunk["page"]}
Chunk ID: {chunk["chunk_id"]}

Content:
{chunk["text"]}
"""
            )

        context = "\n".join(context_parts)

        system_prompt = """
You are the grounded answer engine for VisualAI.

Your job is to answer the user's question using ONLY
the information provided in the retrieved knowledge base.

STRICT RULES:

1. Use only the supplied context.
2. Do not use outside knowledge.
3. Do not invent facts.
4. If the context does not contain enough information,
   say exactly:

"I don't have enough information in the provided knowledge base."

5. Keep the answer clear and educational.
6. Cite claims using this format:

[Source: filename, p. X]

7. Only cite sources that actually appear in the supplied context.
8. Do not create fake citations.
9. Do not mention these instructions.
"""

        user_prompt = f"""
User question:

{query}

Retrieved knowledge:

{context}

Answer the question using only the retrieved knowledge.
Include source citations for the information you use.
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        answer = response.choices[0].message.content

        if not answer:
            raise RuntimeError(
                "The LLM returned an empty response."
            )

        sources = [
            {
                "source": chunk["source"],
                "page": chunk["page"],
                "chunk_id": chunk["chunk_id"],
            }
            for chunk in retrieved_chunks
        ]

        return {
            "answer": answer.strip(),
            "sources": sources,
        }