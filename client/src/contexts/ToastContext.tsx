import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertTitle, Box, Slide } from '@mui/material';

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

        // Auto remove after 4 seconds
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
        <Box
            sx={{
                position: 'fixed',
                top: 80, 
                right: 24,
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pointerEvents: 'none',
                maxWidth: 400
            }}
        >
            {messages.map((message) => (
                <Box key={message.id} sx={{ pointerEvents: 'auto' }}>
                    <Slide direction="left" in mountOnEnter unmountOnExit>
                        <Alert
                            severity={message.type}
                            variant="filled"
                            onClose={() => removeToast(message.id)}
                            sx={{ width: '100%', boxShadow: 3 }}
                        >
                            {message.title && <AlertTitle>{message.title}</AlertTitle>}
                            {message.description}
                        </Alert>
                    </Slide>
                </Box>
            ))}
        </Box>
    );
}
