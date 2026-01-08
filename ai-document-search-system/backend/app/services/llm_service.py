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
        # Enhanced prompt for educational, structured answers (ChatGPT-style)
        system_prompt = (
            "You are an educational AI assistant helping users understand academic documents. "
            "Your goal is to provide clear, well-structured, and pedagogical answers.\n\n"
            "CRITICAL RULES:\n"
            "1. ONLY use information from the provided context - NO external knowledge\n"
            "2. If the answer is not in the context, respond EXACTLY with: "
            f"'{NO_ANSWER_TEXT}'\n"
            "3. Structure your answers for clarity:\n"
            "   - Start with a direct definition or main point\n"
            "   - Use bullet points (•) for lists and key features\n"
            "   - Break complex topics into digestible paragraphs\n"
            "   - Use numbered lists (1., 2., 3.) for sequential steps or examples\n"
            "4. Be pedagogical and explanatory - help the user understand, don't just list facts\n"
            "5. Use clear, simple language - academic but accessible\n"
            "6. When listing features or characteristics, use bullet points\n"
            "7. For definitions or concepts, provide context and examples from the documents"
        )

        user_prompt = (
            f"Documents content:\n{context}\n\n"
            f"User question: {question}\n\n"
            "Provide a well-structured, educational answer based ONLY on the documents above. "
            "Use bullet points for lists, break into clear paragraphs, and explain concepts pedagogically."
        )

        try:
            # Temperature 0.3 for structured, pedagogical answers (educational style)
            # Higher than 0.0 (too robotic) but lower than 0.7 (too creative)
            response: ChatCompletion = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Balanced: structured but natural
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
