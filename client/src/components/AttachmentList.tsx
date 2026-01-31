import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface Anexo {
    id: number;
    nome_arquivo: string;
    tamanho_bytes: number;
    created_at: string;
    uploaded_by: { nome_completo: string };
    nome_arquivo_storage: string;
}

interface Props {
    entityType: 'DEMANDA' | 'ITEM' | 'PRECO';
    entityId: number;
    refreshTrigger: number;
}

export function AttachmentList({ entityType, entityId, refreshTrigger }: Props) {
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        loadAnexos();
    }, [entityId, refreshTrigger]);

    async function loadAnexos() {
        try {
            const response = await api.get('/uploads', {
                params: { entityType, entityId }
            });
            setAnexos(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Excluir anexo?')) return;
        try {
            await api.delete(`/uploads/${id}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Anexo excluído.' });
            loadAnexos();
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao excluir.' });
        }
    }

    if (anexos.length === 0) return <div className="text-gray-500 text-sm mt-2">Nenhum anexo.</div>;

    return (
        <ul className="mt-4 space-y-2">
            {anexos.map(anexo => (
                <li key={anexo.id} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                    <div className="flex items-center">
                        <span className="text-xl mr-2">📄</span>
                        <div>
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/files/${anexo.nome_arquivo_storage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                {anexo.nome_arquivo}
                            </a>
                            <p className="text-xs text-gray-500">
                                {(anexo.tamanho_bytes / 1024).toFixed(1)} KB • {anexo.uploaded_by?.nome_completo} • {new Date(anexo.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(anexo.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                        Excluir
                    </button>
                </li>
            ))}
        </ul>
    );
}
