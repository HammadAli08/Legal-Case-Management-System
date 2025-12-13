import React from 'react';
import { FileText, AlertCircle, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

const Home = ({ setActiveTab }) => {
    const features = [
        {
            icon: FileText,
            title: 'Case Classification',
            description: 'Automatically categorize cases as Civil, Criminal, or Constitutional with ML-powered analysis',
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            action: () => setActiveTab('classification')
        },
        {
            icon: AlertCircle,
            title: 'Case Prioritization',
            description: 'Determine urgency levels (High, Medium, Low) to optimize case management workflows',
            color: 'from-orange-500 to-orange-600',
            hoverColor: 'hover:from-orange-600 hover:to-orange-700',
            action: () => setActiveTab('prioritization')
        },
        {
            icon: MessageSquare,
            title: 'Legal Assistant',
            description: 'Advanced RAG-based chat system to retrieve and analyze legal precedents with context',
            color: 'from-teal-500 to-teal-600',
            hoverColor: 'hover:from-teal-600 hover:to-teal-700',
            action: () => setActiveTab('chat')
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-[#2C666E]/10 text-[#2C666E] px-4 py-2 rounded-full mb-6">
                    <Sparkles size={16} />
                    <span className="text-sm font-semibold">AI-Powered Legal Tech</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-[#2C666E] mb-6 font-serif">
                    Legal Case Management
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Streamline your legal workflow with our advanced AI toolkit.
                    Classify cases, prioritize workloads, and research precedents in seconds.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            onClick={feature.action}
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3 font-serif">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {feature.description}
                            </p>
                            <div className="flex items-center text-[#2C666E] font-semibold group-hover:gap-2 transition-all duration-300">
                                Try Tool <ArrowRight size={18} className="ml-1" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
