import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';
import type { AuditLog } from '../types/api';

interface Props {
    demandaId: number;
}

// Mapeamento de cores para status
const STATUS_COLORS: Record<string, string> = {
    'CADASTRADA': 'bg-gray-400',
    'EM_ANALISE': 'bg-yellow-500',
    'ESTIMADA': 'bg-purple-500',
    'EM_CONTRATACAO': 'bg-blue-500',
    'CONTRATADA': 'bg-green-500',
    'SUSPENSA': 'bg-orange-500',
    'CANCELADA': 'bg-red-600'
};

export function StatusTimeline({ demandaId }: Props) {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [demandaId]);

    async function loadHistory() {
        try {
            // Buscar logs de auditoria para esta demanda
            const res = await api.get('/audit', {
                params: {
                    entidade_tipo: 'DEMANDA',
                    entidade_id: demandaId,
                    limit: 20
                }
            });

            // Filtrar apenas transições de status
            const transitions = res.data.data.filter((log: AuditLog) =>
                (log.acao as string) === 'TRANSICAO_STATUS' || log.acao === 'CRIACAO'
            );

            setLogs(transitions);
        } catch (err) {
            console.error('Erro ao carregar histórico:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-3">
                <div className="h-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                <p>Nenhuma transição de status registrada.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Linha vertical conectando os eventos */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-zinc-600"></div>

            <div className="space-y-4">
                {logs.map((log, index) => {
                    const status = log.valor_novo as string || 'CADASTRADA';
                    const isFirst = index === 0;

                    return (
                        <div key={log.id} className="relative flex items-start gap-4 pl-10">
                            {/* Círculo do marcador */}
                            <div className={`absolute left-2 w-5 h-5 rounded-full border-4 border-white dark:border-zinc-800 ${STATUS_COLORS[status] || 'bg-gray-400'} ${isFirst ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}></div>

                            {/* Conteúdo do evento */}
                            <div className={`flex-1 bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg ${isFirst ? 'border border-blue-500' : ''}`}>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    {log.acao === 'CRIACAO' ? (
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Demanda Criada
                                        </span>
                                    ) : (
                                        <>
                                            {log.valor_anterior && (
                                                <>
                                                    <StatusBadge status={log.valor_anterior as any} />
                                                    <span className="text-gray-400">→</span>
                                                </>
                                            )}
                                            <StatusBadge status={status as any} />
                                        </>
                                    )}
                                </div>

                                {log.descricao && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {log.descricao}
                                    </p>
                                )}

                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>
                                        {log.usuario?.nome_completo || 'Sistema'}
                                    </span>
                                    <span>
                                        {new Date(log.data_hora).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
