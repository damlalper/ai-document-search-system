"""
[Human-written] Classical Search Service
Uses TF-IDF for keyword-based search - NO AI, purely statistical method
"""

import json
from pathlib import Path
from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from unidecode import unidecode  # Turkish character normalization

from app.config import settings
from app.services.pdf_service import load_extracted_text
from app.utils.text_utils import extract_snippet


class SearchService:
    """Classical TF-IDF based search service (no AI)"""

    def __init__(self):
        # Normalize Turkish characters for better search results
        # İ→i, Ş→s, Ç→c, Ğ→g, Ü→u, Ö→o
        def turkish_normalizer(text):
            """
            Normalize Turkish and English text for TF-IDF.
            Converts Turkish characters to ASCII equivalents.
            Example: "BİTİRME" → "bitirme", "çalışma" → "calisma"
            """
            return unidecode(text).lower()

        self.vectorizer = TfidfVectorizer(
            max_features=settings.tfidf_max_features,
            stop_words='english',
            lowercase=False,  # We handle lowercasing in preprocessor
            preprocessor=turkish_normalizer
        )
        self.doc_vectors = None
        self.doc_ids = []
        self.doc_texts = {}

    def load_documents(self) -> None:
        """
        Load all documents from metadata and build search index
        """
        metadata_path = settings.metadata_file

        if not metadata_path.exists():
            self.doc_ids = []
            self.doc_texts = {}
            return

        with open(metadata_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)

        documents = metadata.get('documents', [])

        if not documents:
            self.doc_ids = []
            self.doc_texts = {}
            return

        # Load text for each document
        texts = []
        valid_docs = []

        for doc in documents:
            doc_id = doc['doc_id']
            try:
                text = load_extracted_text(doc_id)
                texts.append(text)
                valid_docs.append(doc)
                self.doc_texts[doc_id] = text
            except FileNotFoundError:
                # Skip documents with missing text files
                continue

        if texts:
            self.doc_ids = [doc['doc_id'] for doc in valid_docs]
            # Build TF-IDF matrix
            self.doc_vectors = self.vectorizer.fit_transform(texts)

    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Search documents using TF-IDF cosine similarity

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of search results with scores
        """
        if not self.doc_ids or self.doc_vectors is None:
            return []

        # Transform query to TF-IDF vector
        query_vector = self.vectorizer.transform([query])

        # Calculate cosine similarity
        similarities = cosine_similarity(query_vector, self.doc_vectors).flatten()

        # Get top K results
        top_indices = np.argsort(similarities)[::-1][:top_k]

        # Filter out results with zero similarity
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score > 0:
                doc_id = self.doc_ids[idx]
                text = self.doc_texts[doc_id]
                snippet = extract_snippet(text, query, context_words=15)

                results.append({
                    'doc_id': doc_id,
                    'score': round(score, 4),
                    'snippet': snippet
                })

        return results

    def rebuild_index(self) -> None:
        """Rebuild the search index from scratch"""
        self.load_documents()


# Global search service instance
search_service = SearchService()
