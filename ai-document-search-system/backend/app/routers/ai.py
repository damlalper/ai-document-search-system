"""
[AI-assisted] AI Router - Summarization and Q&A Endpoints
Hybrid implementation combining:
- Gemini: Clean code structure, proper error messages
- GitHub Copilot: NO_ANSWER_TEXT constant, _load_metadata() helper, excerpt in sources
- Claude Code: Correct path usage (settings.extracted_dir), RAG context building

CRITICAL: This implements RAG pipeline - search + context + LLM
"""

import json
import logging
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.models.schemas import (
    SummarizeRequest,
    SummarizeResponse,
    QARequest,
    QAResponse,
    QASource
)
from app.services.llm_service import llm_service
from app.services.search_service import search_service

router = APIRouter()
logger = logging.getLogger(__name__)

# Hallucination prevention constant (from Copilot suggestion)
NO_ANSWER_TEXT = (
    "Based on the provided documents, I cannot find specific information "
    "to answer this question. Please try rephrasing or ask about content "
    "that exists in the uploaded documents."
)


def _load_metadata() -> dict:
    """
    Load metadata.json to map doc_id -> filename
    Helper function for DRY principle (from Copilot suggestion)
    """
    if not settings.metadata_file.exists():
        return {"documents": []}

    with open(settings.metadata_file, 'r', encoding='utf-8') as f:
        return json.load(f)


@router.post("/ai/summarize", response_model=SummarizeResponse)
async def summarize_document(request: SummarizeRequest):
    """
    Generate AI-powered document summary using LLM

    Args:
        request: SummarizeRequest with doc_id and summary_type ("short" or "detailed")

    Returns:
        SummarizeResponse with generated summary

    Raises:
        HTTPException 404: Document not found
        HTTPException 400: Empty document
        HTTPException 500: LLM service error
    """
    logger.info(f"Summarize request: doc_id={request.doc_id}, type={request.summary_type}")

    # Read extracted text file (using settings.extracted_dir - Claude's correct approach)
    text_path = settings.extracted_dir / f"{request.doc_id}.txt"

    if not text_path.exists():
        logger.error(f"Document not found: {request.doc_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document {request.doc_id} not found"
        )

    try:
        with open(text_path, 'r', encoding='utf-8') as f:
            text = f.read()

        # Empty text check (Claude's edge case handling)
        if not text.strip():
            logger.warning(f"Document {request.doc_id} is empty")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document is empty"
            )

        # Generate summary using LLM
        summary = llm_service.summarize(
            text=text,
            summary_type=request.summary_type
        )

        logger.info(f"Generated {request.summary_type} summary for {request.doc_id}")

        return SummarizeResponse(
            doc_id=request.doc_id,
            summary_type=request.summary_type,
            summary=summary
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summarization failed for {request.doc_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed: {str(e)}"
        )


@router.post("/ai/qa", response_model=QAResponse)
async def answer_question(request: QARequest):
    """
    Answer question using RAG (Retrieval-Augmented Generation)

    Pipeline:
    1. Use TF-IDF search to find relevant documents (classical method)
    2. Load text from top-ranked documents
    3. Build context by combining texts
    4. Use LLM to answer based ONLY on context (hallucination prevention)

    Args:
        request: QARequest with question and optional doc_ids filter

    Returns:
        QAResponse with answer and sources (with excerpts from Copilot idea)

    Raises:
        HTTPException 400: Empty question
        HTTPException 404: No documents found
        HTTPException 500: Search or LLM error
    """
    if not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty"
        )

    logger.info(f"QA request: question='{request.question[:50]}...', doc_ids={request.doc_ids}")

    try:
        # Step 1: Search for relevant documents using TF-IDF (classical method, NO AI)
        search_results = search_service.search(
            query=request.question,
            top_k=5
        )

        if not search_results:
            logger.warning(f"No documents found for question: {request.question[:50]}")
            return QAResponse(
                question=request.question,
                answer=NO_ANSWER_TEXT,
                sources=[]
            )

        # Filter by doc_ids if provided (Claude's filtering logic)
        if request.doc_ids:
            search_results = [
                r for r in search_results if r['doc_id'] in request.doc_ids
            ]
            logger.debug(f"Filtered to {len(search_results)} documents by doc_ids")

        if not search_results:
            logger.warning("No documents remained after doc_ids filtering")
            return QAResponse(
                question=request.question,
                answer=NO_ANSWER_TEXT,
                sources=[]
            )

        # Load metadata for filenames
        metadata = _load_metadata()
        meta_map = {doc['doc_id']: doc for doc in metadata.get('documents', [])}

        # Step 2: Load text from top documents and build context
        context_parts = []
        sources = []

        for result in search_results[:5]:  # Top 5 results
            doc_id = result['doc_id']
            text_path = settings.extracted_dir / f"{doc_id}.txt"

            if not text_path.exists():
                logger.warning(f"Text file not found for {doc_id}, skipping")
                continue

            try:
                with open(text_path, 'r', encoding='utf-8') as f:
                    doc_text = f.read()

                if doc_text.strip():
                    context_parts.append(doc_text)

                    # Create source with excerpt (Copilot's idea - shows user where answer came from)
                    filename = meta_map.get(doc_id, {}).get('filename', 'Unknown')
                    excerpt = doc_text[:200] + "..." if len(doc_text) > 200 else doc_text

                    sources.append(QASource(
                        doc_id=doc_id,
                        filename=filename,
                        relevance_score=result['score'],
                        excerpt=excerpt
                    ))

            except Exception as e:
                logger.warning(f"Failed to load text for {doc_id}: {str(e)}")
                continue

        if not context_parts:
            logger.error("Failed to load any document texts")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to load document texts"
            )

        # Step 3: Combine context (Claude's approach with clear separators)
        combined_context = "\n\n---DOCUMENT_BOUNDARY---\n\n".join(context_parts)

        logger.debug(f"Built context from {len(context_parts)} documents ({len(combined_context)} chars)")

        # Step 4: Generate answer using LLM with strict no-hallucination prompt
        answer = llm_service.answer_question(
            context=combined_context,
            question=request.question
        )

        logger.info(f"Generated answer with {len(sources)} sources")

        return QAResponse(
            question=request.question,
            answer=answer,
            sources=sources
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Q&A failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Question answering failed: {str(e)}"
        )
