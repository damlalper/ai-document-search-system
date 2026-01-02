# AI Document Search System - Backend

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Environment configuration
│   ├── routers/             # API endpoints
│   │   ├── documents.py     # Document upload/management
│   │   ├── search.py        # Classical TF-IDF search
│   │   └── ai.py            # AI-powered endpoints
│   ├── services/            # Business logic
│   │   ├── pdf_service.py   # [Human-written] PDF parsing
│   │   ├── search_service.py # [Human-written] TF-IDF search
│   │   └── llm_service.py   # [AI-assisted] LLM integration
│   ├── models/              # Pydantic schemas
│   └── utils/               # Helper functions
├── data/                    # Runtime data storage
│   ├── uploads/             # Uploaded PDF files
│   ├── extracted/           # Extracted text files
│   └── metadata.json        # Document metadata
├── tests/                   # Test files
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variables template
└── README.md               # This file
```

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### ✅ Implemented (Ready for Frontend Integration)

- **`GET /`** - API health check
- **`GET /health`** - Health status
- **`POST /api/v1/documents/upload`** - Upload PDF document
  - Request: `multipart/form-data` with `file` field
  - Response: `DocumentUploadResponse` (doc_id, filename, uploaded_at)
- **`GET /api/v1/documents`** - List all documents
  - Response: `DocumentListResponse` (documents[], total)
- **`GET /api/v1/documents/{doc_id}`** - Get document details
  - Response: `DocumentInfo`
- **`DELETE /api/v1/documents/{doc_id}`** - Delete document
  - Response: Success message
- **`POST /api/v1/search`** - Keyword-based search (TF-IDF, NO AI)
  - Request: `SearchRequest` (query, top_k)
  - Response: `SearchResponse` (query, results[], total_found)
- **`POST /api/v1/search/rebuild-index`** - Manually rebuild search index

### 🚧 Not Yet Implemented (AI Router - Requires Gemini/Copilot Consultation)

- `POST /api/v1/ai/summarize` - AI-powered summarization
- `POST /api/v1/ai/qa` - AI-powered question answering

## AI Usage Policy

This project follows strict AI usage guidelines:

**AI NOT Used:**
- PDF parsing (PyMuPDF)
- Text cleaning
- Chunking
- Keyword search (TF-IDF)
- Source attribution

**AI Used:**
- Document summarization
- Natural language question answering

## Testing

```bash
pytest tests/ -v
```

## License

MIT License
