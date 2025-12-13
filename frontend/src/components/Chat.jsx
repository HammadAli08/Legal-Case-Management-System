import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, AlertCircle } from 'lucide-react';
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

        // Add user message immediately
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
            // Remove user message if failed? Or just show error.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-4 animate-fade-in">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar">
                {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="bg-[#2C666E]/10 p-6 rounded-full mb-4">
                            <Bot size={48} className="text-[#2C666E]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2 font-serif">Legal Research Assistant</h3>
                        <p className="text-gray-500 max-w-md">
                            Ask questions about legal precedents, case laws, and regulations.
                            I'll analyze the context and provide evidence-based answers.
                        </p>
                    </div>
                )}

                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-[#2C666E] text-white'
                                : 'bg-white border-2 border-[#2C666E] text-[#2C666E]'
                            }`}>
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-[#2C666E] text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>

                            {/* Sources (only for assistant) */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 w-full">
                                    <div className="bg-white/50 border border-gray-200 rounded-xl p-3 text-sm">
                                        <div className="flex items-center gap-2 text-[#2C666E] font-semibold mb-2">
                                            <BookOpen size={16} />
                                            <span>Sources & Precedents</span>
                                        </div>
                                        <div className="space-y-2">
                                            {msg.sources.map((source, idx) => (
                                                <div key={idx} className="bg-white p-2 rounded border border-gray-100 text-xs text-gray-600">
                                                    <span className="font-bold text-[#2C666E]">Source {source.index}:</span>{' '}
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

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-[#2C666E] text-[#2C666E] flex items-center justify-center flex-shrink-0">
                            <Bot size={20} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                            <Loader2 className="animate-spin text-[#2C666E]" size={20} />
                            <span className="text-gray-500 text-sm">Analyzing legal database...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2C666E] focus:bg-white transition-all outline-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="bg-[#2C666E] text-white p-3 rounded-xl hover:bg-[#1a4d54] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
