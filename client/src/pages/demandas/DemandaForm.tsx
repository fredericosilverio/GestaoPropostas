import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface PcaOption {
    id: number;
    ano: number;
    orgao: string;
    versao: number;
}

export function DemandaForm() {
    const [pcaId, setPcaId] = useState('');
    const [pcas, setPcas] = useState<PcaOption[]>([]);

    // Form Fields
    const [codigoDemanda, setCodigoDemanda] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorEstimado, setValorEstimado] = useState('');
    const [justificativaTecnica, setJustificativaTecnica] = useState('');
    const [justificativaAdministrativa, setJustificativaAdministrativa] = useState('');
    const [centroCusto, setCentroCusto] = useState('');
    const [prazoVigencia, setPrazoVigencia] = useState('');
    const [dataPrevista, setDataPrevista] = useState('');

    // Default enums
    const [tipoContratacao, setTipoContratacao] = useState('NOVA');
    const [naturezaDespesa, setNaturezaDespesa] = useState('CUSTEIO');
    const [elementoDespesa, setElementoDespesa] = useState('');
    const [unidadeDemandante, setUnidadeDemandante] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        loadPcas();
    }, []);

    async function loadPcas() {
        try {
            const response = await api.get('/pcas');
            // Filter only active PCAs if needed
            setPcas(response.data);
        } catch (err) {
            console.error("Failed to load PCAs");
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar PCAs' });
        }
    }

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const numberValue = Number(value) / 100;
        setValorEstimado(new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numberValue));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!pcaId) {
            setError('Selecione um PCA');
            setLoading(false);
            return;
        }

        if (Number(prazoVigencia) <= 0) {
            setError('Prazo de vigência deve ser maior que 0');
            setLoading(false);
            return;
        }

        if (new Date(dataPrevista) < new Date()) {
            setError('A data prevista deve ser futura.');
            setLoading(false);
            return;
        }

        // Convert formatted currency string back to number
        const valorNumerico = valorEstimado
            ? Number(valorEstimado.replace(/[^0-9,-]+/g, "").replace(",", "."))
            : null;

        try {
            await api.post('/demandas', {
                pca_id: Number(pcaId),
                codigo_demanda: codigoDemanda,
                descricao,
                valor_estimado_global: valorNumerico,
                justificativa_tecnica: justificativaTecnica,
                justificativa_administrativa: justificativaAdministrativa,
                centro_custo: centroCusto,
                prazo_vigencia_meses: Number(prazoVigencia),
                data_prevista_contratacao: new Date(dataPrevista),
                tipo_contratacao: tipoContratacao,
                natureza_despesa: naturezaDespesa,
                elemento_despesa: elementoDespesa,
                unidade_demandante: unidadeDemandante
            });
            addToast({ type: 'success', title: 'Sucesso', description: 'Demanda criada com sucesso!' });
            navigate('/demandas');
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Erro ao criar Demanda';
            setError(msg);
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    Nova Demanda
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                select
                                fullWidth
                                label="PCA Vinculado (Ano/Órgão)"
                                value={pcaId}
                                onChange={e => setPcaId(e.target.value)}
                                required
                            >
                                <MenuItem value="">
                                    <em>Selecione...</em>
                                </MenuItem>
                                {pcas.map(pca => (
                                    <MenuItem key={pca.id} value={pca.id}>
                                        {pca.ano} - {pca.orgao} (v{pca.versao})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Código da Demanda"
                                value={codigoDemanda}
                                onChange={e => setCodigoDemanda(e.target.value)}
                                placeholder="Ex: D-2026/001"
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Unidade Demandante"
                                value={unidadeDemandante}
                                onChange={e => setUnidadeDemandante(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Valor Estimado Global (R$)"
                                value={valorEstimado}
                                onChange={handleValorChange}
                                placeholder="R$ 0,00"
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Objeto (Descrição Resumida)"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Justificativa Técnica"
                                value={justificativaTecnica}
                                onChange={e => setJustificativaTecnica(e.target.value)}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Justificativa Administrativa"
                                value={justificativaAdministrativa}
                                onChange={e => setJustificativaAdministrativa(e.target.value)}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Centro de Custo"
                                value={centroCusto}
                                onChange={e => setCentroCusto(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Elemento de Despesa"
                                value={elementoDespesa}
                                onChange={e => setElementoDespesa(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Prazo Vigência (meses)"
                                type="number"
                                value={prazoVigencia}
                                onChange={e => setPrazoVigencia(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Data Prevista Contratação"
                                type="date"
                                value={dataPrevista}
                                onChange={e => setDataPrevista(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Tipo Contratação"
                                value={tipoContratacao}
                                onChange={e => setTipoContratacao(e.target.value)}
                            >
                                <MenuItem value="NOVA">Nova</MenuItem>
                                <MenuItem value="RENOVACAO">Renovação</MenuItem>
                                <MenuItem value="PRORROGACAO">Prorrogação</MenuItem>
                                <MenuItem value="ADESAO">Adesão (Carona)</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Natureza Despesa"
                                value={naturezaDespesa}
                                onChange={e => setNaturezaDespesa(e.target.value)}
                            >
                                <MenuItem value="CUSTEIO">Custeio</MenuItem>
                                <MenuItem value="INVESTIMENTO">Investimento</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/demandas')}
                            startIcon={<ArrowBackIcon />}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
