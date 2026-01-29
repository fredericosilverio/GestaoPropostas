import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { signIn } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        try {
            await signIn(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
            <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary">Gestão Propostas</h1>
                    <p className="text-gray-500 dark:text-gray-400">Entre para acessar o sistema</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {isLoggingIn ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
