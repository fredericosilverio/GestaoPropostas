import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface StatisticsData {
    totalDemandas: number;
    valorTotalGeral: number;
    porTipoContratacao: Record<string, { count: number; total: number }>;
    porNaturezaDespesa: Record<string, { count: number; total: number }>;
}

const TIPO_CONTRATACAO_LABELS: Record<string, string> = {
    NOVA: 'Nova Contratação',
    RENOVACAO: 'Renovação',
    PRORROGACAO: 'Prorrogação',
    ADESAO: 'Adesão a Ata',
    ENCERRAMENTO: 'Encerramento de Contrato no Exercício',
    PLURIANUAL: 'Contrato Plurianual'
};

const NATUREZA_LABELS: Record<string, string> = {
    INVESTIMENTO: 'Investimento',
    CUSTEIO: 'Custeio'
};

interface PcaSummaryProps {
    filterAno?: number | '';
    filterSituacao?: string;
    pcaId?: number;
}

export function PcaSummary({ filterAno, filterSituacao, pcaId }: PcaSummaryProps) {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, [filterAno, filterSituacao, pcaId]);

    async function loadStatistics() {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterAno) params.append('ano', String(filterAno));
            if (filterSituacao) params.append('situacao', filterSituacao);
            if (pcaId) params.append('pcaId', String(pcaId));

            console.log('[PcaSummary] Fetching statistics with params:', params.toString());
            const response = await api.get(`/pcas/statistics?${params.toString()}`);
            console.log('[PcaSummary] Statistics response:', response.data);
            setStatistics(response.data);
        } catch (error) {
            console.error('[PcaSummary] Erro ao carregar estatísticas', error);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-zinc-700 rounded"></div>
            </div>
        );
    }

    // Se não há estatísticas, mostra resumo zerado
    const displayStats = statistics || {
        totalDemandas: 0,
        valorTotalGeral: 0,
        porTipoContratacao: {
            'NOVA': { count: 0, total: 0 },
            'RENOVACAO': { count: 0, total: 0 },
            'PRORROGACAO': { count: 0, total: 0 },
            'ADESAO': { count: 0, total: 0 },
            'ENCERRAMENTO': { count: 0, total: 0 },
            'PLURIANUAL': { count: 0, total: 0 }
        },
        porNaturezaDespesa: {
            'INVESTIMENTO': { count: 0, total: 0 },
            'CUSTEIO': { count: 0, total: 0 }
        }
    };

    // Filtrar tipos com valores
    const tiposComValor = Object.entries(displayStats.porTipoContratacao)
        .filter(([_, data]) => data.count > 0 || data.total > 0);

    const naturezasComValor = Object.entries(displayStats.porNaturezaDespesa)
        .filter(([_, data]) => data.count > 0 || data.total > 0);

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* Card grande - Total de demandas */}
                <div className="bg-primary p-6 flex items-center justify-center lg:min-w-[180px]">
                    <div className="text-center text-white">
                        <div className="text-5xl font-bold">{displayStats.totalDemandas}</div>
                        <div className="text-sm uppercase tracking-wider mt-1">Demandas</div>
                        <div className="text-sm uppercase tracking-wider">Propostas</div>
                    </div>
                </div>

                {/* Resumo por tipo de contratação */}
                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-700">
                    <div className="space-y-1">
                        {tiposComValor.length > 0 ? (
                            <>
                                {Object.entries(displayStats.porTipoContratacao).map(([tipo, data]) => (
                                    <div key={tipo} className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {TIPO_CONTRATACAO_LABELS[tipo] || tipo}: <strong className="text-gray-800 dark:text-gray-200">{data.count}</strong>
                                        </span>
                                        <span className="text-gray-800 dark:text-gray-200 font-medium tabular-nums">
                                            {formatCurrency(data.total)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-zinc-600 mt-2">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">Total:</span>
                                    <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                                        {formatCurrency(displayStats.valorTotalGeral)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum dado disponível</p>
                        )}
                    </div>
                </div>

                {/* Resumo por natureza de despesa */}
                <div className="flex-1 p-4">
                    <div className="space-y-1">
                        {naturezasComValor.length > 0 ? (
                            <>
                                {Object.entries(displayStats.porNaturezaDespesa).map(([natureza, data]) => (
                                    <div key={natureza} className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {NATUREZA_LABELS[natureza] || natureza}: <strong className="text-gray-800 dark:text-gray-200">{data.count}</strong>
                                        </span>
                                        <span className="text-gray-800 dark:text-gray-200 font-medium tabular-nums">
                                            {formatCurrency(data.total)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-zinc-600 mt-2">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">Total:</span>
                                    <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                                        {formatCurrency(displayStats.valorTotalGeral)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum dado disponível</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
