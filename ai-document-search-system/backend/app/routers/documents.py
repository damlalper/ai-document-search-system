"""
[AI-assisted] Document Upload and Management Endpoints
Handles PDF upload, metadata storage, text extraction
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse

from app.config import settings
from app.models.schemas import DocumentUploadResponse, DocumentListResponse, DocumentInfo
from app.services.pdf_service import extract_text_from_pdf, save_extracted_text, get_pdf_metadata
from app.services.search_service import search_service

router = APIRouter()


def load_metadata() -> dict:
    """Load metadata from JSON file"""
    if not settings.metadata_file.exists():
        return {"documents": []}

    with open(settings.metadata_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_metadata(metadata: dict) -> None:
    """Save metadata to JSON file"""
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    with open(settings.metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, default=str)


@router.post("/documents/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF document and extract text

    Steps:
    1. Validate file is PDF
    2. Save PDF to uploads/
    3. Extract text using PyMuPDF (no AI)
    4. Save extracted text to extracted/
    5. Update metadata.json
    6. Rebuild search index
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )

    # Generate unique document ID
    doc_id = str(uuid.uuid4())

    # Save uploaded PDF
    pdf_path = settings.upload_dir / f"{doc_id}.pdf"
    try:
        settings.upload_dir.mkdir(parents=True, exist_ok=True)

        with open(pdf_path, 'wb') as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save PDF: {str(e)}"
        )

    # Extract text from PDF (classical method, no AI)
    try:
        extracted_data = extract_text_from_pdf(pdf_path)
        full_text = extracted_data['full_text']
        page_count = extracted_data['page_count']
    except Exception as e:
        # Cleanup uploaded file
        pdf_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract text from PDF: {str(e)}"
        )

    # Save extracted text for search indexing
    try:
        save_extracted_text(doc_id, full_text)
    except Exception as e:
        # Cleanup files
        pdf_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save extracted text: {str(e)}"
        )

    # Get PDF metadata
    try:
        pdf_metadata = get_pdf_metadata(pdf_path)
    except Exception as e:
        pdf_metadata = {}

    # Update metadata.json
    metadata = load_metadata()
    uploaded_at = datetime.now()

    doc_metadata = {
        "doc_id": doc_id,
        "filename": file.filename,
        "uploaded_at": uploaded_at.isoformat(),
        "page_count": page_count,
        "file_size": pdf_metadata.get('file_size', 0)
    }

    metadata['documents'].append(doc_metadata)
    save_metadata(metadata)

    # Rebuild search index to include new document
    try:
        search_service.rebuild_index()
    except Exception as e:
        # Non-critical error - document is uploaded but search may not work immediately
        print(f"Warning: Failed to rebuild search index: {str(e)}")

    return DocumentUploadResponse(
        doc_id=doc_id,
        filename=file.filename,
        status="success",
        uploaded_at=uploaded_at
    )


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents():
    """
    List all uploaded documents with metadata
    """
    metadata = load_metadata()
    documents = metadata.get('documents', [])

    # Convert to DocumentInfo objects
    doc_list = []
    for doc in documents:
        doc_list.append(DocumentInfo(
            doc_id=doc['doc_id'],
            filename=doc['filename'],
            uploaded_at=datetime.fromisoformat(doc['uploaded_at']),
            page_count=doc.get('page_count'),
            file_size=doc.get('file_size')
        ))

    return DocumentListResponse(
        documents=doc_list,
        total=len(doc_list)
    )


@router.get("/documents/{doc_id}", response_model=DocumentInfo)
async def get_document(doc_id: str):
    """
    Get metadata for a specific document
    """
    metadata = load_metadata()
    documents = metadata.get('documents', [])

    # Find document by ID
    for doc in documents:
        if doc['doc_id'] == doc_id:
            return DocumentInfo(
                doc_id=doc['doc_id'],
                filename=doc['filename'],
                uploaded_at=datetime.fromisoformat(doc['uploaded_at']),
                page_count=doc.get('page_count'),
                file_size=doc.get('file_size')
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Document with ID {doc_id} not found"
    )


@router.get("/documents/{doc_id}/download")
async def download_document(doc_id: str):
    """
    Download the original PDF file
    """
    metadata = load_metadata()
    documents = metadata.get('documents', [])

    # Find document by ID
    doc_found = None
    for doc in documents:
        if doc['doc_id'] == doc_id:
            doc_found = doc
            break

    if not doc_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {doc_id} not found"
        )

    # Check if PDF file exists
    pdf_path = settings.upload_dir / f"{doc_id}.pdf"
    if not pdf_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PDF file not found for document {doc_id}"
        )

    # Return file for download
    return FileResponse(
        path=pdf_path,
        media_type='application/pdf',
        filename=doc_found['filename']
    )


@router.delete("/documents/{doc_id}", status_code=status.HTTP_200_OK)
async def delete_document(doc_id: str):
    """
    Delete a document and its associated files
    """
    metadata = load_metadata()
    documents = metadata.get('documents', [])

    # Find and remove document from metadata
    doc_found = False
    for i, doc in enumerate(documents):
        if doc['doc_id'] == doc_id:
            documents.pop(i)
            doc_found = True
            break

    if not doc_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {doc_id} not found"
        )

    # Delete physical files
    pdf_path = settings.upload_dir / f"{doc_id}.pdf"
    text_path = settings.extracted_dir / f"{doc_id}.txt"

    pdf_path.unlink(missing_ok=True)
    text_path.unlink(missing_ok=True)

    # Save updated metadata
    metadata['documents'] = documents
    save_metadata(metadata)

    # Rebuild search index
    try:
        search_service.rebuild_index()
    except Exception as e:
        print(f"Warning: Failed to rebuild search index after deletion: {str(e)}")

    return JSONResponse(
        content={
            "status": "success",
            "message": f"Document {doc_id} deleted successfully"
        }
    )
