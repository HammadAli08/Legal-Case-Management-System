import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds for ML operations
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.detail || error.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

// API Services
export const legalAIService = {
    // Health check
    healthCheck: async () => {
        const response = await api.get('/');
        return response.data;
    },

    // Classify case
    classifyCase: async (text) => {
        const response = await api.post('/api/classify', { text });
        return response.data;
    },

    // Prioritize case
    prioritizeCase: async (text) => {
        const response = await api.post('/api/prioritize', { text });
        return response.data;
    },

    // Chat with legal assistant
    chat: async (message, chatHistory = []) => {
        const response = await api.post('/api/chat', {
            message,
            chat_history: chatHistory,
        });
        return response.data;
    },
};

export default api;
