// API Service Layer
// Supports both MOCK mode (for development) and REAL mode (when backend is ready)

import {
  mockDocuments,
  mockSearchResults,
  mockAIResponse,
  mockSummary,
} from '../data/mockData';

// Toggle between mock and real API
const USE_MOCK_DATA = true; // Set to false when backend is ready

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

export const uploadDocument = async (file) => {
  if (USE_MOCK_DATA) {
    await delay(1000); // Simulate upload time
    return {
      doc_id: `mock-${Date.now()}`,
      filename: file.name,
      status: 'success',
      uploaded_at: new Date().toISOString(),
    };
  }

  // Real API call (native fetch, no axios as per AI decision)
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
    // NOTE: Do NOT set Content-Type header manually!
    // Browser will set it automatically with boundary for multipart/form-data
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return await response.json();
};

export const getDocuments = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return {
      documents: mockDocuments,
      total: mockDocuments.length,
    };
  }

  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return await response.json();
};

export const getDocument = async (docId) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    const doc = mockDocuments.find((d) => d.doc_id === docId);
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  const response = await fetch(`${API_BASE_URL}/documents/${docId}`);

  if (!response.ok) {
    throw new Error('Document not found');
  }

  return await response.json();
};

export const deleteDocument = async (docId) => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return {
      status: 'success',
      message: `Document ${docId} deleted successfully`,
    };
  }

  const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }

  return await response.json();
};

// ============================================
// SEARCH (Classical TF-IDF, NO AI)
// ============================================

export const searchDocuments = async (query, topK = 5) => {
  if (USE_MOCK_DATA) {
    await delay(800);
    return {
      query,
      results: mockSearchResults,
      total_found: mockSearchResults.length,
    };
  }

  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      top_k: topK,
    }),
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return await response.json();
};

// ============================================
// AI FEATURES (Backend not ready yet)
// ============================================

export const summarizeDocument = async (docId, summaryType = 'short') => {
  if (USE_MOCK_DATA) {
    await delay(2000); // Simulate AI processing time
    return {
      doc_id: docId,
      summary_type: summaryType,
      summary: summaryType === 'short' ? mockSummary.short : mockSummary.detailed,
    };
  }

  // Backend endpoint not implemented yet
  const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      doc_id: docId,
      summary_type: summaryType,
    }),
  });

  if (!response.ok) {
    throw new Error('Summarization failed');
  }

  return await response.json();
};

export const askQuestion = async (question, docIds = null) => {
  if (USE_MOCK_DATA) {
    await delay(2500); // Simulate AI processing time
    return {
      question,
      answer: mockAIResponse.answer,
      sources: mockAIResponse.sources,
    };
  }

  // Backend endpoint not implemented yet
  const response = await fetch(`${API_BASE_URL}/ai/qa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      doc_ids: docIds,
    }),
  });

  if (!response.ok) {
    throw new Error('Q&A failed');
  }

  return await response.json();
};
