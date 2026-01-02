"""
[AI-assisted] LLM Service for Document Summarization and Q&A
Hybrid implementation combining:
- Gemini: Correct Groq API usage, error handling
- GitHub Copilot: NO_ANSWER_TEXT constant, temperature=0.0 for QA
- Claude Code: Class structure, strict prompts, variable temperature

CRITICAL: This is a RAG system - hallucination prevention is paramount
"""

import logging
from typing import Optional
from groq import Groq
from groq.types.chat import ChatCompletion
from groq import RateLimitError, APIError

from app.config import settings

logger = logging.getLogger(__name__)

# Hallucination prevention constant (from GitHub Copilot suggestion)
NO_ANSWER_TEXT = (
    "Based on the provided documents, I cannot find specific information "
    "to answer this question. Please try rephrasing or ask about content "
    "that exists in the uploaded documents."
)


class LLMService:
    """
    LLM service using Groq API for document summarization and Q&A

    Design decisions:
    - Temperature 0.0 for QA (deterministic, no hallucination)
    - Temperature 0.3/0.7 for summaries (creative but controlled)
    - Strict system prompts to enforce context boundaries
    """

    def __init__(self):
        """Initialize Groq client with API key from settings"""
        self.client = Groq(api_key=settings.groq_api_key)
        self.default_model = settings.default_model
        logger.info(f"LLMService initialized with model: {self.default_model}")

    def summarize(self, text: str, summary_type: str = "short") -> str:
        """
        Generate document summary using LLM

        Args:
            text: Full document text to summarize
            summary_type: "short" (3-5 sentences) or "detailed" (1-2 paragraphs)

        Returns:
            Generated summary text

        Raises:
            Exception: If LLM API call fails
        """
        # Variable temperature based on summary type (Claude's idea)
        temperature = 0.3 if summary_type == "short" else 0.7

        # Construct prompt based on type
        if summary_type == "short":
            user_prompt = (
                f"Provide a concise summary (3-5 sentences) of the following document:\n\n"
                f"{text}"
            )
        else:
            user_prompt = (
                f"Provide a detailed summary (1-2 paragraphs) of the following document, "
                f"highlighting key points and main arguments:\n\n{text}"
            )

        system_prompt = (
            "You are a document analysis assistant specializing in creating accurate "
            "and concise summaries. Focus on the main ideas and key information."
        )

        try:
            # Correct Groq API usage (from Gemini)
            response: ChatCompletion = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=settings.max_tokens
            )

            summary = response.choices[0].message.content.strip()
            logger.info(f"Generated {summary_type} summary ({len(summary)} chars)")
            return summary

        except RateLimitError:
            logger.error("Groq API rate limit exceeded")
            raise Exception("Rate limit exceeded. Please try again later.")

        except APIError as e:
            logger.error(f"Groq API error during summarization: {str(e)}")
            raise Exception(f"AI service error: {str(e)}")

        except Exception as e:
            logger.error(f"Unexpected error in summarize: {str(e)}")
            raise Exception(f"Summarization failed: {str(e)}")

    def answer_question(self, context: str, question: str) -> str:
        """
        Answer question using RAG (Retrieval-Augmented Generation)

        CRITICAL: Uses temperature=0.0 to prevent hallucination
        CRITICAL: Strict system prompt to enforce context-only answers

        Args:
            context: Retrieved document text (from TF-IDF search)
            question: User's natural language question

        Returns:
            Answer based on context, or NO_ANSWER_TEXT if not found

        Raises:
            Exception: If LLM API call fails
        """
        # Strict prompt to prevent hallucination (Claude's approach)
        system_prompt = (
            "You are a question-answering assistant for a document search system. "
            "CRITICAL RULES:\n"
            "1. ONLY use information from the provided context to answer questions\n"
            "2. If the answer is not in the context, respond EXACTLY with: "
            f"'{NO_ANSWER_TEXT}'\n"
            "3. Do NOT use external knowledge or make assumptions\n"
            "4. Be concise and factual\n"
            "5. Quote relevant parts of the context when possible"
        )

        user_prompt = (
            f"Context from documents:\n{context}\n\n"
            f"Question: {question}\n\n"
            f"Answer based ONLY on the context above:"
        )

        try:
            # Temperature 0.0 for deterministic, factual answers (Copilot's idea)
            response: ChatCompletion = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.0,  # Deterministic mode - no creativity needed
                max_tokens=settings.max_tokens
            )

            answer = response.choices[0].message.content.strip()
            logger.info(f"Generated answer for question: {question[:50]}...")
            return answer

        except RateLimitError:
            logger.error("Groq API rate limit exceeded")
            raise Exception("Rate limit exceeded. Please try again later.")

        except APIError as e:
            logger.error(f"Groq API error during Q&A: {str(e)}")
            raise Exception(f"AI service error: {str(e)}")

        except Exception as e:
            logger.error(f"Unexpected error in answer_question: {str(e)}")
            raise Exception(f"Question answering failed: {str(e)}")


# Global LLM service instance
llm_service = LLMService()
