import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, AlertTriangle, Sparkles, ArrowLeft, Scale } from 'lucide-react';
import { legalAIService } from '../services/api';

const Classification = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await legalAIService.classifyCase(text);
            setResult(data.category);
        } catch (err) {
            setError(err.message || 'Failed to classify case');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryStyles = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('criminal')) {
            return {
                gradient: 'from-red-500 to-rose-600',
                bg: 'bg-red-500/20',
                border: 'border-red-500/30',
                text: 'text-red-400',
                glow: 'shadow-red-500/20'
            };
        }
        if (cat.includes('civil')) {
            return {
                gradient: 'from-blue-500 to-indigo-600',
                bg: 'bg-blue-500/20',
                border: 'border-blue-500/30',
                text: 'text-blue-400',
                glow: 'shadow-blue-500/20'
            };
        }
        return {
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-500/20',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            glow: 'shadow-amber-500/20'
        };
    };

    const styles = result ? getCategoryStyles(result) : {};

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium mb-4 border border-blue-500/30">
                    <FileText size={14} />
                    <span>ML Classification</span>
                </div>
                <h1 className="text-4xl font-bold text-white font-display mb-2">
                    Case Classification
                </h1>
                <p className="text-surface-400">
                    Automatically categorize legal cases using machine learning
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-surface-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Gradient Header */}
                <div className="relative p-8 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0tNCA0aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Scale size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display">
                                Analyze Case Type
                            </h2>
                            <p className="text-white/70">
                                Paste case details for AI-powered classification
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Text Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-surface-300 mb-3 uppercase tracking-wider">
                            Case Description
                        </label>
                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-48 p-4 bg-surface-700/50 border border-white/10 rounded-xl text-white placeholder-surface-500 resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-surface-700/80 outline-none"
                                placeholder="Enter the full text of the legal case here..."
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-surface-500">
                                {text.length} characters
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handlePredict}
                        disabled={loading || !text.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={22} />
                                <span>Analyzing Case...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={22} />
                                <span>Classify Case</span>
                            </>
                        )}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center gap-3 border border-red-500/30 animate-slide-up">
                            <AlertTriangle size={24} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="mt-8 animate-scale-in">
                            <div className={`relative p-8 rounded-2xl ${styles.bg} border ${styles.border} text-center overflow-hidden`}>
                                {/* Top gradient line */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient}`} />

                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${styles.gradient} opacity-5`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <CheckCircle size={20} className={styles.text} />
                                        <span className="text-sm font-bold text-surface-400 uppercase tracking-widest">
                                            Predicted Category
                                        </span>
                                    </div>
                                    <div className={`text-5xl font-bold font-display ${styles.text}`}>
                                        {result}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Classification;
