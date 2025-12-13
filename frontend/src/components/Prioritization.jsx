import React, { useState } from 'react';
import { AlertCircle, Loader2, BarChart, AlertTriangle } from 'lucide-react';
import { legalAIService } from '../services/api';

const Prioritization = () => {
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
            const data = await legalAIService.prioritizeCase(text);
            setResult(data.priority);
        } catch (err) {
            setError(err.message || 'Failed to prioritize case');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityStyles = (priority) => {
        const p = priority?.toLowerCase() || '';
        if (p.includes('high')) {
            return {
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-700',
                icon: 'text-red-600',
                gradient: 'from-red-500 to-red-600'
            };
        }
        if (p.includes('medium')) {
            return {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                text: 'text-orange-700',
                icon: 'text-orange-600',
                gradient: 'from-orange-500 to-orange-600'
            };
        }
        return {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: 'text-green-600',
            gradient: 'from-green-500 to-green-600'
        };
    };

    const styles = result ? getPriorityStyles(result) : {};

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle size={32} />
                        <h2 className="text-3xl font-bold font-serif">Case Prioritization</h2>
                    </div>
                    <p className="text-white/80">
                        Determine the urgency level of a case to optimize resource allocation.
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                            Case Description
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                            placeholder="Enter the full text of the legal case here..."
                        />
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading || !text.trim()}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Analyzing Priority...
                            </>
                        ) : (
                            'Determine Priority'
                        )}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-slide-up">
                            <AlertTriangle size={24} />
                            <p>{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 animate-slide-up">
                            <div className={`p-8 rounded-xl border-2 ${styles.bg} ${styles.border} text-center relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.gradient}`} />
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    Predicted Priority Level
                                </h3>
                                <div className={`flex items-center justify-center gap-4 ${styles.text}`}>
                                    <BarChart size={40} />
                                    <span className="text-5xl font-bold font-serif">{result}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prioritization;
