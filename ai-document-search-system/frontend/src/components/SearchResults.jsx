// SearchResults Component
// Sources clearly separated, readable excerpts, clean card layout
// Academic Minimalism: supports explainability and trust

import { useState } from 'react';
import { summarizeDocument } from '../services/api';

const SearchResults = ({ results, query }) => {
  const [summaryLoading, setSummaryLoading] = useState({});
  const [summaries, setSummaries] = useState({});

  const handleSummarize = async (docId) => {
    setSummaryLoading((prev) => ({ ...prev, [docId]: true }));
    try {
      const response = await summarizeDocument(docId, 'short');
      setSummaries((prev) => ({ ...prev, [docId]: response.summary }));
    } catch (error) {
      console.error('Summarization failed:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [docId]: false }));
    }
  };

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-14 w-14 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-base font-medium text-slate-900">No results found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Search Results for "{query}" ({results.length})
      </h3>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={`${result.doc_id}-${index}`}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            {/* Document Name & Score */}
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-base font-medium text-slate-900 leading-relaxed flex-1">
                {result.filename}
              </h4>
              <span className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 rounded-md border border-teal-200">
                {(result.score * 100).toFixed(1)}% match
              </span>
            </div>

            {/* Snippet */}
            <p className="mt-3 text-sm text-slate-700 leading-relaxed line-clamp-3">
              {result.snippet}
            </p>

            {/* Summary Display */}
            {summaries[result.doc_id] && (
              <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="text-xs font-semibold text-teal-900 mb-1">AI Summary:</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {summaries[result.doc_id]}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-4 text-sm">
              <a
                href={`http://localhost:8000/api/v1/documents/${result.doc_id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:text-teal-900 transition-colors"
              >
                View Document
              </a>
              <button
                onClick={() => handleSummarize(result.doc_id)}
                disabled={summaryLoading[result.doc_id]}
                className="text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {summaryLoading[result.doc_id] ? 'Summarizing...' : 'Summarize'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
