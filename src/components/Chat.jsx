import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { legalAIService } from '../services/api';

const Chat = ({ chatHistory, setChatHistory }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        setMessage('');
        setError(null);

        const newHistory = [
            ...chatHistory,
            { role: 'user', content: userMessage }
        ];
        setChatHistory(newHistory);
        setLoading(true);

        try {
            const response = await legalAIService.chat(userMessage, chatHistory);
            setChatHistory([
                ...newHistory,
                {
                    role: 'assistant',
                    content: response.answer,
                    sources: response.sources
                }
            ]);
        } catch (err) {
            setError(err.message || 'Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "What are the key elements of contract law?",
        "Explain the burden of proof in criminal cases",
        "What is habeas corpus?"
    ];

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium mb-4 border border-emerald-500/30">
                    <MessageSquare size={14} />
                    <span>RAG-Powered Chat</span>
                </div>
                <h1 className="text-3xl font-bold text-white font-display mb-1">
                    Legal Research Assistant
                </h1>
                <p className="text-surface-400">
                    Ask questions about legal precedents and regulations
                </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2">
                {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary-500/20">
                                <Bot size={48} className="text-primary-400" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-accent-500/30">
                                <Sparkles size={16} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-display">
                            How can I help you today?
                        </h3>
                        <p className="text-surface-400 max-w-md mb-8">
                            I can help you research legal precedents, understand case laws, and provide evidence-based answers to your legal questions.
                        </p>

                        {/* Suggested Questions */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {suggestedQuestions.map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMessage(question)}
                                    className="px-4 py-2.5 bg-surface-700/50 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-surface-300 hover:text-white hover:bg-surface-700 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30'
                                : 'bg-surface-700 border border-white/10'
                            }`}>
                            {msg.role === 'user'
                                ? <User size={18} className="text-white" />
                                : <Bot size={18} className="text-primary-400" />
                            }
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-lg shadow-primary-500/20'
                                    : 'bg-surface-700/50 backdrop-blur-sm text-surface-100 border border-white/10 rounded-tl-sm'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>

                            {/* Sources */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 w-full">
                                    <div className="bg-surface-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-primary-400 font-semibold mb-3">
                                            <BookOpen size={16} />
                                            <span className="text-sm">Sources & Precedents</span>
                                        </div>
                                        <div className="space-y-2">
                                            {msg.sources.map((source, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-surface-700/50 p-3 rounded-lg text-xs text-surface-300 border border-white/5"
                                                >
                                                    <span className="font-bold text-primary-400">
                                                        Source {source.index}:
                                                    </span>{' '}
                                                    {source.content}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex gap-4 animate-fade-in">
                        <div className="w-10 h-10 rounded-xl bg-surface-700 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Bot size={18} className="text-primary-400" />
                        </div>
                        <div className="bg-surface-700/50 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm border border-white/10 flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-surface-400 text-sm">Searching legal database...</span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex justify-center animate-slide-up">
                        <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm border border-red-500/30">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-surface-800/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-surface-700/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 focus:bg-surface-700/80 transition-all outline-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3.5 rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-xs text-surface-500 mt-2 text-center">
                    Powered by RAG technology • Responses are AI-generated and should be verified
                </p>
            </div>
        </div>
    );
};

export default Chat;
