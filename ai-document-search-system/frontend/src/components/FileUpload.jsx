// FileUpload Component
// Clean drag & drop, clear affordance, no visual clutter
// Academic Minimalism: functional, professional, no unnecessary decoration

import { useState } from 'react';
import { uploadDocument } from '../services/api';
import { useDocuments } from '../context/DocumentContext';

const FileUpload = () => {
  const { addDocument, refreshDocuments } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateFile = (file) => {
    // Allowed file types: PDF, TXT, MD
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const allowedExtensions = ['.pdf', '.txt', '.md'];

    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const hasValidType = allowedTypes.includes(file.type);

    if (!hasValidExtension && !hasValidType) {
      return 'Only PDF, TXT, and MD files are allowed';
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleUpload = async (file) => {
    setError(null);
    setSuccess(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadDocument(file);
      addDocument({
        doc_id: result.doc_id,
        filename: result.filename,
        uploaded_at: result.uploaded_at,
        page_count: 0,
        file_size: file.size,
      });
      setSuccess(`${file.name} uploaded successfully!`);
      setTimeout(() => refreshDocuments(), 1000);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging
            ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 scale-105 shadow-2xl shadow-teal-500/20'
            : 'border-slate-300 bg-gradient-to-br from-white to-slate-50 hover:border-teal-400 hover:shadow-xl'
          }
          ${uploading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiMxNGI4YTYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

        <input
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        <div className="relative space-y-4">
          {/* Icon with gradient background */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 transform transition-transform hover:scale-110">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {uploading ? (
            <div className="space-y-3">
              <p className="text-base font-semibold text-slate-900">Uploading document...</p>
              <div className="w-48 mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 animate-pulse"></div>
              </div>
              <p className="text-xs text-slate-500">Please wait</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-base font-semibold text-slate-900 mb-2">
                  Drop your document here
                </p>
                <p className="text-sm text-slate-600">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="px-3 py-1 bg-white rounded-full border border-slate-200">PDF</span>
                <span className="px-3 py-1 bg-white rounded-full border border-slate-200">TXT</span>
                <span className="px-3 py-1 bg-white rounded-full border border-slate-200">MD</span>
                <span className="text-slate-400">•</span>
                <span>Max 10MB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
