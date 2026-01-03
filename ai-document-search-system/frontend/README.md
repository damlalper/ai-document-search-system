# Frontend - AI Document Search System

React + Vite + Tailwind CSS frontend for the AI-powered document search and summarization system.

## Tech Stack

Based on AI decision analysis (see `/docs/AI_DECISION_LOG.md`):

- **Framework:** React 19
- **Build Tool:** Vite 7
- **CSS:** Tailwind CSS 4
- **State Management:** Context API (no Redux/React Query)
- **API Calls:** Native `fetch()` (no axios)
- **No UI libraries** (no Material UI, Bootstrap, or component libraries)

## Project Structure

```
src/
├── components/       # React components
├── context/          # Context API providers
├── services/         # API service layer (fetch)
├── pages/            # Page components
├── App.jsx           # Main app
├── main.jsx          # Entry point
└── index.css         # Tailwind directives
```

## Development

```bash
npm install
npm run dev
```

## Architecture Decisions

All architecture decisions were made by consulting 3 AI assistants (Gemini, ChatGPT, GitHub Copilot) and documented in `AI_DECISION_LOG.md`.

Key rejected suggestions:
- ❌ Material UI (too heavy)
- ❌ React Query (overkill for this project)
- ❌ axios (native fetch sufficient)
- ❌ react-dropzone (custom implementation)
