import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
    Box, 
    Paper, 
    Typography, 
    Grid, 
    Skeleton,
    Divider
} from '@mui/material';

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
            <Paper sx={{ p: 2, height: 128 }}>
                <Skeleton variant="rectangular" height="100%" />
            </Paper>
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

    return (
        <Paper elevation={0} variant="outlined" sx={{ overflow: 'hidden' }}>
            <Grid container>
                {/* Card grande - Total de demandas */}
                <Grid size={{ xs: 12, lg: 2 }}>
                    <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'primary.contrastText',
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: 150, lg: 'auto' }
                    }}>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            {displayStats.totalDemandas}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1, mt: 1 }}>
                            Demandas
                        </Typography>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Propostas
                        </Typography>
                    </Box>
                </Grid>

                {/* Resumo por tipo de contratação */}
                <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ borderRight: { lg: 1 }, borderBottom: { xs: 1, lg: 0 }, borderColor: 'divider' }}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {Object.entries(displayStats.porTipoContratacao).some(([_, data]) => data.count > 0 || data.total > 0) ? (
                                <>
                                    {Object.entries(displayStats.porTipoContratacao).map(([tipo, data]) => {
                                        if (data.count === 0 && data.total === 0) return null;
                                        return (
                                            <Box key={tipo} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {TIPO_CONTRATACAO_LABELS[tipo] || tipo}: <Box component="span" fontWeight="bold" color="text.primary">{data.count}</Box>
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatCurrency(data.total)}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" fontWeight="bold">Total:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {formatCurrency(displayStats.valorTotalGeral)}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">Nenhum dado disponível</Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>

                {/* Resumo por natureza de despesa */}
                <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {Object.entries(displayStats.porNaturezaDespesa).some(([_, data]) => data.count > 0 || data.total > 0) ? (
                                <>
                                    {Object.entries(displayStats.porNaturezaDespesa).map(([natureza, data]) => {
                                        if (data.count === 0 && data.total === 0) return null;
                                        return (
                                            <Box key={natureza} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {NATUREZA_LABELS[natureza] || natureza}: <Box component="span" fontWeight="bold" color="text.primary">{data.count}</Box>
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatCurrency(data.total)}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" fontWeight="bold">Total:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {formatCurrency(displayStats.valorTotalGeral)}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">Nenhum dado disponível</Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
