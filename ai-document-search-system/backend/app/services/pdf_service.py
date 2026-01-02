"""
[Human-written] PDF Text Extraction Service
Uses PyMuPDF (fitz) for deterministic PDF parsing - NO AI
"""

import fitz  # PyMuPDF
from pathlib import Path
from typing import Dict, List

from app.config import settings
from app.utils.text_utils import clean_text


def extract_text_from_pdf(pdf_path: Path) -> Dict[str, any]:
    """
    Extract text from PDF file using PyMuPDF (deterministic, no AI)

    Args:
        pdf_path: Path to PDF file

    Returns:
        Dictionary containing:
            - full_text: Complete extracted text
            - page_count: Number of pages
            - pages: List of text per page
    """
    try:
        doc = fitz.open(pdf_path)
        pages = []
        full_text = ""

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()

            # Clean text using classical methods
            cleaned_text = clean_text(text)
            pages.append(cleaned_text)
            full_text += cleaned_text + "\n\n"

        doc.close()

        return {
            "full_text": full_text.strip(),
            "page_count": len(pages),
            "pages": pages
        }

    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")


def save_extracted_text(doc_id: str, text: str) -> Path:
    """
    Save extracted text to file for caching

    Args:
        doc_id: Document ID
        text: Extracted text

    Returns:
        Path to saved text file
    """
    text_file = settings.extracted_dir / f"{doc_id}.txt"

    try:
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(text)

        return text_file

    except Exception as e:
        raise Exception(f"Failed to save extracted text: {str(e)}")


def load_extracted_text(doc_id: str) -> str:
    """
    Load previously extracted text from cache

    Args:
        doc_id: Document ID

    Returns:
        Extracted text

    Raises:
        FileNotFoundError: If text file doesn't exist
    """
    text_file = settings.extracted_dir / f"{doc_id}.txt"

    if not text_file.exists():
        raise FileNotFoundError(f"Extracted text not found for document {doc_id}")

    with open(text_file, 'r', encoding='utf-8') as f:
        return f.read()


def get_pdf_metadata(pdf_path: Path) -> Dict[str, any]:
    """
    Extract PDF metadata (page count, file size, etc.)

    Args:
        pdf_path: Path to PDF file

    Returns:
        Dictionary with metadata
    """
    try:
        doc = fitz.open(pdf_path)
        metadata = {
            "page_count": len(doc),
            "file_size": pdf_path.stat().st_size,
            "filename": pdf_path.name
        }
        doc.close()

        return metadata

    except Exception as e:
        raise Exception(f"Failed to get PDF metadata: {str(e)}")
