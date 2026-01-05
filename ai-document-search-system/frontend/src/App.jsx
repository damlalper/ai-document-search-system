import { useState } from 'react';
import { DocumentProvider } from './context/DocumentContext';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ThinkingLoader from './components/ThinkingLoader';
import { searchDocuments } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('documents');
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
      <div className="min-h-screen bg-slate-50">
        {/* Simple Header - text-based, clean */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              AI Document Search System
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Upload, search, and analyze documents with AI
            </p>
          </div>
        </header>

        {/* Navigation Tabs - minimal, clear */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('documents')}
                className={`
                  py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === 'documents'
                      ? 'border-teal-700 text-teal-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`
                  py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === 'search'
                      ? 'border-teal-700 text-teal-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('test-ai')}
                className={`
                  py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === 'test-ai'
                      ? 'border-teal-700 text-teal-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                Test AI Loader
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content - vertical flow, generous spacing */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'documents' && (
            <div className="space-y-8">
              {/* Upload Section */}
              <section>
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
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
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
                  Search Documents
                </h2>
                <SearchBar onSearch={handleSearch} loading={searching} />
              </section>

              {/* Search Results - AI output with clear loading */}
              {searching && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-teal-700"></div>
                  <p className="mt-4 text-sm text-slate-600">Searching documents...</p>
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
          {activeTab === 'test-ai' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
                  Test AI Loading States
                </h2>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                  <ThinkingLoader message="Analyzing your documents..." />
                </div>
              </section>
            </div>
          )}
        </main>

        {/* Footer - simple, unobtrusive */}
        <footer className="mt-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-500">
              BİL440 Final Project - AI-Augmented Software Development
            </p>
          </div>
        </footer>
      </div>
    </DocumentProvider>
  );
}

export default App;
