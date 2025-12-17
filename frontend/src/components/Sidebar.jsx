import React from 'react';
import { Scale, FileText, AlertCircle, MessageSquare, Menu, X, Sparkles } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onClearChat, showClearButton }) => {
    const NavItem = ({ icon: Icon, label, id }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-300 rounded-xl mx-2 my-1 group relative overflow-hidden ${activeTab === id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            style={{ width: 'calc(100% - 16px)' }}
        >
            {activeTab === id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
            )}
            <Icon size={20} className="relative z-10 flex-shrink-0" />
            {sidebarOpen && (
                <span className="font-medium relative z-10 whitespace-nowrap">{label}</span>
            )}
            {activeTab !== id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300" />
            )}
        </button>
    );

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-surface-800/90 backdrop-blur-xl text-white p-3 rounded-xl shadow-lg border border-white/10 hover:bg-surface-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:relative z-40 h-full bg-surface-800/80 backdrop-blur-xl transition-all duration-500 ease-out border-r border-white/5 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
                    } overflow-hidden`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/30">
                                    <Scale className="text-white" size={24} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
                            </div>
                            {sidebarOpen && (
                                <div className="overflow-hidden animate-slide-in">
                                    <h1 className="text-white text-xl font-bold whitespace-nowrap tracking-tight">
                                        Legal AI
                                    </h1>
                                    <div className="flex items-center gap-1 text-primary-300 text-xs">
                                        <Sparkles size={10} />
                                        <span>Powered by AI</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 overflow-y-auto">
                        <div className="space-y-1">
                            <NavItem icon={Scale} label="Home" id="home" />
                            <NavItem icon={FileText} label="Classification" id="classification" />
                            <NavItem icon={AlertCircle} label="Prioritization" id="prioritization" />
                            <NavItem icon={MessageSquare} label="Legal Assistant" id="chat" />
                        </div>
                    </nav>

                    {/* Clear Chat Button */}
                    {showClearButton && (
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={onClearChat}
                                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 py-3 px-4 rounded-xl transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/30"
                            >
                                <X size={16} />
                                {sidebarOpen && 'Clear Chat'}
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <p className="text-white/40 text-xs">
                                {sidebarOpen ? 'System Online • 2024' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
