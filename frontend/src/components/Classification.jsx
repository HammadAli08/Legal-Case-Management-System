import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 bg-gradient-to-r from-[#2C666E] to-[#1a4d54] text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={32} />
                        <h2 className="text-3xl font-bold font-serif">Case Classification</h2>
                    </div>
                    <p className="text-white/80">
                        Paste the case details below to automatically categorize it using our ML model.
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
                            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2C666E] focus:border-transparent outline-none resize-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                            placeholder="Enter the full text of the legal case here..."
                        />
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading || !text.trim()}
                        className="w-full bg-[#2C666E] hover:bg-[#1a4d54] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Analyzing Case...
                            </>
                        ) : (
                            'Classify Case'
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
                            <div className="p-6 bg-[#F0EDEE] rounded-xl border-2 border-[#2C666E]/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2C666E] to-[#1a4d54]" />
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    Predicted Category
                                </h3>
                                <div className="flex items-center justify-center gap-3 text-[#2C666E]">
                                    <CheckCircle size={32} />
                                    <span className="text-4xl font-bold font-serif">{result}</span>
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
