import { useState } from 'react';
import { DocumentProvider } from './context/DocumentContext';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ThinkingLoader from './components/ThinkingLoader';
import { searchDocuments } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('documents'); // documents | search
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showThinking, setShowThinking] = useState(false);

  const handleSearch = async (query) => {
    setSearching(true);
    setSearchQuery(query);
    setSearchResults(null);
    try {
      const results = await searchDocuments(query);
      setSearchResults(results.results);
    } catch (err) {
      alert('Search failed: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <DocumentProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Document Search System
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload, search, and analyze documents with AI
            </p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('documents')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === 'documents'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === 'search'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Search
              </button>
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              >
                Test AI Loader
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'documents' && (
            <div className="space-y-8">
              {/* Upload Section */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Document
                </h2>
                <FileUpload />
              </section>

              {/* Documents List */}
              <section>
                <DocumentList />
              </section>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-8">
              {/* Search Bar */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Documents
                </h2>
                <SearchBar onSearch={handleSearch} loading={searching} />
              </section>

              {/* Search Results */}
              {searching && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {!searching && searchResults && (
                <section>
                  <SearchResults results={searchResults} query={searchQuery} />
                </section>
              )}
            </div>
          )}

          {/* Test ThinkingLoader */}
          {showThinking && (
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <ThinkingLoader message="Analyzing your documents..." />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              BİL440 Final Project - AI-Augmented Software Development
            </p>
          </div>
        </footer>
      </div>
    </DocumentProvider>
  );
}

export default App;
