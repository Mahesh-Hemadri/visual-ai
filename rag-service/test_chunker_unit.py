import unittest

from app.ingestion.chunker import normalize_text, chunk_text, create_chunks


class TestChunker(unittest.TestCase):
    def test_normalize_text_removes_extra_whitespace(self):
        self.assertEqual(
            normalize_text("  Hello\r\n  world  \n"),
            "Hello world",
        )

    def test_empty_text_returns_no_chunks(self):
        self.assertEqual(chunk_text(""), [])

    def test_short_text_returns_one_chunk(self):
        self.assertEqual(
            chunk_text("one two three", chunk_size=5, chunk_overlap=1),
            ["one two three"],
        )

    def test_chunks_respect_chunk_size(self):
        text = " ".join(f"word{i}" for i in range(10))
        chunks = chunk_text(text, chunk_size=4, chunk_overlap=1)

        self.assertTrue(chunks)
        for chunk in chunks:
            self.assertLessEqual(len(chunk.split()), 4)

    def test_overlap_preserves_words(self):
        chunks = chunk_text(
            "one two three four five six",
            chunk_size=4,
            chunk_overlap=2,
        )
        self.assertEqual(
            chunks,
            ["one two three four", "three four five six"],
        )

    def test_invalid_overlap_raises_value_error(self):
        with self.assertRaises(ValueError):
            chunk_text("one two three", chunk_size=4, chunk_overlap=4)

    def test_create_chunks_preserves_source_and_page(self):
        pages = [{
            "source": "sample.pdf",
            "page": 2,
            "text": "one two three four five",
        }]

        chunks = create_chunks(pages)

        self.assertEqual(len(chunks), 1)
        self.assertEqual(chunks[0].source, "sample.pdf")
        self.assertEqual(chunks[0].page, 2)
        self.assertIn("sample_pdf_page_002_chunk_000", chunks[0].chunk_id)


if __name__ == "__main__":
    unittest.main()
