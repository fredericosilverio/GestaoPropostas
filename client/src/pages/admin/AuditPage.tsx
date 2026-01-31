import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import type { AuditLog, PaginatedResponse } from '../../types/api';

export function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    async function fetchLogs() {
        setLoading(true);
        try {
            const response = await api.get<PaginatedResponse<AuditLog>>(`/audit?page=${page}&limit=20`);
            setLogs(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao carregar logs', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Trilha de Auditoria</h1>

            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Entidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Descrição</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {loading ? (
                                <tr><td colSpan={5}><LoadingOverlay message="Carregando logs..." /></td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum log de auditoria encontrado.</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        {new Date(log.data_hora).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {log.usuario?.nome_completo || 'Sistema'}
                                        <div className="text-xs text-gray-500">{log.usuario?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <StatusBadge status={log.acao} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                                        {log.entidade_tipo} #{log.entidade_id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell max-w-xs truncate" title={log.descricao}>
                                        {log.descricao}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        ← Anterior
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Página {page} de {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        Próxima →
                    </button>
                </div>
            )}
        </div>
    );
}
