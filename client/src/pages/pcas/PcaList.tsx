import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import type { Pca } from '../../types/api';

const SITUACOES = [
    { value: '', label: 'Todas' },
    { value: 'EM_ELABORACAO', label: 'Em Elaboração' },
    { value: 'APROVADO', label: 'Aprovado' },
    { value: 'EM_EXECUCAO', label: 'Em Execução' },
    { value: 'ENCERRADO', label: 'Encerrado' },
    { value: 'CANCELADO', label: 'Cancelado' }
];

export function PcaList() {
    const [pcas, setPcas] = useState<Pca[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const canCreate = user?.perfil === 'ADMIN' || user?.perfil === 'GESTOR';

    // Filters
    const [filterAno, setFilterAno] = useState<number | ''>('');
    const [filterSituacao, setFilterSituacao] = useState('');

    useEffect(() => {
        loadPcas();
    }, [filterAno, filterSituacao]);

    async function loadPcas() {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterAno) params.append('ano', String(filterAno));
            if (filterSituacao) params.append('situacao', filterSituacao);

            const response = await api.get(`/pcas?${params.toString()}`);
            setPcas(response.data);
        } catch (error) {
            console.error('Erro ao carregar PCAs', error);
        } finally {
            setLoading(false);
        }
    }

    // Generate year options (current year + 2 years, previous 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear + 2 - i);

    if (loading) return <LoadingOverlay message="Carregando PCAs..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Planos de Contratação Anual</h1>
                {canCreate && (
                    <button
                        onClick={() => navigate('/pcas/new')}
                        className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
                        <span>+</span> Novo PCA
                    </button>
                )}
            </div>



            {/* Filters */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ano
                        </label>
                        <select
                            value={filterAno}
                            onChange={(e) => setFilterAno(e.target.value ? Number(e.target.value) : '')}
                            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Todos</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Situação
                        </label>
                        <select
                            value={filterSituacao}
                            onChange={(e) => setFilterSituacao(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100"
                        >
                            {SITUACOES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    {(filterAno || filterSituacao) && (
                        <div className="flex items-end">
                            <button
                                onClick={() => { setFilterAno(''); setFilterSituacao(''); }}
                                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {
                pcas.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="Nenhum PCA encontrado"
                        description={canCreate ? "Comece criando seu primeiro Plano de Contratação Anual." : "Nenhum PCA disponível no momento."}
                        action={canCreate ? {
                            label: 'Novo PCA',
                            onClick: () => navigate('/pcas/new')
                        } : undefined}
                    />
                ) : (
                    <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-50 dark:bg-zinc-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Órgão</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Situação</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Versão</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Demandas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Responsável</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                    {pcas.map((pca) => (
                                        <tr
                                            key={pca.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/pcas/${pca.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-mono font-medium text-primary">{pca.numero_pca}</span>
                                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({pca.ano})</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pca.orgao}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={pca.situacao} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                                                v{pca.versao}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                                                {pca._count?.demandas || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                                                {pca.responsavel?.nome_completo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/pcas/${pca.id}`); }}
                                                    className="text-primary hover:text-primary-light"
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/demandas?pca_id=${pca.id}`); }}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                                >
                                                    Demandas
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 dark:bg-zinc-900 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-700">
                            {pcas.length} PCA(s) encontrado(s)
                        </div>
                    </div>
                )
            }
        </div >
    );
}

