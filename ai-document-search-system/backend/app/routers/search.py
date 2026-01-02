"""
[AI-assisted] Search Endpoints
Classical TF-IDF keyword-based search - NO AI used here
"""

import json
from typing import List
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.models.schemas import SearchRequest, SearchResponse, SearchResult
from app.services.search_service import search_service

router = APIRouter()


def load_metadata() -> dict:
    """Load metadata from JSON file to get filenames"""
    if not settings.metadata_file.exists():
        return {"documents": []}

    with open(settings.metadata_file, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.post("/search", response_model=SearchResponse)
async def search_documents(request: SearchRequest):
    """
    Search documents using classical TF-IDF (NO AI)

    This endpoint uses purely statistical methods:
    - TF-IDF vectorization (sklearn)
    - Cosine similarity
    - No LLM or AI models involved

    Args:
        request: SearchRequest with query and top_k

    Returns:
        SearchResponse with ranked results and snippets
    """
    # Validate query
    if not request.query or len(request.query.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )

    # Perform TF-IDF search (classical method)
    try:
        results = search_service.search(
            query=request.query,
            top_k=request.top_k
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

    # Load metadata to get filenames
    metadata = load_metadata()
    doc_metadata_map = {
        doc['doc_id']: doc for doc in metadata.get('documents', [])
    }

    # Enrich results with filenames
    search_results = []
    for result in results:
        doc_id = result['doc_id']
        doc_meta = doc_metadata_map.get(doc_id, {})

        search_results.append(SearchResult(
            doc_id=doc_id,
            filename=doc_meta.get('filename', 'Unknown'),
            score=result['score'],
            snippet=result['snippet']
        ))

    return SearchResponse(
        query=request.query,
        results=search_results,
        total_found=len(search_results)
    )


@router.post("/search/rebuild-index", status_code=status.HTTP_200_OK)
async def rebuild_search_index():
    """
    Manually trigger search index rebuild

    Useful for:
    - Recovering from index corruption
    - Forcing re-indexing after bulk document changes
    - Testing purposes
    """
    try:
        search_service.rebuild_index()
        return {
            "status": "success",
            "message": "Search index rebuilt successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rebuild search index: {str(e)}"
        )
