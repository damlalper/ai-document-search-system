// DocumentList Component
// Clean card layout with visible borders, gentle shadows, rounded-xl
// Academic Minimalism: clear separation, readable text, soft hierarchy

import { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from './ui/Skeleton';

const DocumentList = () => {
  const { documents, loading, error, deleteDocument } = useDocuments();
  const [deletingId, setDeletingId] = useState(null);
  const toast = useToast();

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeletingId(docId);
    try {
      await deleteDocument(docId);
      toast.success(`Deleted "${filename}" successfully.`);
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                   <Skeleton className="w-12 h-12 rounded-xl" />
                   <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                   </div>
                </div>
                <div className="mt-6 flex justify-between gap-2">
                   <Skeleton className="h-6 w-20" />
                   <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="mt-6 h-10 w-full rounded-xl" />
             </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 animate-fade-in">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div>
          <h3 className="font-semibold text-red-900">Unable to load documents</h3>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed animate-fade-in">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg
            className="h-10 w-10 text-slate-400"
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
        </div>
        <h3 className="mt-2 text-lg font-medium text-slate-900">No documents uploaded</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Upload a PDF or TXT file to start analyzing and chatting with your documents.
        </p>
      </div>
    );
  }

  const getFileIcon = (filename) => {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'pdf') {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 transform group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (ext === 'txt') {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Your Documents
        </h2>
        <span className="px-4 py-1.5 bg-white text-teal-700 text-sm font-semibold rounded-full border border-teal-100 shadow-sm">
          {documents.length} Total
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc, index) => (
          <div
            key={doc.doc_id}
            className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-teal-200/50 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* File Icon & Name */}
            <div className="relative flex items-start space-x-4">
              {getFileIcon(doc.filename)}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-base font-semibold text-slate-900 truncate leading-snug mb-1 group-hover:text-teal-700 transition-colors">
                  {doc.filename}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {formatDate(doc.uploaded_at)}
                </p>
              </div>
            </div>

            {/* Document Info */}
            <div className="relative mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600">
                    {doc.page_count || 'N/A'} pgs
                  </p>
                </div>
                <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600">
                    {formatFileSize(doc.file_size || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="relative mt-6 pt-4 border-t border-slate-50">
              <button
                onClick={() => handleDelete(doc.doc_id, doc.filename)}
                disabled={deletingId === doc.doc_id}
                className="w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-inner"
              >
                {deletingId === doc.doc_id ? (
                    <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Remove File
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
