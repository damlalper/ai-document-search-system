// QuestionAnswer Component - Chat-Style Conversation UI
// Interactive chatbot experience with conversation history
// Formatted AI responses with bullet points and better readability

import { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../services/api';
import { useToast } from '../context/ToastContext';

const QuestionAnswer = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAsk = async (e, overrideQuestion = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const textToAsk = overrideQuestion || question;

    if (!textToAsk.trim()) {
      return;
    }

    const currentQuestion = textToAsk.trim();
    setQuestion('');
    setLoading(true);

    // Add user message to conversation
    const userMessage = {
      type: 'user',
      content: currentQuestion,
      timestamp: new Date().toISOString()
    };
    setConversation(prev => [...prev, userMessage]);

    try {
      const result = await askQuestion(currentQuestion);

      // Add AI response to conversation
      const aiMessage = {
        type: 'ai',
        content: result.answer,
        sources: result.sources || [],
        model: result.model_used,
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Q&A failed:', err);
      toast.error('Failed to get answer: ' + err.message);

      // Add error message to conversation
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setConversation([]);
    toast.info('Conversation cleared.');
    inputRef.current?.focus();
  };

  // Format AI answer with better readability
  const formatAnswer = (text) => {
    // Split by newlines and process
    const lines = text.split('\n').filter(line => line.trim());

    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          // Check if line is a bullet point or numbered list
          if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
            return (
              <div key={index} className="flex gap-3">
                <span className="text-teal-600 font-bold flex-shrink-0 mt-1">•</span>
                <p className="text-slate-700 leading-relaxed flex-1">
                  {trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}
                </p>
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-slate-700 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden relative">
      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8 pb-32">
        {conversation.length === 0 && !loading ? (
          /* Empty State - Modern & Clean */
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl flex items-center justify-center mb-8 shadow-sm transform -rotate-3 transition-transform hover:rotate-0 duration-300">
              <svg className="w-12 h-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
              How can I help you today?
            </h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
              I can analyze your uploaded documents, answer specific questions, or generate summaries.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto px-4">
              {[
                "Low-code nedir ve nasıl kullanılır?",
                "Kalite ölçüm metrikleri nelerdir?",
                "Dokümanın ana fikrini özetle.",
                "Bu projenin temel amacı nedir?",
                "Yazılım geliştirme süreçleri nelerdir?"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleAsk(e, suggestion)}
                  className="group relative p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-sm hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div className="mb-3">
                     <span className="inline-block p-2 bg-teal-50 rounded-lg text-teal-600 mb-2 group-hover:bg-teal-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                     </span>
                     <p className="text-slate-800 font-medium text-sm leading-snug group-hover:text-teal-900 transition-colors">
                        {suggestion}
                     </p>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 font-medium group-hover:text-teal-600 transition-colors mt-auto">
                     <span>Ask now</span>
                     <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: '100ms' }}
              >
                {/* User Message */}
                {message.type === 'user' && (
                  <div className="max-w-[80%] md:max-w-[70%]">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-xl shadow-slate-200/50">
                      <p className="text-base leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-right text-[10px] text-slate-400 mt-2 mr-1 font-medium">YOU</p>
                  </div>
                )}

                {/* AI Message */}
                {message.type === 'ai' && (
                  <div className="flex gap-4 max-w-[95%] md:max-w-[85%]">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 mt-1">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-8 py-6 shadow-sm ring-1 ring-slate-100">
                        <div className="prose prose-slate max-w-none text-sm">
                           {formatAnswer(message.content)}
                        </div>
                      </div>

                      {/* Sources Section - cleaner design */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="bg-slate-50/80 rounded-xl p-4 ml-1 border border-slate-100">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sources Used</span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {message.sources.map((source, idx) => (
                              <div
                                key={`${source.doc_id}-${idx}`}
                                className="bg-white border border-slate-200 rounded-lg p-3 text-sm shadow-sm hover:border-teal-300 transition-colors cursor-default"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-slate-700 truncate text-xs">
                                    {source.filename}
                                  </span>
                                  {source.relevance_score && (
                                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                      {(source.relevance_score * 100).toFixed(0)}%
                                    </span>
                                  )}
                                </div>
                                {source.excerpt && (
                                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 border-l-2 border-slate-200 pl-2 mt-1">
                                    "{source.excerpt}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {message.type === 'error' && (
                  <div className="flex gap-4 max-w-[90%] animate-fade-in">
                     <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mt-1 border border-red-100">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="bg-red-50 border border-red-100 text-red-800 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {loading && (
              <div className="flex gap-4 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 bg-white border border-teal-100 rounded-xl flex items-center justify-center shadow-sm mt-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium animate-pulse">Analyzing documents...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Floating & Spacious */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-20">
        <div className="max-w-4xl mx-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-slate-100">
                    <input
                        ref={inputRef}
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk(e)}
                        placeholder="Ask anything about your documents..."
                        className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base"
                        disabled={loading}
                    />
                    <div className="flex items-center gap-2 pr-2">
                         {conversation.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClear}
                                title="Clear conversation"
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                         )}
                        <button
                            onClick={(e) => handleAsk(e)}
                            disabled={loading || !question.trim()}
                            className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                    AI can make mistakes. Please check important information.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswer;
