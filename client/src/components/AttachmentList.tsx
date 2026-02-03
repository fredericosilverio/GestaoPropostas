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
    origem?: string; // 'Demanda' | 'Cotação'
}

interface Props {
    entityType: 'DEMANDA' | 'ITEM' | 'PRECO';
    entityId: number;
    refreshTrigger: number;
    consolidate?: boolean; // If true and entityType is DEMANDA, fetch all related attachments
}

export function AttachmentList({ entityType, entityId, refreshTrigger, consolidate = false }: Props) {
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        loadAnexos();
    }, [entityId, refreshTrigger, consolidate]);

    async function loadAnexos() {
        try {
            let response;
            if (consolidate && entityType === 'DEMANDA') {
                // Fetch all attachments related to this demand (including prices)
                response = await api.get(`/uploads/demanda/${entityId}`);
            } else {
                // Fetch only direct attachments
                response = await api.get('/uploads', {
                    params: { entityType, entityId }
                });
            }
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
                            <div className="flex items-center gap-2">
                                <a
                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/files/${anexo.nome_arquivo_storage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {anexo.nome_arquivo}
                                </a>
                                {anexo.origem && (
                                    <span className={`text-xs px-2 py-0.5 rounded ${anexo.origem === 'Demanda'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        }`}>
                                        {anexo.origem}
                                    </span>
                                )}
                            </div>
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
