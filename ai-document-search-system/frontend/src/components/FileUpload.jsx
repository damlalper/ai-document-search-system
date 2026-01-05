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
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
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
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 rounded-xl p-10 text-center
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-teal-600 bg-teal-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
          }
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-3">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            strokeWidth={1.5}
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">Uploading...</p>
              <div className="w-32 mx-auto h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-700 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-900">
                Drag & drop a PDF file here, or click to select
              </p>
              <p className="text-xs text-slate-500">Maximum file size: 10MB</p>
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
