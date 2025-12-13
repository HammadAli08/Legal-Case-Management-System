import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Classification from './components/Classification';
import Prioritization from './components/Prioritization';
import Chat from './components/Chat';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

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
        <div className="flex h-screen bg-[#F0EDEE] overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                showClearButton={activeTab === 'chat'}
                onClearChat={handleClearChat}
            />

            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Top bar for mobile only to show menu button space */}
                <div className="lg:hidden h-16 bg-white shadow-sm mb-4" />

                {renderContent()}
            </main>
        </div>
    );
}

export default App;
