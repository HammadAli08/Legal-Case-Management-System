import React from 'react';
import { FileText, AlertCircle, MessageSquare, ArrowRight, Sparkles, Scale, Zap, Shield } from 'lucide-react';

const Home = ({ setActiveTab }) => {
    const features = [
        {
            icon: FileText,
            title: 'Case Classification',
            description: 'Automatically categorize cases as Civil, Criminal, or Constitutional with ML-powered analysis',
            gradient: 'from-blue-500 via-blue-600 to-indigo-600',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            hoverGlow: 'group-hover:shadow-blue-500/25',
            action: () => setActiveTab('classification')
        },
        {
            icon: AlertCircle,
            title: 'Case Prioritization',
            description: 'Determine urgency levels to optimize case management and resource allocation',
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            iconBg: 'bg-amber-500/20',
            iconColor: 'text-amber-400',
            hoverGlow: 'group-hover:shadow-amber-500/25',
            action: () => setActiveTab('prioritization')
        },
        {
            icon: MessageSquare,
            title: 'Legal Assistant',
            description: 'RAG-based chat system to retrieve and analyze legal precedents with context',
            gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
            iconBg: 'bg-emerald-500/20',
            iconColor: 'text-emerald-400',
            hoverGlow: 'group-hover:shadow-emerald-500/25',
            action: () => setActiveTab('chat')
        }
    ];

    const stats = [
        { value: '99%', label: 'Accuracy', icon: Shield },
        { value: '<1s', label: 'Response Time', icon: Zap },
        { value: '24/7', label: 'Availability', icon: Scale },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-8 border border-primary-500/30">
                    <Sparkles size={16} className="animate-pulse" />
                    <span className="text-sm font-semibold tracking-wide">AI-Powered Legal Technology</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display leading-tight">
                    <span className="text-white">Legal Case</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                        Management
                    </span>
                </h1>

                <p className="text-xl text-surface-300 max-w-2xl mx-auto leading-relaxed">
                    Streamline your legal workflow with our advanced AI toolkit.
                    <span className="text-white font-medium"> Classify cases, prioritize workloads, and research precedents</span> in seconds.
                </p>

                {/* Stats Row */}
                <div className="flex justify-center gap-8 mt-10">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <stat.icon size={18} className="text-primary-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-surface-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            onClick={feature.action}
                            className={`group relative bg-surface-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl ${feature.hoverGlow} animate-fade-in overflow-hidden`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 border border-white/10`}>
                                    <Icon size={28} className={feature.iconColor} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-3 font-display group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-surface-300 transition-all duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-surface-400 mb-6 leading-relaxed group-hover:text-surface-300 transition-colors duration-300">
                                    {feature.description}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all duration-300">
                                    <span>Try Now</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>

                            {/* Bottom gradient line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>
                    );
                })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="inline-flex items-center gap-4 bg-surface-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="text-left">
                        <p className="text-white font-semibold">Ready to transform your legal workflow?</p>
                        <p className="text-surface-400 text-sm">Start analyzing cases with AI-powered precision</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-400 hover:to-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
