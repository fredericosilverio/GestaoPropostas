import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(res => setSummary(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Carregando dashboard...</div>;
    if (!summary) return <div>Erro ao carregar dados.</div>;

    const { stats, alertas } = summary;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Visão Geral</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Total Demandas</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Valor Total Estimado</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalValorEstimado)}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Em Análise</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.byStatus['EM_ANALISE'] || 0}</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Estimadas</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.byStatus['ESTIMADA'] || 0}</p>
                </div>
            </div>

            {/* Charts Area Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Demandas por Status</h3>
                    <div className="space-y-2">
                        {Object.entries(stats.byStatus).map(([status, count]: [string, any]) => (
                            <div key={status} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900 p-2 rounded">
                                <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                                <span className="font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4 text-red-600">⚠️ Alertas de Prazo (Próximos 30 dias)</h3>
                    {alertas.length === 0 ? (
                        <p className="text-gray-500">Nenhum alerta.</p>
                    ) : (
                        <div className="space-y-3">
                            {alertas.map((a: any) => (
                                <div key={a.id} className="border-l-4 border-red-400 bg-red-50 dark:bg-zinc-900 p-3">
                                    <p className="font-bold text-sm">{a.codigo_demanda}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{a.descricao}</p>
                                    <p className="text-xs font-bold text-red-700 mt-1">
                                        Vence em: {new Date(a.data_prevista_contratacao).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
