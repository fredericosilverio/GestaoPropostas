import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import type { Demanda } from '../../types/api';

export function DemandaList() {
    const [demandas, setDemandas] = useState<Demanda[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDemandas();
    }, []);

    async function loadDemandas() {
        try {
            const response = await api.get('/demandas');
            setDemandas(response.data);
        } catch (error) {
            console.error('Erro ao carregar Demandas', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando demandas..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Demandas de Contratação</h1>
                <button
                    onClick={() => navigate('/demandas/new')}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
                    <span>+</span> Nova Demanda
                </button>
            </div>

            {demandas.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="Nenhuma demanda encontrada"
                    description="Comece criando sua primeira demanda de contratação."
                    action={{
                        label: 'Nova Demanda',
                        onClick: () => navigate('/demandas/new')
                    }}
                />
            ) : (
                <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-gray-50 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PCA</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Descrição</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Valor Estimado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Responsável</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                {demandas.map((demanda) => (
                                    <tr key={demanda.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{demanda.codigo_demanda}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{demanda.pca?.ano} - {demanda.pca?.orgao}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate hidden md:table-cell" title={demanda.descricao}>{demanda.descricao}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                                            {demanda.valor_estimado_global ?
                                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(demanda.valor_estimado_global))
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={demanda.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">{demanda.responsavel?.nome_completo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => navigate(`/demandas/${demanda.id}`)}
                                                className="text-primary hover:text-primary-light">
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
