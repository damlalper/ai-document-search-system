"""
Pydantic Schemas for Request/Response models
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ============ Document Models ============

class DocumentUploadResponse(BaseModel):
    """Response after successful document upload"""
    doc_id: str
    filename: str
    status: str = "success"
    uploaded_at: datetime


class DocumentInfo(BaseModel):
    """Document metadata information"""
    doc_id: str
    filename: str
    uploaded_at: datetime
    page_count: Optional[int] = None
    file_size: Optional[int] = None


class DocumentListResponse(BaseModel):
    """Response for listing documents"""
    documents: List[DocumentInfo]
    total: int


# ============ Search Models ============

class SearchRequest(BaseModel):
    """Request for keyword-based search"""
    query: str = Field(..., min_length=1, description="Search query")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of results to return")


class SearchResult(BaseModel):
    """Single search result"""
    doc_id: str
    filename: str
    score: float
    snippet: str  # Text excerpt from document


# ============ AI Models ============

class SummarizeRequest(BaseModel):
    """Request for document summarization"""
    doc_id: str
    summary_type: str = Field(default="short", pattern="^(short|detailed)$", description="Type of summary")


class SummarizeResponse(BaseModel):
    """Response for document summarization"""
    doc_id: str
    summary_type: str
    summary: str


class QARequest(BaseModel):
    """Request for question answering (RAG)"""
    question: str = Field(..., min_length=1, description="User question")
    doc_ids: Optional[List[str]] = Field(default=None, description="Optional filter: specific doc IDs to search")


class QASource(BaseModel):
    """Source document for Q&A answer"""
    doc_id: str
    filename: str
    relevance_score: float
    excerpt: str = Field(description="Text excerpt from document (Copilot's idea)")


class QAResponse(BaseModel):
    """Response for question answering"""
    question: str
    answer: str
    sources: List[QASource]


class SearchResponse(BaseModel):
    """Response for search query"""
    query: str
    results: List[SearchResult]
    total_found: int


# ============ AI Models ============

class SummarizeRequest(BaseModel):
    """Request for document summarization"""
    doc_id: str
    summary_type: str = Field(default="short", pattern="^(short|detailed)$")


class SummarizeResponse(BaseModel):
    """Response for summarization"""
    doc_id: str
    summary: str
    summary_type: str
    model_used: str


class QARequest(BaseModel):
    """Request for question answering"""
    question: str = Field(..., min_length=1, description="User question")
    doc_ids: Optional[List[str]] = Field(default=None, description="Specific documents to search (optional)")


class Source(BaseModel):
    """Source attribution for QA response"""
    doc_id: str
    filename: str
    page: Optional[int] = None
    excerpt: str


class QAResponse(BaseModel):
    """Response for question answering"""
    question: str
    answer: str
    sources: List[Source]
    model_used: str
    confidence: Optional[str] = None  # "high", "medium", "low"
