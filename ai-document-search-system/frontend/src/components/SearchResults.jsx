// SearchResults Component
// Displays search results with scores and snippets

const SearchResults = ({ results, query }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Search Results for "{query}" ({results.length})
      </h3>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={`${result.doc_id}-${index}`}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Document Name & Score */}
            <div className="flex items-start justify-between">
              <h4 className="text-base font-medium text-gray-900 flex-1">
                {result.filename}
              </h4>
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                {(result.score * 100).toFixed(1)}% match
              </span>
            </div>

            {/* Snippet */}
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {result.snippet}
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Document
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                Summarize
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
