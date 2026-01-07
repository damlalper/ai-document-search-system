// SearchResults Component
// Sources clearly separated, readable excerpts, clean card layout
// Academic Minimalism: supports explainability and trust

import { useState } from 'react';
import { summarizeDocument } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Skeleton } from './ui/Skeleton';

const SearchResults = ({ results, query }) => {
  const [summaryLoading, setSummaryLoading] = useState({});
  const [summaries, setSummaries] = useState({});
  const [summaryTypes, setSummaryTypes] = useState({}); // Track summary type per document
  const toast = useToast();

  const handleSummarize = async (docId, summaryType = 'short') => {
    setSummaryLoading((prev) => ({ ...prev, [docId]: true }));
    try {
      const response = await summarizeDocument(docId, summaryType);
      setSummaries((prev) => ({ ...prev, [docId]: response.summary }));
      setSummaryTypes((prev) => ({ ...prev, [docId]: summaryType }));
      toast.success(`${summaryType === 'short' ? 'Short' : 'Detailed'} summary generated.`);
    } catch (error) {
      console.error('Summarization failed:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [docId]: false }));
    }
  };

  if (!results) {
    // Initial loading state (skeletons)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-4">
               <Skeleton className="h-6 w-1/3" />
               <Skeleton className="h-6 w-16" />
             </div>
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <Skeleton className="h-4 w-4/6" />
             </div>
             <div className="mt-6 flex gap-2">
               <Skeleton className="h-8 w-24 rounded-xl" />
               <Skeleton className="h-8 w-24 rounded-xl" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">No matching documents found</h3>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your search terms or check for typos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Results for <span className="text-teal-700">"{query}"</span>
        </h3>
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 uppercase tracking-wider">
          {results.length} Matches
        </span>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={`${result.doc_id}-${index}`}
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Document Name & Score */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center border border-teal-100">
                    <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">
                      {result.filename}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Relevance Score</p>
                 </div>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-teal-600">
                    {(result.score * 100).toFixed(0)}%
                  </span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                     <div 
                        className="h-full bg-teal-500 rounded-full" 
                        style={{ width: `${result.score * 100}%` }}
                     ></div>
                  </div>
              </div>
            </div>

            {/* Snippet */}
            <div className="mt-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-teal-300 pl-3">
                  "... {result.snippet} ..."
                </p>
            </div>

            {/* Summary Display */}
            {summaries[result.doc_id] && (
              <div className="mt-4 p-5 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-xl animate-fade-in shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                        AI Summary ({summaryTypes[result.doc_id] === 'detailed' ? 'Detailed' : 'Short'})
                     </p>
                  </div>
                  <button
                    onClick={() => setSummaries((prev) => ({ ...prev, [result.doc_id]: null }))}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Close
                  </button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {summaries[result.doc_id]}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSummarize(result.doc_id, 'short')}
                  disabled={summaryLoading[result.doc_id]}
                  className="px-4 py-2 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-teal-700 border border-slate-200 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                  {summaryLoading[result.doc_id] && summaryTypes[result.doc_id] === 'short' ? (
                      <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> Summarizing...</span>
                  ) : 'Short Summary'}
                </button>
                <button
                  onClick={() => handleSummarize(result.doc_id, 'detailed')}
                  disabled={summaryLoading[result.doc_id]}
                  className="px-4 py-2 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-teal-700 border border-slate-200 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                  {summaryLoading[result.doc_id] && summaryTypes[result.doc_id] === 'detailed' ? (
                     <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> Analyzing...</span>
                  ) : 'Detailed Summary'}
                </button>
              </div>

              <a
                href={`http://localhost:8000/api/v1/documents/${result.doc_id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-teal-600 hover:text-teal-800 transition-colors text-xs uppercase tracking-wide px-3 py-2 rounded-lg hover:bg-teal-50"
              >
                <span>View File</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
