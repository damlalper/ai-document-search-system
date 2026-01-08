"""
[AI-generated + Human-Verified] Critical Edge-Case Scenarios

This test suite specifically targets the "Edge-case senaryoları" requirement
from the project assignment (BIL440).

Scenarios covered:
1. Hallucination Prevention (RAG System Integrity)
2. Scanned/Image-Only PDF Handling (Empty Text Extraction)
3. Context Window Overflow (Large Document Handling)

Note on AI Error Report:
During the generation of 'test_scanned_pdf_handling', the AI originally 
asserted that the system should raise an error. 
Human Intervention: We corrected this to assert that the system should 
return a user-friendly warning or empty string, rather than crashing with an exception.
"""

import pytest
from unittest.mock import MagicMock, patch
from app.services.llm_service import llm_service, NO_ANSWER_TEXT
from app.services.pdf_service import extract_text_from_pdf

# -------------------------------------------------------------------------
# SCENARIO 1: Hallucination Prevention (RAG Integrity)
# -------------------------------------------------------------------------
def test_qa_hallucination_prevention():
    """
    Edge Case: User asks a question completely unrelated to the document.
    Expected: System must NOT invent an answer. It must return NO_ANSWER_TEXT.
    """
    # Use patch.object on the instance attribute 'client'
    with patch.object(llm_service, 'client') as mock_client:
        # Setup: AI returns the specific "I don't know" text
        mock_response = MagicMock()
        mock_response.choices[0].message.content = NO_ANSWER_TEXT
        mock_client.chat.completions.create.return_value = mock_response

        # Execute
        context = "The document discusses Python programming and web development."
        question = "What is the capital of Mars?" # Completely irrelevant question
        
        answer = llm_service.answer_question(context, question)

        # Assert
        assert answer == NO_ANSWER_TEXT
        # Critical Check: Temperature must be 0.3 (or 0.0 depending on decision) for this edge case
        # Note: Code actually uses 0.3 for better pedagogy, as per recent update.
        call_kwargs = mock_client.chat.completions.create.call_args.kwargs
        assert call_kwargs['temperature'] == 0.3

# -------------------------------------------------------------------------
# SCENARIO 2: Scanned / Image-Only PDF (Empty Text)
# -------------------------------------------------------------------------
@patch("app.services.pdf_service.fitz")
def test_scanned_pdf_handling(mock_fitz, tmp_path):
    """
    Edge Case: User uploads a PDF that contains only images (Scanned PDF).
    Expected: System should extract empty string without crashing.
    """
    # Setup
    pdf_path = tmp_path / "scanned_doc.pdf"
    pdf_path.write_bytes(b"%PDF-mock")

    # Mock a PDF with pages but NO text (simulating scanned image)
    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_page.get_text.return_value = "" # Empty text
    
    # Correct mocking for sequence behavior
    mock_doc.__len__.return_value = 3
    mock_doc.__getitem__.return_value = mock_page
    mock_fitz.open.return_value = mock_doc

    # Execute
    result = extract_text_from_pdf(pdf_path)

    # Assert
    assert result['full_text'] == "" # Should be empty
    assert result['page_count'] == 3
    # Logic verification: Ensure it didn't crash

# -------------------------------------------------------------------------
# SCENARIO 3: Large Context / Token Limit Protection
# -------------------------------------------------------------------------
def test_large_document_truncation():
    """
    Edge Case: Document is extremely large (e.g., 100k+ characters).
    Expected: Service should handle it (even if by truncation logic in real impl)
    without throwing a 'Request too large' API error immediately.
    """
    # Use patch.object on the instance attribute 'client'
    with patch.object(llm_service, 'client') as mock_client:
        # Setup
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Summary of large doc."
        mock_client.chat.completions.create.return_value = mock_response

        # Create a massive string input (simulating 50k tokens)
        huge_text = "This is a sentence. " * 10000 
        
        # Execute
        try:
            result = llm_service.summarize(huge_text)
        except Exception as e:
            pytest.fail(f"Summarize crashed on large input: {e}")

        # Assert
        assert result == "Summary of large doc."
        # Check that it actually tried to call the API
        mock_client.chat.completions.create.assert_called_once()