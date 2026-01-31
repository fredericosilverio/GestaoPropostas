import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@GestaoPropostas:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // Handle 401 - Unauthorized (session expired)
            if (status === 401) {
                // Clear stored credentials
                localStorage.removeItem('@GestaoPropostas:token');
                localStorage.removeItem('@GestaoPropostas:user');

                // Redirect to login if not already there
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }

            // Handle 403 - Forbidden (no permission)
            if (status === 403) {
                console.error('Acesso negado: você não tem permissão para esta ação.');
            }

            // Handle 500+ - Server errors
            if (status >= 500) {
                console.error('Erro no servidor. Tente novamente mais tarde.');
            }
        }

        // Always propagate the error for local handling
        return Promise.reject(error);
    }
);

// Helper to get API base URL (useful for file downloads)
export const getApiBaseUrl = () => API_BASE_URL;
