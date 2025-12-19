import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Classification from './components/Classification';
import Prioritization from './components/Prioritization';
import Chat from './components/Chat';

import { legalAIService } from './services/api';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [systemStatus, setSystemStatus] = useState('checking');

    React.useEffect(() => {
        const checkHealth = async () => {
            try {
                const data = await legalAIService.healthCheck();
                setSystemStatus(data.status === 'healthy' ? 'online' : 'degraded');
            } catch (error) {
                setSystemStatus('offline');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const handleClearChat = () => {
        setChatHistory([]);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home setActiveTab={setActiveTab} />;
            case 'classification':
                return <Classification />;
            case 'prioritization':
                return <Prioritization />;
            case 'chat':
                return <Chat chatHistory={chatHistory} setChatHistory={setChatHistory} />;
            default:
                return <Home setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 overflow-hidden">
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                showClearButton={activeTab === 'chat'}
                onClearChat={handleClearChat}
                systemStatus={systemStatus}
            />

            <main className="flex-1 overflow-y-auto w-full relative z-10">
                {/* Mobile top spacer */}
                <div className="lg:hidden h-16" />

                {renderContent()}
            </main>
        </div>
    );
}

export default App;
