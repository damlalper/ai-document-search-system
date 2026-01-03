// Mock data for development (until backend is ready)

export const mockDocuments = [
  {
    doc_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    filename: 'Machine_Learning_Intro.pdf',
    uploaded_at: '2025-01-02T10:30:00',
    page_count: 15,
    file_size: 2048000, // ~2MB
  },
  {
    doc_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    filename: 'Deep_Learning_Basics.pdf',
    uploaded_at: '2025-01-02T14:20:00',
    page_count: 25,
    file_size: 3584000, // ~3.5MB
  },
  {
    doc_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    filename: 'Neural_Networks.pdf',
    uploaded_at: '2025-01-03T09:15:00',
    page_count: 18,
    file_size: 2621440, // ~2.5MB
  },
];

export const mockSearchResults = [
  {
    doc_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    filename: 'Machine_Learning_Intro.pdf',
    score: 0.8523,
    snippet: '...machine learning algorithms are widely used in classification tasks. Supervised learning methods require labeled data...',
  },
  {
    doc_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    filename: 'Deep_Learning_Basics.pdf',
    score: 0.7231,
    snippet: '...deep neural networks consist of multiple layers. Each layer learns different features from the input data...',
  },
];

export const mockAIResponse = {
  answer: 'Machine learning is a subset of artificial intelligence that focuses on building systems that can learn from and make decisions based on data. It involves training algorithms on datasets to recognize patterns and make predictions without being explicitly programmed for specific tasks.',
  sources: [
    {
      doc_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      filename: 'Machine_Learning_Intro.pdf',
      page: 3,
      snippet: 'Machine learning enables computers to learn from experience...',
    },
  ],
};

export const mockSummary = {
  short: 'This document provides an introduction to machine learning concepts, algorithms, and applications.',
  detailed: 'This comprehensive document covers the fundamental concepts of machine learning, including supervised and unsupervised learning methods. It explores various algorithms such as decision trees, support vector machines, and neural networks. The document also discusses real-world applications in fields like healthcare, finance, and autonomous systems. Key topics include data preprocessing, feature engineering, model evaluation, and avoiding overfitting.',
};
