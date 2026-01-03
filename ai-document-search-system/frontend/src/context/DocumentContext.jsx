// DocumentContext - Global State Management with Context API
// (No Redux or React Query - as per AI decision log)

import { createContext, useContext, useState, useEffect } from 'react';
import { getDocuments, deleteDocument as deleteDocumentAPI } from '../services/api';

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch documents on mount
  useEffect(() => {
    refreshDocuments();
  }, []);

  const refreshDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDocument = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = async (docId) => {
    setError(null);
    try {
      await deleteDocumentAPI(docId);
      setDocuments((prev) => prev.filter((doc) => doc.doc_id !== docId));
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete document:', err);
      throw err;
    }
  };

  const value = {
    documents,
    loading,
    error,
    refreshDocuments,
    addDocument,
    deleteDocument,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
