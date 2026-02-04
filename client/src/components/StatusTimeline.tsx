import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Skeleton
} from '@mui/material';
import { api } from '../services/api';
import { StatusBadge } from './StatusBadge';
import type { AuditLog } from '../types/api';

interface Props {
    demandaId: number;
}

// Map status to MUI palette colors
const STATUS_COLORS: Record<string, string> = {
    'CADASTRADA': 'grey.400',
    'EM_ANALISE': 'warning.main',
    'ESTIMADA': 'secondary.main',
    'EM_CONTRATACAO': 'info.main',
    'CONTRATADA': 'success.main',
    'SUSPENSA': 'warning.dark',
    'CANCELADA': 'error.main'
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
            <Box sx={{ width: '100%' }}>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
            </Box>
        );
    }

    if (logs.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    Nenhuma transição de status registrada.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', pl: 2 }}>
            {/* Vertical Line */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 23, 
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: 'divider',
                    zIndex: 0
                }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {logs.map((log, index) => {
                    const status = log.valor_novo as string || 'CADASTRADA';
                    const isFirst = index === 0;

                    return (
                        <Box key={log.id} sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'flex-start', zIndex: 1 }}>
                            {/* Dot */}
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: STATUS_COLORS[status] || 'grey.400',
                                    border: '4px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: isFirst ? 1 : 0,
                                    mt: 1.5,
                                    ml: 0.5,
                                    outline: isFirst ? '2px solid' : 'none',
                                    outlineColor: 'primary.main',
                                    outlineOffset: 2
                                }}
                            />
                            
                            {/* Content */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderColor: isFirst ? 'primary.main' : 'divider',
                                    bgcolor: 'background.paper',
                                    borderWidth: isFirst ? 2 : 1
                                }}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    {log.acao === 'CRIACAO' ? (
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Demanda Criada
                                        </Typography>
                                    ) : (
                                        <>
                                            {log.valor_anterior && (
                                                <>
                                                    <StatusBadge status={log.valor_anterior as any} />
                                                    <Typography color="text.secondary">→</Typography>
                                                </>
                                            )}
                                            <StatusBadge status={status as any} />
                                        </>
                                    )}
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {log.usuario?.nome_completo} • {new Date(log.data_hora).toLocaleString()}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
