import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Print as PrintIcon,
    PictureAsPdf as PdfIcon,
    TableView as ExcelIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { ReportOptionsModal } from '../../components/ReportOptionsModal';
import type { MarketAnalysisReport } from '../../types/api';

export function ReportPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<MarketAnalysisReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.get(`/reports/market-analysis/${id}`)
            .then(res => setReport(res.data))
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar relatório');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = async (filterType: 'all' | 'median25' | 'median25fallback') => {
        try {
            setIsPdfLoading(true);
            const response = await api.get(`/reports/market-analysis/${id}/pdf?filterType=${filterType}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            const now = new Date();
            const timestamp = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') + "_" +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');

            link.setAttribute('download', `relatorio_analise_${report?.demanda?.codigo || id}_${timestamp}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsOptionsModalOpen(false);
        } catch (error) {
            console.error('Erro ao baixar PDF', error);
            alert('Erro ao gerar PDF. Verifique se o servidor está rodando.');
        } finally {
            setIsPdfLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await api.get(`/reports/market-analysis/${id}/export`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_analise_mercado_${report?.demanda?.codigo}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao baixar Excel', error);
            alert('Erro ao baixar Excel');
        }
    };

    if (loading) {
        return <LoadingOverlay message="Carregando relatório..." />;
    }

    if (error || !report) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
                <WarningIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {error || 'Relatório não encontrado.'}
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Voltar
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
            <Box sx={{ maxWidth: '210mm', mx: 'auto', mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '@media print': { display: 'none' } }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} color="inherit">
                    Voltar
                </Button>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
                        Imprimir
                    </Button>
                    <Button variant="contained" color="secondary" startIcon={<PdfIcon />} onClick={() => setIsOptionsModalOpen(true)}>
                        PDF (Gerado)
                    </Button>
                    <Button variant="outlined" color="success" startIcon={<ExcelIcon />} onClick={handleExportExcel}>
                        Excel
                    </Button>
                </Stack>
            </Box>

            {/* A4 Page Container */}
            <Paper
                ref={printRef}
                elevation={3}
                sx={{
                    width: '210mm',
                    minHeight: '297mm',
                    mx: 'auto',
                    p: '20mm',
                    bgcolor: 'white',
                    color: 'black',
                    '@media print': {
                        boxShadow: 'none',
                        m: 0,
                        width: '100%',
                        height: 'auto',
                        overflow: 'visible'
                    }
                }}
            >
                {/* Header */}
                <Box sx={{ borderBottom: '2px solid', borderColor: 'grey.800', pb: 2, mb: 4, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
                        Estado de Goiás
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" textTransform="uppercase">
                        {report.demanda.unidade_demandante}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        Relatório de Análise de Mercado
                    </Typography>
                </Box>

                {/* Info Block */}
                <Grid container spacing={2} sx={{ mb: 4, fontSize: '0.875rem' }}>
                    <Grid size={6}>
                        <Typography variant="body2"><strong>Demanda:</strong> {report.demanda.codigo}</Typography>
                        <Typography variant="body2"><strong>PCA:</strong> {report.demanda.pca}</Typography>
                        <Typography variant="body2"><strong>Responsável:</strong> {report.demanda.responsavel}</Typography>
                    </Grid>
                    <Grid size={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2"><strong>Data Emissão:</strong> {new Date(report.data_emissao).toLocaleDateString()}</Typography>
                        <Typography variant="body2"><strong>Status:</strong> Estimada</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Objeto:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50', textAlign: 'justify' }}>
                        <Typography variant="body2">
                            {report.demanda.descricao}
                        </Typography>
                    </Paper>
                </Box>

                {/* Items Table */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'grey.300', pb: 0.5 }}>
                        Resumo dos Itens
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="center">Unid.</TableCell>
                                    <TableCell align="right">Qtd.</TableCell>
                                    <TableCell align="right">Valor Unit. (Est.)</TableCell>
                                    <TableCell align="right">Total (Est.)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {report.itens.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.codigo_item}</TableCell>
                                        <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal' }}>
                                            <Typography variant="body2" noWrap={false} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.descricao_detalhada}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{item.unidade_medida}</TableCell>
                                        <TableCell align="right">{item.quantidade}</TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_estimado_unitario || 0)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_estimado_final || 0)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                                        VALOR TOTAL ESTIMADO:
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(report.resumo.valor_total_estimado)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Detailed Analysis */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'grey.300', pb: 0.5, mb: 2 }}>
                        Detalhamento da Composição de Preços
                    </Typography>
                    {report.itens.map((item: any) => (
                        <Box key={item.id} sx={{ mb: 4, pageBreakInside: 'avoid' }}>
                            <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.100', mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Item {item.codigo_item}: {item.descricao_detalhada} (Quant: {item.quantidade} {item.unidade_medida})
                                </Typography>
                            </Paper>

                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
                                <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell>Fonte</TableCell>
                                            <TableCell align="center">Data</TableCell>
                                            <TableCell align="right">Valor Unit.</TableCell>
                                            <TableCell align="center">Situação</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item.precos.map((preco: any) => (
                                            <TableRow key={preco.id}>
                                                <TableCell>{preco.fonte}</TableCell>
                                                <TableCell align="center">{new Date(preco.data_coleta).toLocaleDateString()}</TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco.valor_unitario)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {preco.classificacao === 'ACEITO' ? '✅ Aceito' :
                                                        preco.classificacao === 'ACIMA_DO_LIMITE' ? '🔴 Acima (+25%)' :
                                                            preco.classificacao === 'ABAIXO_DO_LIMITE' ? '🟡 Abaixo (-25%)' : '⚪ Inválido'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50' }}>
                                <Grid container spacing={2} sx={{ fontSize: '0.75rem' }}>
                                    <Grid size={3}>
                                        <Typography variant="caption" display="block"><strong>Média:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.media)}</Typography>
                                    </Grid>
                                    <Grid size={3}>
                                        <Typography variant="caption" display="block"><strong>Mediana:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.mediana)}</Typography>
                                    </Grid>
                                    <Grid size={3}>
                                        <Typography variant="caption" display="block"><strong>Desvio Padrão:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.desvioPadrao)}</Typography>
                                    </Grid>
                                    <Grid size={3}>
                                        <Typography variant="caption" display="block"><strong>CV:</strong> {(item.estatisticas?.cv ?? 0).toFixed(2)}%</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    ))}
                </Box>

                {/* Footer Signature Area */}
                <Box sx={{ mt: 8, pt: 4, textAlign: 'center', pageBreakInside: 'avoid' }}>
                    <Grid container spacing={8} justifyContent="center">
                        <Grid size={5}>
                            <Box sx={{ borderTop: 1, borderColor: 'black', pt: 1 }}>
                                <Typography variant="body2">{report.demanda.responsavel}</Typography>
                                <Typography variant="caption" color="text.secondary">Responsável pela Cotação</Typography>
                            </Box>
                        </Grid>
                        <Grid size={5}>
                            <Box sx={{ borderTop: 1, borderColor: 'black', pt: 1 }}>
                                <Typography variant="body2">Gestor Responsável</Typography>
                                <Typography variant="caption" color="text.secondary">Aprovação</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <style>
                {`
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body * {
                            visibility: hidden;
                        }
                        #root > div {
                            background: white;
                        }
                        .MuiPaper-root {
                            visibility: visible;
                            position: absolute;
                            left: 0;
                            top: 0;
                            box-shadow: none !important;
                            margin: 0 !important;
                            width: 100% !important;
                            print-color-adjust: exact;
                        }
                        .MuiPaper-root * {
                            visibility: visible;
                        }
                        /* Ensure backgrounds are printed */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>

            <ReportOptionsModal
                isOpen={isOptionsModalOpen}
                onClose={() => setIsOptionsModalOpen(false)}
                onGenerate={handleExportPDF}
                isLoading={isPdfLoading}
            />
        </Box>
    );
}
