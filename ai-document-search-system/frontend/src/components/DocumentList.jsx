// DocumentList Component
// Clean card layout with visible borders, gentle shadows, rounded-xl
// Academic Minimalism: clear separation, readable text, soft hierarchy

import { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';

const DocumentList = () => {
  const { documents, loading, error, deleteDocument } = useDocuments();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeletingId(docId);
    try {
      await deleteDocument(docId);
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-teal-700"></div>
        <p className="mt-4 text-sm text-slate-600">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800">Error loading documents: {error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-base font-medium text-slate-900">No documents yet</h3>
        <p className="mt-2 text-sm text-slate-600">
          Upload a PDF document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">
        Your Documents ({documents.length})
      </h2>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.doc_id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            {/* File Icon & Name */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate leading-relaxed">
                  {doc.filename}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(doc.uploaded_at)}
                </p>
              </div>
            </div>

            {/* Document Info */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <span>{doc.page_count || 0} pages</span>
              <span>{formatFileSize(doc.file_size || 0)}</span>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDelete(doc.doc_id, doc.filename)}
                disabled={deletingId === doc.doc_id}
                className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deletingId === doc.doc_id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
