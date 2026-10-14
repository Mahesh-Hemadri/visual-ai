
import sys
import types
import unittest
from typing import cast
from unittest.mock import Mock

from fastapi.testclient import TestClient


# --------------------------------------------------
# Mock classes to prevent loading real ML dependencies
# --------------------------------------------------

class FakeRetriever:
    def __init__(self):
        self.retrieve: Mock = Mock()


class FakeLLMService:
    def __init__(self):
        self.generate_answer: Mock = Mock()


# Create stub modules before importing app.main.
retriever_module = types.ModuleType("app.retrieval.retriever")
setattr(retriever_module, "Retriever", FakeRetriever)

llm_module = types.ModuleType("app.llm.llm_service")
setattr(llm_module, "LLMService", FakeLLMService)

sys.modules["app.retrieval.retriever"] = retriever_module
sys.modules["app.llm.llm_service"] = llm_module

from app.main import app, retriever, llm  # noqa: E402


# Explicitly identify these attributes as mocks for Pylance.
retriever_mock = cast(Mock, retriever.retrieve)
llm_mock = cast(Mock, llm.generate_answer)


class TestRAGAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

        # Reset both call history and behavior between tests.
        retriever_mock.reset_mock()
        retriever_mock.side_effect = None
        retriever_mock.return_value = []

        llm_mock.reset_mock()
        llm_mock.side_effect = None
        llm_mock.return_value = {
            "answer": "",
            "sources": [],
        }

        self.chunks = [
            {
                "rank": 1,
                "source": "rag.pdf",
                "page": 2,
                "chunk_id": "chunk-1",
                "faiss_score": 0.91,
                "reranker_score": 0.88,
            }
        ]

        self.llm_result = {
            "answer": "RAG combines retrieval with generation.",
            "sources": ["rag.pdf"],
        }

    # Test 1: Health endpoint
    def test_health_endpoint(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "status": "ok",
                "service": "visualai-rag",
            },
        )

    # Test 2: Successful RAG request
    def test_valid_rag_request(self):
        retriever_mock.return_value = self.chunks
        llm_mock.return_value = self.llm_result

        response = self.client.post(
            "/api/rag",
            json={"query": "What is RAG?"},
        )

        self.assertEqual(response.status_code, 200)

        body = response.json()

        self.assertEqual(body["query"], "What is RAG?")
        self.assertEqual(
            body["answer"],
            "RAG combines retrieval with generation.",
        )
        self.assertEqual(body["retrieved_chunks"], self.chunks)
        self.assertEqual(body["sources"], ["rag.pdf"])

        retriever_mock.assert_called_once_with(
            query="What is RAG?",
            retrieval_k=10,
            final_k=3,
        )

        llm_mock.assert_called_once_with(
            query="What is RAG?",
            retrieved_chunks=self.chunks,
        )

    # Test 3: Query whitespace is trimmed
    def test_query_is_trimmed(self):
        retriever_mock.return_value = self.chunks
        llm_mock.return_value = self.llm_result

        response = self.client.post(
            "/api/rag",
            json={"query": "  What is RAG?  "},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["query"], "What is RAG?")

        retriever_mock.assert_called_once_with(
            query="What is RAG?",
            retrieval_k=10,
            final_k=3,
        )

    # Test 4: Blank query returns HTTP 400
    def test_empty_query_returns_400(self):
        response = self.client.post(
            "/api/rag",
            json={"query": "   "},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["detail"],
            "Query is required.",
        )

        retriever_mock.assert_not_called()
        llm_mock.assert_not_called()

    # Test 5: Missing query returns HTTP 422
    def test_missing_query_returns_422(self):
        response = self.client.post(
            "/api/rag",
            json={},
        )

        self.assertEqual(response.status_code, 422)
        retriever_mock.assert_not_called()
        llm_mock.assert_not_called()

    # Test 6: Retrieval failure returns HTTP 500
    def test_retrieval_failure_returns_500(self):
        retriever_mock.side_effect = RuntimeError(
            "Retrieval failed"
        )

        response = self.client.post(
            "/api/rag",
            json={"query": "What is RAG?"},
        )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.json()["detail"],
            "Retrieval failed",
        )

        llm_mock.assert_not_called()

    # Test 7: LLM failure returns HTTP 500
    def test_llm_failure_returns_500(self):
        retriever_mock.return_value = self.chunks
        llm_mock.side_effect = RuntimeError("LLM failed")

        response = self.client.post(
            "/api/rag",
            json={"query": "What is RAG?"},
        )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.json()["detail"],
            "LLM failed",
        )


if __name__ == "__main__":
    unittest.main()
