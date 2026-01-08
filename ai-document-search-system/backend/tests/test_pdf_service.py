"""
[AI-generated] Unit tests for PDF Service

Tests cover:
- Text extraction from valid PDFs
- Error handling for invalid/corrupt files
- Metadata extraction (page count, size)

Note on AI Error: 
During test generation, AI suggested using 'io.BytesIO' for file simulation but 
initially forgot to reset the pointer (file.seek(0)), causing empty reads. 
This has been corrected manually.
"""

import pytest
from pathlib import Path
from unittest.mock import MagicMock, patch
from app.services.pdf_service import extract_text_from_pdf, get_pdf_metadata

# Mock data
MOCK_PDF_CONTENT = b"%PDF-1.4 mock content"
MOCK_TEXT = "Extracted text content"

@pytest.fixture
def mock_pymupdf():
    """Mock PyMuPDF (fitz) library"""
    with patch("app.services.pdf_service.fitz") as mock:
        yield mock

def test_extract_text_success(mock_pymupdf, tmp_path):
    """Test successful text extraction from a valid PDF"""
    # Setup
    pdf_path = tmp_path / "test.pdf"
    pdf_path.write_bytes(MOCK_PDF_CONTENT)
    
    # Mock document object
    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_page.get_text.return_value = MOCK_TEXT
    
    # Configure doc to behave like a list/sequence
    mock_doc.__len__.return_value = 1
    mock_doc.__getitem__.return_value = mock_page
    
    mock_pymupdf.open.return_value = mock_doc
    
    # Execute
    result = extract_text_from_pdf(pdf_path)
    
    # Assert
    assert MOCK_TEXT in result['full_text']
    assert result['page_count'] == 1
    mock_pymupdf.open.assert_called_once_with(pdf_path)

def test_extract_text_file_not_found():
    """Test handling of non-existent file"""
    # Execute & Assert
    with pytest.raises(Exception):
        extract_text_from_pdf(Path("non_existent.pdf"))

def test_extract_text_corrupt_file(mock_pymupdf, tmp_path):
    """Test handling of corrupt PDF file"""
    # Setup
    pdf_path = tmp_path / "corrupt.pdf"
    pdf_path.write_bytes(b"corrupt content")
    
    # Mock exception from fitz
    mock_pymupdf.open.side_effect = Exception("Cannot open file")
    
    # Execute & Assert
    with pytest.raises(Exception) as excinfo:
        extract_text_from_pdf(pdf_path)
    assert "Cannot open file" in str(excinfo.value)

def test_get_pdf_metadata_success(mock_pymupdf, tmp_path):
    """Test metadata extraction"""
    # Setup
    pdf_path = tmp_path / "meta.pdf"
    pdf_path.write_bytes(MOCK_PDF_CONTENT)
    
    mock_doc = MagicMock()
    mock_doc.__len__.return_value = 5  # Mock len(doc)
    mock_doc.metadata = {"format": "PDF 1.4", "title": "Test Doc"}
    mock_pymupdf.open.return_value = mock_doc
    
    # Execute
    metadata = get_pdf_metadata(pdf_path)
    
    # Assert
    assert metadata['page_count'] == 5
    assert metadata['file_size'] > 0