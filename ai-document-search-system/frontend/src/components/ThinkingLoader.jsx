// ThinkingLoader Component
// "Thinking..." animation for AI processing (NO skeleton screen as per AI decision)

const ThinkingLoader = ({ message = 'AI is thinking...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Robot/AI Icon */}
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center animate-pulse">
          <svg
            className="h-8 w-8 text-teal-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>

      {/* Dot animation */}
      <div className="mt-2 flex space-x-1">
        <div className="h-2 w-2 bg-teal-700 rounded-full animate-bounce"></div>
        <div
          className="h-2 w-2 bg-teal-700 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="h-2 w-2 bg-teal-700 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>

      {/* Sub-message */}
      <p className="mt-3 text-sm text-gray-500">
        Analyzing documents and generating response...
      </p>
    </div>
  );
};

export default ThinkingLoader;
