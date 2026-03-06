import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export function RelatorioContatos() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Filtros
    const [pcaId, setPcaId] = useState<number | ''>('');
    const [demandaId, setDemandaId] = useState<number | ''>('');
    const [fornecedorId, setFornecedorId] = useState<number | ''>('');

    // Listas para os Selects
    const [pcas, setPcas] = useState<any[]>([]);
    const [demandas, setDemandas] = useState<any[]>([]);
    const [fornecedores, setFornecedores] = useState<any[]>([]);

    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExl, setDownloadingExl] = useState(false);

    useEffect(() => {
        loadFilters();
    }, []);

    async function loadFilters() {
        try {
            const [pcaRes, demRes, fornRes] = await Promise.all([
                api.get('/pcas'),
                api.get('/demandas'),
                api.get('/fornecedores')
            ]);
            setPcas(pcaRes.data);
            setDemandas(demRes.data);
            setFornecedores(fornRes.data);
        } catch (error) {
            console.error('Erro ao carregar filtros', error);
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível carregar as opções de filtro' });
        }
    }

    const handleDownload = async (format: 'pdf' | 'excel') => {
        if (format === 'pdf') setDownloadingPdf(true);
        if (format === 'excel') setDownloadingExl(true);

        try {
            const params = new URLSearchParams();
            if (pcaId) params.append('pcaId', pcaId.toString());
            if (demandaId) params.append('demandaId', demandaId.toString());
            if (fornecedorId) params.append('fornecedorId', fornecedorId.toString());
            params.append('format', format);

            const response = await api.get(`/contatos/reports/export?${params.toString()}`, {
                responseType: 'blob' // Important for downloading files
            });

            // Handle file download in browser
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = `relatorio_contatos.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();

            addToast({ type: 'success', title: 'Sucesso', description: 'Relatório exportado com sucesso' });
        } catch (error) {
            console.error('Erro ao gerar relatório', error);
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao processar o relatório consolidado' });
        } finally {
            setDownloadingPdf(false);
            setDownloadingExl(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Relatório Consolidado de Contatos
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/contatos')}
                    variant="outlined"
                    color="inherit"
                >
                    Voltar
                </Button>
            </Box>

            <Card elevation={3} sx={{ mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Filtros de Exportação
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Selecione os parâmetros abaixo para gerar o relatório consolidado de contatos com fornecedores.
                        Deixe em branco para exportar todos os registros de forma sumarizada.
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>PCA (Opcional)</InputLabel>
                                <Select
                                    value={pcaId}
                                    label="PCA (Opcional)"
                                    onChange={(e) => setPcaId(e.target.value as number)}
                                >
                                    <MenuItem value={''}>Todos</MenuItem>
                                    {pcas.map(pca => (
                                        <MenuItem key={pca.id} value={pca.id}>
                                            {pca.numero_pca}/{pca.ano} - {pca.orgao}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Demanda (Opcional)</InputLabel>
                                <Select
                                    value={demandaId}
                                    label="Demanda (Opcional)"
                                    onChange={(e) => setDemandaId(e.target.value as number)}
                                >
                                    <MenuItem value={''}>Todas</MenuItem>
                                    {demandas.map(dem => (
                                        <MenuItem key={dem.id} value={dem.id}>
                                            {dem.codigo_demanda}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Fornecedor (Opcional)</InputLabel>
                                <Select
                                    value={fornecedorId}
                                    label="Fornecedor (Opcional)"
                                    onChange={(e) => setFornecedorId(e.target.value as number)}
                                >
                                    <MenuItem value={''}>Todos</MenuItem>
                                    {fornecedores.map(forn => (
                                        <MenuItem key={forn.id} value={forn.id}>
                                            {forn.nome_fantasia || forn.razao_social}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={downloadingPdf || downloadingExl}
                            startIcon={downloadingPdf ? <CircularProgress size={24} color="inherit" /> : <PdfIcon />}
                            onClick={() => handleDownload('pdf')}
                        >
                            {downloadingPdf ? 'Gerando...' : 'Exportar PDF'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            size="large"
                            disabled={downloadingPdf || downloadingExl}
                            startIcon={downloadingExl ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
                            onClick={() => handleDownload('excel')}
                        >
                            {downloadingExl ? 'Gerando...' : 'Exportar Planilha Excel'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ bgcolor: 'info.main', color: 'info.contrastText', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" align="center">
                    Nota: O relatório em PDF atende aos requisitos de auditoria estabelecidos no Decreto Estadual nº 9.900/2021,
                    trazendo um compilado cronológico de todas interações, servidores envolvidos e eventuais pautas e resoluções.
                </Typography>
            </Box>
        </Container>
    );
}
