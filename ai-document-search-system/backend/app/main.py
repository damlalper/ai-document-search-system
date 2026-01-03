"""
FastAPI Application Entry Point
AI Document Search System - BIL440 Final Project
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.config import settings
from app.routers import documents, search, ai
from app.services.search_service import search_service


# Create necessary directories on startup
def create_directories():
    """Ensure all required directories exist"""
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.extracted_dir.mkdir(parents=True, exist_ok=True)


# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered document search and summarization system",
    debug=settings.debug
)

# Configure CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    create_directories()

    # Load existing documents into search index
    try:
        search_service.load_documents()
        print(f"✅ Search index loaded with {len(search_service.doc_ids)} documents")
    except Exception as e:
        print(f"⚠️  Warning: Failed to load search index: {str(e)}")

    print(f"🚀 {settings.app_name} v{settings.app_version} started")
    print(f"📁 Upload directory: {settings.upload_dir}")
    print(f"📄 Extracted text directory: {settings.extracted_dir}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print(f"🛑 {settings.app_name} shutting down")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Register routers
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])
app.include_router(search.router, prefix="/api/v1", tags=["search"])
app.include_router(ai.router, prefix="/api/v1", tags=["ai"])
