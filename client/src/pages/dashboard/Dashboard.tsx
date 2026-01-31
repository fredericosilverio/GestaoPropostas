import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import type { DashboardSummary, DashboardAlert, DemandaStatus } from '../../types/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Cores para os status
const STATUS_COLORS: Record<string, string> = {
    'CADASTRADA': '#6b7280',
    'EM_ANALISE': '#f59e0b',
    'ESTIMADA': '#8b5cf6',
    'EM_CONTRATACAO': '#3b82f6',
    'CONTRATADA': '#10b981',
    'SUSPENSA': '#ef4444',
    'CANCELADA': '#991b1b'
};

const STATUS_LABELS: Record<string, string> = {
    'CADASTRADA': 'Cadastrada',
    'EM_ANALISE': 'Em Análise',
    'ESTIMADA': 'Estimada',
    'EM_CONTRATACAO': 'Em Contratação',
    'CONTRATADA': 'Contratada',
    'SUSPENSA': 'Suspensa',
    'CANCELADA': 'Cancelada'
};

export function Dashboard() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(res => setSummary(res.data))
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar dados do dashboard');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingOverlay message="Carregando dashboard..." />;

    if (error || !summary) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-gray-500 dark:text-gray-400">{error || 'Erro ao carregar dados.'}</p>
            </div>
        );
    }

    const { stats, alertas } = summary;

    // Preparar dados para o gráfico de pizza
    const pieData = Object.entries(stats.byStatus)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
            name: STATUS_LABELS[status] || status,
            value: count,
            color: STATUS_COLORS[status] || '#6b7280'
        }));

    // Dados do gráfico de barras baseados nos status atuais
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const barData = [
        {
            mes: currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1),
            cadastradas: stats.byStatus['CADASTRADA'] || 0,
            'em_analise': stats.byStatus['EM_ANALISE'] || 0,
            estimadas: stats.byStatus['ESTIMADA'] || 0,
            contratadas: stats.byStatus['CONTRATADA'] || 0
        }
    ];

    const handlePieClick = (data: any) => {
        // Navegar para lista filtrada por status
        const statusKey = Object.keys(STATUS_LABELS).find(key => STATUS_LABELS[key] === data.name);
        if (statusKey) {
            navigate(`/demandas?status=${statusKey}`);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Visão Geral</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Pizza - Distribuição por Status */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Demandas por Status</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    onClick={handlePieClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value} demanda(s)`, 'Quantidade']}
                                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">Nenhuma demanda cadastrada.</p>
                    )}
                    <p className="text-xs text-center text-gray-400 mt-2">Clique em uma fatia para ver detalhes</p>
                </div>

                {/* Gráfico de Barras - Evolução Mensal */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Evolução Mensal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                            />
                            <Legend />
                            <Bar dataKey="cadastradas" name="Cadastradas" fill="#6b7280" />
                            <Bar dataKey="estimadas" name="Estimadas" fill="#8b5cf6" />
                            <Bar dataKey="contratadas" name="Contratadas" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alertas de Prazo */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4 text-red-600 flex items-center gap-2">
                    <span>⚠️</span> Alertas de Prazo (Próximos 30 dias)
                </h3>
                {alertas.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum alerta de prazo.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {alertas.map((alerta: DashboardAlert) => (
                            <div
                                key={alerta.id}
                                className="border-l-4 border-red-400 bg-red-50 dark:bg-zinc-900 p-3 rounded-r cursor-pointer hover:bg-red-100 dark:hover:bg-zinc-800 transition-colors"
                                onClick={() => navigate(`/demandas/${alerta.id}`)}
                            >
                                <p className="font-bold text-sm">{alerta.codigo_demanda}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{alerta.descricao}</p>
                                <p className="text-xs font-bold text-red-700 mt-1">
                                    Vence em: {new Date(alerta.data_prevista_contratacao).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats por Status */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Resumo por Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                    {Object.entries(STATUS_LABELS).map(([status, label]) => (
                        <div
                            key={status}
                            className="text-center p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                            onClick={() => navigate(`/demandas?status=${status}`)}
                        >
                            <div
                                className="w-8 h-8 rounded-full mx-auto mb-2"
                                style={{ backgroundColor: STATUS_COLORS[status] }}
                            />
                            <p className="text-2xl font-bold">{stats.byStatus[status as DemandaStatus] || 0}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

