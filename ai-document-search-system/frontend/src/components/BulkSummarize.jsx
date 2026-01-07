// BulkSummarize Component - Batch document summarization
// Generate summaries for all uploaded documents

import { useState, useEffect } from 'react';
import { getDocuments, summarizeDocument } from '../services/api';

const BulkSummarize = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState({});
  const [summaryTypes, setSummaryTypes] = useState({});
  const [processingDocs, setProcessingDocs] = useState({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (docId, summaryType = 'short') => {
    setProcessingDocs(prev => ({ ...prev, [docId]: true }));

    try {
      const result = await summarizeDocument(docId, summaryType);
      setSummaries(prev => ({ ...prev, [docId]: result.summary }));
      setSummaryTypes(prev => ({ ...prev, [docId]: summaryType }));
    } catch (error) {
      console.error('Summarization failed:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setProcessingDocs(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleClearSummary = (docId) => {
    setSummaries(prev => {
      const newSummaries = { ...prev };
      delete newSummaries[docId];
      return newSummaries;
    });
    setSummaryTypes(prev => {
      const newTypes = { ...prev };
      delete newTypes[docId];
      return newTypes;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-teal-700"></div>
        <p className="mt-4 text-sm text-slate-600">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No Documents Yet
        </h3>
        <p className="text-sm text-slate-600">
          Upload some documents first to generate summaries
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Document Summaries
          </h3>
        </div>
        <p className="text-sm text-slate-600 ml-1">
          Generate AI-powered summaries for your uploaded documents. Choose between short (3-5 sentences) or detailed (1-2 paragraphs) summaries.
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.doc_id}
            className="group relative bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-xl hover:border-teal-200 hover:scale-[1.01] transition-all duration-300"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-600/0 group-hover:from-teal-500/5 group-hover:to-teal-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>

            {/* Document Header */}
            <div className="relative flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">
                  {doc.filename}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  {doc.page_count && <span>• {doc.page_count} pages</span>}
                </div>
              </div>
            </div>

            {/* Summary Actions */}
            {!summaries[doc.doc_id] && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSummarize(doc.doc_id, 'short')}
                  disabled={processingDocs[doc.doc_id]}
                  className="px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-xl hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processingDocs[doc.doc_id] ? 'Generating...' : 'Short Summary'}
                </button>
                <button
                  onClick={() => handleSummarize(doc.doc_id, 'detailed')}
                  disabled={processingDocs[doc.doc_id]}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processingDocs[doc.doc_id] ? 'Generating...' : 'Detailed Summary'}
                </button>
              </div>
            )}

            {/* Loading State */}
            {processingDocs[doc.doc_id] && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-200 border-t-teal-700"></div>
                  <p className="text-sm text-slate-600">AI is analyzing the document and generating summary...</p>
                </div>
              </div>
            )}

            {/* Summary Display */}
            {summaries[doc.doc_id] && !processingDocs[doc.doc_id] && (
              <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-teal-900">
                      AI Summary ({summaryTypes[doc.doc_id] === 'detailed' ? 'Detailed' : 'Short'})
                    </span>
                    <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      llama-3.1-8b-instant
                    </span>
                  </div>
                  <button
                    onClick={() => handleClearSummary(doc.doc_id)}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    ✕ Clear
                  </button>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {summaries[doc.doc_id]}
                </p>

                {/* Regenerate Options */}
                <div className="mt-3 pt-3 border-t border-teal-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">Regenerate:</span>
                  <button
                    onClick={() => handleSummarize(doc.doc_id, 'short')}
                    className="text-xs px-3 py-1 bg-white border border-teal-300 text-teal-800 rounded hover:bg-teal-50 transition-colors"
                  >
                    Short
                  </button>
                  <button
                    onClick={() => handleSummarize(doc.doc_id, 'detailed')}
                    className="text-xs px-3 py-1 bg-white border border-teal-300 text-teal-800 rounded hover:bg-teal-50 transition-colors"
                  >
                    Detailed
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkSummarize;
