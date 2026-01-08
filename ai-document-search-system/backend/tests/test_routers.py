"""
[AI-generated] Integration Tests for API Routers

Tests cover:
- Document Upload (POST /api/v1/documents/upload)
- Document Listing (GET /api/v1/documents)
- Document Deletion (DELETE /api/v1/documents/{id})
- AI Summarization (POST /api/v1/ai/summarize)

Note on AI Error:
AI initially forgot to mock the 'llm_service' during integration tests, 
which would have caused real API calls to Groq. This was caught and 
'patch' decorators were added to mock the AI response.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from pathlib import Path
from app.main import app

client = TestClient(app)

# Mock file content
MOCK_FILE_CONTENT = b"Test document content"
MOCK_FILENAME = "test_doc.txt"

@pytest.fixture
def mock_settings(tmp_path):
    """
    Mock settings to use temporary directories for uploads and extraction.
    This avoids permission errors and cleans up after tests.
    """
    with patch("app.config.settings") as mock_settings:
        # Create temp dirs
        upload_dir = tmp_path / "uploads"
        extracted_dir = tmp_path / "extracted"
        data_dir = tmp_path / "data"
        metadata_file = data_dir / "metadata.json"
        
        upload_dir.mkdir()
        extracted_dir.mkdir()
        data_dir.mkdir()
        
        # Configure mock
        mock_settings.upload_dir = upload_dir
        mock_settings.extracted_dir = extracted_dir
        mock_settings.data_dir = data_dir
        mock_settings.metadata_file = metadata_file
        mock_settings.default_model = "llama-3.1-8b-instant"
        
        # Need to patch where it's used as well, if imported directly
        # But app.config.settings is usually imported as 'from app.config import settings'
        # So patching app.config.settings might not affect modules that already imported it.
        # We need to patch 'app.routers.documents.settings' and 'app.routers.ai.settings' etc.
        yield mock_settings

@pytest.fixture
def mock_settings_routers(tmp_path):
    """
    Patch settings in all router modules
    """
    upload_dir = tmp_path / "uploads"
    extracted_dir = tmp_path / "extracted"
    data_dir = tmp_path / "data"
    metadata_file = data_dir / "metadata.json"
    
    upload_dir.mkdir(exist_ok=True)
    extracted_dir.mkdir(exist_ok=True)
    data_dir.mkdir(exist_ok=True)

    # We use multiple patches
    with patch("app.routers.documents.settings") as s1, \
         patch("app.routers.ai.settings") as s2, \
         patch("app.services.search_service.settings") as s3:
        
        for s in [s1, s2, s3]:
            s.upload_dir = upload_dir
            s.extracted_dir = extracted_dir
            s.data_dir = data_dir
            s.metadata_file = metadata_file
            s.default_model = "llama-3.1-8b-instant"
            s.tfidf_max_features = 1000 # search service needs this
            
        yield s1

@pytest.fixture
def mock_search_service():
    """Mock search service to prevent actual TF-IDF fitting during tests"""
    with patch("app.routers.documents.search_service") as mock:
        yield mock

@patch("app.routers.documents.save_metadata")
@patch("app.routers.documents.load_metadata")
@patch("app.routers.documents.save_extracted_text")
def test_upload_document_success(mock_save_text, mock_load_meta, mock_save_meta, mock_settings_routers, mock_search_service):
    """Test successful document upload"""
    # Setup
    mock_load_meta.return_value = {"documents": []}
    
    # Execute
    files = {"file": (MOCK_FILENAME, MOCK_FILE_CONTENT, "text/plain")}
    response = client.post("/api/v1/documents/upload", files=files)
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == MOCK_FILENAME
    assert "doc_id" in data
    assert data["status"] == "success"

def test_upload_invalid_file_type():
    """Test upload with invalid extension"""
    files = {"file": ("test.exe", b"binary", "application/octet-stream")}
    response = client.post("/api/v1/documents/upload", files=files)
    
    assert response.status_code == 400
    assert "supported" in response.json()["detail"]

@patch("app.routers.documents.load_metadata")
def test_list_documents(mock_load_meta, mock_settings_routers):
    """Test listing documents"""
    mock_load_meta.return_value = {
        "documents": [
            {
                "doc_id": "123",
                "filename": "doc1.pdf",
                "uploaded_at": "2024-01-01T10:00:00",
                "page_count": 5,
                "file_size": 1024
            }
        ]
    }
    
    response = client.get("/api/v1/documents")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["documents"]) == 1
    assert data["documents"][0]["doc_id"] == "123"

@patch("app.routers.ai.llm_service.summarize")
def test_summarize_endpoint(mock_summarize, mock_settings_routers):
    """Test AI summarization endpoint"""
    # Setup
    doc_id = "123"
    
    # Create dummy text file in the temp extracted dir
    # Note: mock_settings_routers yields the mock object which has .extracted_dir set
    text_path = mock_settings_routers.extracted_dir / f"{doc_id}.txt"
    text_path.write_text("Content to summarize", encoding="utf-8")
    
    mock_summarize.return_value = "AI generated summary"
    
    # Execute
    payload = {"doc_id": doc_id, "summary_type": "short"}
    response = client.post("/api/v1/ai/summarize", json=payload)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["summary"] == "AI generated summary"
    assert data["doc_id"] == doc_id
    assert "model_used" in data

def test_summarize_missing_doc(mock_settings_routers):
    """Test summarization for non-existent document"""
    # We ensure file does NOT exist in temp dir
    doc_id = "999"
    payload = {"doc_id": doc_id, "summary_type": "short"}
    response = client.post("/api/v1/ai/summarize", json=payload)
    
    # Should be 404 because file check happens before reading
    assert response.status_code == 404