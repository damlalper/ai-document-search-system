import { useState } from 'react';
import { DocumentProvider } from './context/DocumentContext';
import { ToastProvider, useToast } from './context/ToastContext';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import QuestionAnswer from './components/QuestionAnswer';
import BulkSummarize from './components/BulkSummarize';
import { searchDocuments } from './services/api';

// Inner App component to use the toast hook
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const handleSearch = async (query) => {
    setSearching(true);
    setSearchQuery(query);
    setSearchResults(null);
    try {
      const results = await searchDocuments(query);
      setSearchResults(results.results);
      if (results.results.length === 0) {
        toast.info('No documents found matching your query.');
      } else {
        toast.success(`Found ${results.results.length} results.`);
      }
    } catch (err) {
      toast.error('Search failed: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Modern Header with gradient */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 text-white font-bold text-xl">
               AI
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Document Intelligence
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Powered by RAG & LLM
                </p>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
             <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Operational
             </span>
          </div>
        </div>
      </header>

      {/* Modern Navigation Tabs with glass effect */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-1.5 inline-flex">
          <nav className="flex space-x-1">
            {['documents', 'search', 'qa', 'summaries'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-out
                  ${
                    activeTab === tab
                      ? 'bg-white text-teal-700 shadow-md shadow-slate-200/50 ring-1 ring-slate-100 transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content with modern card layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-[fadeIn_0.5s_ease-out_forwards]">
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center border border-teal-100">
                      <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Upload Document
                      </h2>
                      <p className="text-sm text-slate-500">Supported formats: PDF, TXT</p>
                    </div>
                  </div>
                  <FileUpload />
                </div>
              </div>

              {/* Quick Stats Card - 1 column on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 text-white h-full relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-500"></div>
                  <h3 className="text-lg font-semibold mb-6 relative z-10">System Stats</h3>
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">AI Model</p>
                      <p className="text-lg font-bold text-teal-300">llama-3.1-8b</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Search Engine</p>
                      <p className="text-lg font-bold text-teal-300">Vector + TF-IDF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents List - Full width */}
              <div className="lg:col-span-3">
                <DocumentList />
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Search Bar */}
              <section className="text-center space-y-6 py-8">
                 <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  Search Intelligence
                </h2>
                <div className="max-w-2xl mx-auto">
                   <SearchBar onSearch={handleSearch} loading={searching} />
                </div>
              </section>

              {/* Search Results - AI output with clear loading */}
              {searching && (
                <div className="flex flex-col items-center justify-center py-12 animate-[fadeIn_0.5s_ease-out]">
                  <div className="relative w-24 h-24">
                     <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-100 rounded-full"></div>
                     <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="mt-6 text-slate-600 font-medium animate-pulse">Analyzing document vectors...</p>
                </div>
              )}

              {!searching && searchResults && (
                <section className="animate-[slideUp_0.5s_ease-out_forwards]">
                  <SearchResults results={searchResults} query={searchQuery} />
                </section>
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)]">
               <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 h-full overflow-hidden">
                  <QuestionAnswer />
               </div>
            </div>
          )}

          {/* Summaries Tab - Bulk document summarization */}
          {activeTab === 'summaries' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-[slideUp_0.3s_ease-out_forwards]">
               <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
                  <div className="mb-8">
                     <h2 className="text-2xl font-bold text-slate-900">Bulk Summarization</h2>
                     <p className="text-slate-500">Generate insights from multiple documents at once</p>
                  </div>
                  <BulkSummarize />
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - simple, unobtrusive */}
      <footer className="mt-16 bg-white/50 backdrop-blur-sm border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-slate-400 font-medium">
            BİL440 Final Project • AI-Augmented Software Development
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <DocumentProvider>
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    </DocumentProvider>
  );
}

export default App;
