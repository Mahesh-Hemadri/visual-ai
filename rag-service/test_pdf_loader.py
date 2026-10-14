
import tempfile
import unittest
from pathlib import Path

import pymupdf

from app.ingestion.pdf_loader import load_pdf


class TestPDFLoader(unittest.TestCase):

    def test_extracts_text_and_page_metadata(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            pdf_path = Path(temp_dir) / "sample.pdf"

            with pymupdf.open() as pdf:
                page = pdf.new_page()
                page.insert_text((72, 72), "Hello from PDF")
                pdf.save(pdf_path)

            documents = load_pdf(pdf_path)

            self.assertEqual(len(documents), 1)
            self.assertEqual(documents[0]["source"], "sample.pdf")
            self.assertEqual(documents[0]["page"], 1)
            self.assertIn("Hello from PDF", documents[0]["text"])

    def test_missing_file_raises_file_not_found(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            missing_path = Path(temp_dir) / "missing.pdf"

            with self.assertRaises(FileNotFoundError):
                load_pdf(missing_path)

    def test_invalid_pdf_raises_value_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            invalid_path = Path(temp_dir) / "invalid.pdf"
            invalid_path.write_text("This is not a PDF", encoding="utf-8")

            with self.assertRaises(ValueError):
                load_pdf(invalid_path)

    def test_empty_pdf_returns_no_documents(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            pdf_path = Path(temp_dir) / "empty.pdf"

            with pymupdf.open() as pdf:
                pdf.new_page()
                pdf.save(pdf_path)

            self.assertEqual(load_pdf(pdf_path), [])


if __name__ == "__main__":
    unittest.main()
