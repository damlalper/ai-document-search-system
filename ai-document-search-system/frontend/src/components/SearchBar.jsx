// SearchBar Component
// Minimal input, strong focus state, keyboard-first (Enter supported)
// Academic Minimalism: clean, functional, no distractions

import { useState } from 'react';

const SearchBar = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter keyword and press Enter..."
            disabled={loading}
            className="w-full px-6 py-4 pr-14 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 shadow-sm group-hover:border-slate-300 transition-all duration-300"
          />
          <svg
            className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-teal-600 transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-lg font-semibold rounded-2xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-500 text-center font-medium">
        Press <kbd className="mx-1 px-2 py-0.5 text-xs text-slate-600 bg-slate-100 border border-slate-300 rounded-md shadow-sm">Enter</kbd> or click Search to find documents
      </p>
    </form>
  );
};

export default SearchBar;
