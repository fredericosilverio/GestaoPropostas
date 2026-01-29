export interface User {
    id: number;
    nome_completo: string;
    email: string;
    perfil: string;
}

export interface AuthContextType {
    user: User | null;
    signed: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}
