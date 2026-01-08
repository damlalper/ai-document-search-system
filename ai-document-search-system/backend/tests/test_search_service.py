"""
[AI-generated] Unit tests for Search Service

Tests cover:
- TF-IDF Indexing logic
- Keyword search and scoring
- Snippet extraction
- Handling empty/no results

Note on AI Error:
AI initially tried to test private methods like `_build_index` directly without 
checking if they were exposed or renamed. The test was adjusted to use the public 
API `load_documents` and `search`.
"""

import pytest
from unittest.mock import MagicMock, patch
from app.services.search_service import SearchService

MOCK_DOCS = [
    {"doc_id": "1", "filename": "doc1.pdf"},
    {"doc_id": "2", "filename": "doc2.pdf"}
]

MOCK_TEXTS = {
    "1": "Artificial Intelligence is transforming software engineering.",
    "2": "Traditional software development uses waterfall model."
}

@pytest.fixture
def search_service():
    """Create a search service instance with mocked dependencies"""
    service = SearchService()
    # Mock settings if needed, but here we'll mock the data loading directly
    return service

@patch("app.services.search_service.json.load")
@patch("app.services.search_service.open")
@patch("app.services.search_service.load_extracted_text")
@patch("app.services.search_service.settings")
def test_indexing_success(mock_settings, mock_load_text, mock_open, mock_json, search_service):
    """Test successful document indexing"""
    # Setup
    mock_settings.metadata_file.exists.return_value = True
    mock_json.return_value = {"documents": MOCK_DOCS}
    
    # Mock text loading for each doc
    def side_effect(doc_id):
        return MOCK_TEXTS.get(doc_id, "")
    mock_load_text.side_effect = side_effect
    
    # Execute
    search_service.load_documents()
    
    # Assert
    assert len(search_service.doc_ids) == 2
    assert "1" in search_service.doc_texts
    assert search_service.doc_vectors is not None
    # Check dimensions: 2 docs
    assert search_service.doc_vectors.shape[0] == 2

def test_search_relevance(search_service):
    """Test search returns relevant results with snippets"""
    # Setup - Manually populate index for predictable testing
    search_service.doc_ids = ["1", "2"]
    search_service.doc_texts = MOCK_TEXTS
    # Re-fit vectorizer manually
    search_service.doc_vectors = search_service.vectorizer.fit_transform(list(MOCK_TEXTS.values()))
    
    # Execute - Search for "Intelligence" (should match doc 1)
    results = search_service.search("Intelligence")
    
    # Assert
    assert len(results) > 0
    top_result = results[0]
    assert top_result['doc_id'] == "1"
    assert "Intelligence" in top_result['snippet']
    assert top_result['score'] > 0

def test_search_no_results(search_service):
    """Test search with query that matches nothing"""
    # Setup
    search_service.doc_ids = ["1", "2"]
    search_service.doc_texts = MOCK_TEXTS
    search_service.doc_vectors = search_service.vectorizer.fit_transform(list(MOCK_TEXTS.values()))
    
    # Execute
    results = search_service.search("Banana") # Unrelated term
    
    # Assert
    assert len(results) == 0

def test_search_empty_index(search_service):
    """Test search when no documents are indexed"""
    # Setup - Empty state
    search_service.doc_ids = []
    search_service.doc_vectors = None
    
    # Execute
    results = search_service.search("AI")
    
    # Assert
    assert results == []
