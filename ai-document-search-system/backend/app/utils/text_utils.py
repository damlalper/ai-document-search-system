"""
[Human-written] Text Processing Utilities
Classical text cleaning and chunking using deterministic methods (no AI)
"""

import re
from typing import List


def clean_text(text: str) -> str:
    """
    Clean text using classical regex-based methods

    Args:
        text: Raw text to clean

    Returns:
        Cleaned text with normalized whitespace and removed special characters
    """
    # Remove multiple whitespaces
    text = re.sub(r'\s+', ' ', text)

    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?;:()\-\'\"]+', '', text)

    # Normalize line breaks
    text = text.replace('\n', ' ').replace('\r', '')

    # Trim leading/trailing whitespace
    text = text.strip()

    return text


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Split text into chunks using word-based chunking (no AI)

    Args:
        text: Text to chunk
        chunk_size: Approximate number of words per chunk
        overlap: Number of words to overlap between chunks

    Returns:
        List of text chunks
    """
    words = text.split()
    chunks = []

    if len(words) <= chunk_size:
        return [text]

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk = ' '.join(chunk_words)
        chunks.append(chunk)

        # Move start position with overlap
        start = end - overlap if end < len(words) else len(words)

    return chunks


def extract_snippet(text: str, query: str, context_words: int = 10) -> str:
    """
    Extract a snippet around the first occurrence of query in text

    Args:
        text: Full text
        query: Search query
        context_words: Number of words to include before and after match

    Returns:
        Text snippet with highlighted context
    """
    words = text.split()
    query_words = query.lower().split()

    # Find first occurrence of query
    for i in range(len(words)):
        if query_words[0].lower() in words[i].lower():
            start = max(0, i - context_words)
            end = min(len(words), i + len(query_words) + context_words)

            snippet = ' '.join(words[start:end])

            # Add ellipsis if truncated
            if start > 0:
                snippet = '...' + snippet
            if end < len(words):
                snippet = snippet + '...'

            return snippet

    # If query not found, return first N words
    return ' '.join(words[:context_words * 2]) + '...'
