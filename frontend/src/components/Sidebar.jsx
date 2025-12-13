import React from 'react';
import { Scale, FileText, AlertCircle, MessageSquare, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onClearChat, showClearButton }) => {
    const NavItem = ({ icon: Icon, label, id }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300 ${activeTab === id
                ? 'bg-[#2C666E] text-[#F0EDEE] border-l-4 border-[#F0EDEE] shadow-lg'
                : 'text-[#F0EDEE] hover:bg-[#2C666E]/30 hover:translate-x-1'
                }`}
        >
            <Icon size={20} />
            {sidebarOpen && <span className="font-medium">{label}</span>}
        </button>
    );

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-[#2C666E] text-[#F0EDEE] p-3 rounded-lg shadow-lg hover:bg-[#1a4d54] transition-all duration-200"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:relative z-40 h-full bg-gradient-to-b from-[#1a4d54] via-[#2C666E] to-[#2C666E] transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
                    } overflow-hidden`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-[#F0EDEE]/20">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#F0EDEE] p-2 rounded-lg">
                                <Scale className="text-[#2C666E]" size={28} />
                            </div>
                            {sidebarOpen && (
                                <div className="overflow-hidden animate-slide-in">
                                    <h1 className="text-[#F0EDEE] text-xl font-bold whitespace-nowrap">
                                        Legal AI
                                    </h1>
                                    <p className="text-[#F0EDEE]/70 text-xs">
                                        Powered by AI
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 overflow-y-auto">
                        <NavItem icon={Scale} label="Home" id="home" />
                        <NavItem icon={FileText} label="Classification" id="classification" />
                        <NavItem icon={AlertCircle} label="Prioritization" id="prioritization" />
                        <NavItem icon={MessageSquare} label="Legal Assistant" id="chat" />
                    </nav>

                    {/* Clear Chat Button */}
                    {showClearButton && (
                        <div className="p-4 border-t border-[#F0EDEE]/20">
                            <button
                                onClick={onClearChat}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                {sidebarOpen && 'Clear Chat'}
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t border-[#F0EDEE]/20">
                        <p className="text-[#F0EDEE]/50 text-xs text-center">
                            {sidebarOpen ? '© 2024 Legal AI' : '©'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
