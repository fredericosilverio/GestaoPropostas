import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info';
    title?: string;
    description?: string;
}

interface ToastContextData {
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast = {
            id,
            type,
            title,
            description,
        };

        setMessages((state) => [...state, toast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setMessages((state) => state.filter((message) => message.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setMessages((state) => state.filter((message) => message.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer messages={messages} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Internal Components
function ToastContainer({ messages, removeToast }: { messages: ToastMessage[], removeToast: (id: string) => void }) {
    return (
        <div className="fixed right-0 top-0 p-4 pt-20 overflow-hidden z-50 pointer-events-none flex flex-col gap-2">
            {messages.map((message) => (
                <Toast key={message.id} message={message} removeToast={removeToast} />
            ))}
        </div>
    );
}

function Toast({ message, removeToast }: { message: ToastMessage, removeToast: (id: string) => void }) {
    const bgColors = {
        success: 'bg-green-100 dark:bg-green-900 border-green-500',
        error: 'bg-red-100 dark:bg-red-900 border-red-500',
        info: 'bg-blue-100 dark:bg-blue-900 border-blue-500',
    };

    const textColors = {
        success: 'text-green-800 dark:text-green-100',
        error: 'text-red-800 dark:text-red-100',
        info: 'text-blue-800 dark:text-blue-100',
    };

    return (
        <div
            className={`w-80 shadow-lg rounded-md border-l-4 p-4 pointer-events-auto transition-transform transform translate-x-0 ${bgColors[message.type]}`}
            onClick={() => removeToast(message.id)}
        >
            <div className="flex items-start">
                <div className="flex-1">
                    {message.title && <h3 className={`font-bold ${textColors[message.type]}`}>{message.title}</h3>}
                    {message.description && <p className={`mt-1 text-sm ${textColors[message.type]} opacity-90`}>{message.description}</p>}
                </div>
                <button
                    onClick={() => removeToast(message.id)}
                    className={`ml-4 ${textColors[message.type]} hover:opacity-70`}
                >
                    X
                </button>
            </div>
        </div>
    );
}
