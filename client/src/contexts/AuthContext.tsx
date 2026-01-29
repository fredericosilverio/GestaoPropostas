import React, { createContext, useState, useEffect, useContext } from 'react';
import type { AuthContextType, User } from './AuthContextType';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storagedUser = localStorage.getItem('@GestaoPropostas:user');
        const storagedToken = localStorage.getItem('@GestaoPropostas:token');

        if (storagedToken && storagedUser) {
            setUser(JSON.parse(storagedUser));
            // Configurar header padrão do axios aqui se tivesse configurado api.ts
        }
        setLoading(false);
    }, []);

    async function signIn(email: string, senha: string) {
        const response = await fetch('http://localhost:3333/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Falha no login');
        }

        const { usuario, token } = await response.json();

        setUser(usuario);
        localStorage.setItem('@GestaoPropostas:user', JSON.stringify(usuario));
        localStorage.setItem('@GestaoPropostas:token', token);
    }

    function signOut() {
        localStorage.removeItem('@GestaoPropostas:user');
        localStorage.removeItem('@GestaoPropostas:token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
