import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Fornecedor } from '../types/api';

interface FornecedorSelectProps {
    value: number | null;
    onChange: (id: number | null) => void;
    required?: boolean;
    className?: string;
}

export function FornecedorSelect({ value, onChange, required = false, className = '' }: FornecedorSelectProps) {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFornecedores() {
            try {
                const response = await api.get('/fornecedores?ativo=true');
                setFornecedores(response.data);
            } catch (error) {
                console.error('Erro ao carregar fornecedores', error);
            } finally {
                setLoading(false);
            }
        }
        loadFornecedores();
    }, []);

    if (loading) {
        return <div className="animate-pulse h-10 bg-gray-200 dark:bg-zinc-700 rounded w-full"></div>;
    }

    return (
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className={`w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 ${className}`}
            required={required}
        >
            <option value="">Selecione um Fornecedor...</option>
            {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                    {f.razao_social} {f.nome_fantasia ? `(${f.nome_fantasia})` : ''} - {f.cnpj}
                </option>
            ))}
        </select>
    );
}
