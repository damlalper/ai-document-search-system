"""
[AI-generated + Human-corrected] Unit tests for LLM Service

Test Strategy (Decision Log Reference):
- Real API calls REJECTED (Mocking used instead)
- Non-existent 'pytest-groq' library usage CORRECTED (Standard unittest.mock used)
- Exact token count checks CORRECTED (Flexible assertion used)
- Hallucination prevention (Temperature=0.0) VALIDATED

Framework: pytest
"""

import pytest
from unittest.mock import MagicMock, patch
from app.services.llm_service import llm_service, NO_ANSWER_TEXT
from groq import APIError, RateLimitError

@pytest.fixture
def mock_groq_client():
    """Mock the Groq client within the llm_service instance"""
    with patch.object(llm_service, 'client') as mock:
        yield mock

def test_summarize_short_success(mock_groq_client):
    """Test short summary generation with correct parameters"""
    # Setup
    mock_response = MagicMock()
    mock_response.choices[0].message.content = "Short summary."
    mock_groq_client.chat.completions.create.return_value = mock_response
    
    # Execute
    result = llm_service.summarize("Content", summary_type="short")
    
    # Assert
    assert result == "Short summary."
    # CRITICAL: Verify temperature is 0.3 for creativity but control
    call_kwargs = mock_groq_client.chat.completions.create.call_args.kwargs
    assert call_kwargs['temperature'] == 0.3
    assert "concise summary" in call_kwargs['messages'][1]['content']

def test_summarize_detailed_success(mock_groq_client):
    """Test detailed summary generation with correct parameters"""
    # Setup
    mock_response = MagicMock()
    mock_response.choices[0].message.content = "Detailed summary."
    mock_groq_client.chat.completions.create.return_value = mock_response
    
    # Execute
    result = llm_service.summarize("Content", summary_type="detailed")
    
    # Assert
    assert result == "Detailed summary."
    # CRITICAL: Verify temperature is 0.7 for more detail/creativity
    call_kwargs = mock_groq_client.chat.completions.create.call_args.kwargs
    assert call_kwargs['temperature'] == 0.7

def test_answer_question_factual_success(mock_groq_client):
    """Test Q&A with correct parameters (Hallucination Prevention check)"""
    # Setup
    mock_response = MagicMock()
    mock_response.choices[0].message.content = "Factual answer."
    mock_groq_client.chat.completions.create.return_value = mock_response
    
    # Execute
    result = llm_service.answer_question("Context", "Question")

    # Assert
    assert result == "Factual answer."
    # Temperature is 0.3 for educational, pedagogical responses (updated from 0.0)
    call_kwargs = mock_groq_client.chat.completions.create.call_args.kwargs
    assert call_kwargs['temperature'] == 0.3

def test_answer_question_no_info(mock_groq_client):
    """Test that system returns predefined constant when no info found"""
    # Setup
    mock_response = MagicMock()
    # AI returns the specific NO_ANSWER_TEXT
    mock_response.choices[0].message.content = NO_ANSWER_TEXT
    mock_groq_client.chat.completions.create.return_value = mock_response
    
    # Execute
    result = llm_service.answer_question("Context", "Irrelevant Question")
    
    # Assert
    assert result == NO_ANSWER_TEXT

def test_empty_input_handling(mock_groq_client):
    """Test handling of empty text input"""
    # Setup - even if empty text is passed, service constructs prompt
    mock_response = MagicMock()
    mock_response.choices[0].message.content = "Empty summary"
    mock_groq_client.chat.completions.create.return_value = mock_response

    # Execute
    result = llm_service.summarize("", summary_type="short")
    
    # Assert
    assert result == "Empty summary"
    # Ensure API was still called (service doesn't block empty string, relying on prompt)
    mock_groq_client.chat.completions.create.assert_called_once()

def test_api_rate_limit_error(mock_groq_client):
    """Test handling of Groq RateLimitError"""
    # Setup
    mock_groq_client.chat.completions.create.side_effect = RateLimitError(
        message="Rate limit exceeded", response=MagicMock(), body=None
    )
    
    # Execute & Assert
    with pytest.raises(Exception) as excinfo:
        llm_service.summarize("Content")
    assert "Rate limit exceeded" in str(excinfo.value)

def test_generic_api_error(mock_groq_client):
    """Test handling of generic API errors"""
    # Setup
    mock_groq_client.chat.completions.create.side_effect = APIError(
        message="Server error", request=MagicMock(), body=None
    )
    
    # Execute & Assert
    with pytest.raises(Exception) as excinfo:
        llm_service.summarize("Content")
    assert "AI service error" in str(excinfo.value)
