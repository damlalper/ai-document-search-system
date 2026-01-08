# AI Document Search System

**BİL440 Final Project - AI-Augmented Software Development**

A modern document intelligence system powered by RAG (Retrieval-Augmented Generation) and LLM technology for analyzing, searching, and querying academic documents.

## 🚀 Features

- **Multi-Format Support**: Upload and process PDF, TXT, and MD files
- **TF-IDF Search**: Classical keyword-based document search
- **RAG-Powered Q&A**: Ask questions and get contextual answers from your documents
- **AI Summarization**: Generate short or detailed summaries using LLM
- **Modern UI**: Glassmorphism design with gradient effects and smooth animations
- **Edge Case Handling**: Robust error handling for scanned PDFs, large documents, and hallucination prevention

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **LLM**: Groq API (llama-3.1-8b-instant)
- **Search**: TF-IDF (scikit-learn)
- **PDF Processing**: PyMuPDF (classical, no AI)
- **Testing**: pytest (23 tests passing)

### Frontend
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4.x
- **State**: Context API
- **Font**: Geist Sans

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key

### Backend Setup

```bash
cd ai-document-search-system/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run backend
uvicorn app.main:app --reload
```

Backend will run at: `http://localhost:8000`

### Frontend Setup

```bash
cd ai-document-search-system/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 🧪 Testing

```bash
cd ai-document-search-system/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_edge_cases.py -v
```

**Test Coverage**: 23 tests passing
- Edge cases (hallucination prevention, scanned PDFs, large documents)
- PDF service (text extraction, metadata)
- Router endpoints (upload, list, delete, download)
- Search service (TF-IDF functionality)

## 📖 API Documentation

Access interactive API documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

- `POST /api/v1/documents/upload` - Upload PDF/TXT/MD file
- `GET /api/v1/documents` - List all documents
- `GET /api/v1/documents/{doc_id}` - Get document metadata
- `GET /api/v1/documents/{doc_id}/download` - Download original file
- `DELETE /api/v1/documents/{doc_id}` - Delete document
- `POST /api/v1/search` - TF-IDF search
- `POST /api/v1/ai/qa` - RAG-powered Q&A
- `POST /api/v1/ai/summarize` - AI summarization

## 🤖 AI Usage Statistics

This project was built with AI assistance:

- **Claude Code**: 16 decisions (Backend API, Router, Tests)
- **Gemini**: 14 decisions (Backend services, Test generation)
- **ChatGPT**: 10 decisions (Frontend design, Color palettes)
- **GitHub Copilot**: 8 decisions (Helper functions, Error handling)

**Total AI Decisions**: 48
**Execution Errors Documented**: 16
**Hybrid Decisions**: 5

See [AI_DECISION_LOG.md](ai-document-search-system/docs/AI_DECISION_LOG.md) for detailed documentation.

## 📁 Project Structure

```
ai-document-search-system/
├── backend/
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── models/           # Pydantic schemas
│   │   └── config.py         # Configuration
│   ├── tests/                # Test suite (23 tests)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   ├── services/         # API client
│   │   └── App.jsx
│   └── package.json
└── docs/
    ├── AI_DECISION_LOG.md    # 48 AI decisions documented
    ├── USER_STORIES.md
    ├── ARCHITECTURE.md
    └── PRD.md
```

## 🎯 Key Features Implementation

### 1. Multi-Format Document Support
- PDF extraction using PyMuPDF (classical, no AI)
- Text files (.txt, .md) with UTF-8 encoding
- Extension-aware processing and metadata handling

### 2. RAG System Architecture
```
User Question → TF-IDF Search (top 5) → Context Building → LLM Q&A
```
- Temperature: 0.3 (educational responses)
- Hallucination prevention: "ONLY use provided context"
- NO_ANSWER_TEXT for irrelevant questions

### 3. Edge Case Scenarios
- ✅ Scanned/image-only PDFs (empty text extraction)
- ✅ Large documents (>100k characters)
- ✅ Hallucination prevention (RAG integrity)
- ✅ API timeout handling
- ✅ Invalid file format validation

## 🎨 UI/UX Design Philosophy

**Academic Minimalism with Modern Polish**

- Glassmorphism effects with backdrop-blur
- Gradient backgrounds and smooth animations
- Neutral + Teal color palette (inspired by Notion, Linear)
- Professional, distraction-free interface
- Skeleton loading states and toast notifications

## 📊 Lessons Learned

### AI Strengths
✅ Rapid prototyping
✅ Boilerplate code generation
✅ Pattern suggestions
✅ Test scenario creation

### AI Limitations
❌ Version/deprecation tracking
❌ Visual design evaluation
❌ Pattern consistency
❌ Config file compatibility

**Conclusion**: AI is a powerful assistant but critical decisions and quality control require human intervention.

## 📄 License

This project is created for educational purposes as part of BİL440 coursework.

## 🙏 Acknowledgments

- **Groq**: Free LLM API access
- **FastAPI**: Modern Python web framework
- **React + Vite**: Fast frontend development
- **Tailwind CSS**: Utility-first CSS framework

---

**Project Status**: ✅ Complete
**Tests**: ✅ 23/23 Passing
**Documentation**: ✅ Comprehensive
**Deployment**: ✅ Ready for Production
