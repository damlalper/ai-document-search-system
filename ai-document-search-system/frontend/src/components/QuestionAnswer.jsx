// QuestionAnswer Component
// Natural language Q&A with document-based answers
// Academic Minimalism: Clear question input, visible sources with excerpts

import { useState } from 'react';
import { askQuestion } from '../services/api';

const QuestionAnswer = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (err) {
      console.error('Q&A failed:', err);
      setError('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Question Input Form */}
      <form onSubmit={handleAsk} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <label htmlFor="question" className="block text-sm font-medium text-slate-900 mb-3">
          Ask a question about your documents
        </label>
        <div className="flex gap-3">
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are the main topics discussed in the documents?"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
          {(answer || error) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-teal-700"></div>
          <p className="mt-4 text-sm text-slate-600">AI is analyzing documents to answer your question...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Answer Display */}
      {answer && !loading && (
        <div className="space-y-6">
          {/* Question Echo */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Your Question
            </p>
            <p className="text-base text-slate-900">
              {answer.question}
            </p>
          </div>

          {/* Answer */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <p className="text-xs font-semibold text-teal-900 uppercase tracking-wide mb-3">
              AI Answer
            </p>
            <p className="text-base text-slate-900 leading-relaxed whitespace-pre-wrap">
              {answer.answer}
            </p>
          </div>

          {/* Sources */}
          {answer.sources && answer.sources.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Sources ({answer.sources.length})
              </p>
              <div className="space-y-4">
                {answer.sources.map((source, index) => (
                  <div
                    key={source.doc_id}
                    className="border-l-4 border-teal-700 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 text-sm">
                        {index + 1}. {source.filename}
                      </p>
                      <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded">
                        {(source.relevance_score * 100).toFixed(1)}% match
                      </span>
                    </div>
                    {source.excerpt && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        "{source.excerpt}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Sources Warning */}
          {(!answer.sources || answer.sources.length === 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-sm text-amber-800">
                ⚠️ No specific sources found. The answer may be based on general knowledge rather than your documents.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
