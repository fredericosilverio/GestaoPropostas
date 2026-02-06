import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
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

interface UserOption {
    id: number;
    nome_completo: string;
    email: string;
}

export function DemandaForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const { user } = useAuth();
    
    const [pcaId, setPcaId] = useState('');
    const [pcas, setPcas] = useState<PcaOption[]>([]);
    const [usuarios, setUsuarios] = useState<UserOption[]>([]);
    
    // Form Fields
    const [codigoDemanda, setCodigoDemanda] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorEstimado, setValorEstimado] = useState('');
    const [justificativaTecnica, setJustificativaTecnica] = useState('');
    const [justificativaAdministrativa, setJustificativaAdministrativa] = useState('');
    const [centroCusto, setCentroCusto] = useState('');
    const [prazoVigencia, setPrazoVigencia] = useState('');
    const [dataPrevista, setDataPrevista] = useState('');
    const [responsavelId, setResponsavelId] = useState<string | number>('');

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
        loadUsuarios();
    }, []);

    useEffect(() => {
        if (id) {
            loadDemanda(id);
        } else if (user) {
            // Se for criação, define responsável como o usuário logado por padrão
            setResponsavelId(user.id);
        }
    }, [id, user]);

    async function loadPcas() {
        try {
            const response = await api.get('/pcas');
            setPcas(response.data);
        } catch (err) {
            console.error("Failed to load PCAs");
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar PCAs' });
        }
    }

    async function loadUsuarios() {
        try {
            const response = await api.get('/users/active');
            setUsuarios(response.data);
        } catch (err: any) {
            console.error("Failed to load Users", err);
            addToast({ type: 'error', title: 'Erro', description: `Falha ao carregar Usuários: ${err.message}` });
        }
    }

    async function loadDemanda(demandaId: string) {
        setLoading(true);
        try {
            const response = await api.get(`/demandas/${demandaId}`);
            const d = response.data;
            
            setPcaId(d.pca_id);
            setCodigoDemanda(d.codigo_demanda);
            setDescricao(d.descricao);
            
            // Format currency
            if (d.valor_estimado_global) {
                const val = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(d.valor_estimado_global);
                setValorEstimado(val);
            }
            
            setJustificativaTecnica(d.justificativa_tecnica);
            setJustificativaAdministrativa(d.justificativa_administrativa);
            setCentroCusto(d.centro_custo);
            setPrazoVigencia(d.prazo_vigencia_meses);
            
            // Format date YYYY-MM-DD
            if (d.data_prevista_contratacao) {
                const date = new Date(d.data_prevista_contratacao);
                setDataPrevista(date.toISOString().split('T')[0]);
            }
            
            setTipoContratacao(d.tipo_contratacao);
            setNaturezaDespesa(d.natureza_despesa);
            setElementoDespesa(d.elemento_despesa);
            setUnidadeDemandante(d.unidade_demandante);
            setResponsavelId(d.responsavel_id);

        } catch (err) {
            setError('Erro ao carregar dados da demanda');
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar dados' });
        } finally {
            setLoading(false);
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

        if (new Date(dataPrevista) < new Date() && !isEditing) {
            setError('A data prevista deve ser futura.');
            setLoading(false);
            return;
        }

        // Convert formatted currency string back to number
        const valorNumerico = valorEstimado
            ? Number(valorEstimado.replace(/[^0-9,-]+/g, "").replace(",", "."))
            : null;

        const payload = {
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
            unidade_demandante: unidadeDemandante,
            responsavel_id: responsavelId ? Number(responsavelId) : undefined
        };

        try {
            if (isEditing) {
                await api.put(`/demandas/${id}`, payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Demanda atualizada com sucesso!' });
                navigate(`/demandas/${id}`);
            } else {
                await api.post('/demandas', payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Demanda criada com sucesso!' });
                navigate('/demandas');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Erro ao salvar Demanda';
            setError(msg);
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    }

    if (loading && isEditing && !codigoDemanda) {
        return (
            <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    {isEditing ? 'Editar Demanda' : 'Nova Demanda'}
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
                                disabled={isEditing}
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
                                placeholder="Gerado automaticamente"
                                disabled={isEditing || true} // Always disabled as backend generates/updates it
                                helperText={!isEditing ? "Gerado automaticamente ao salvar" : ""}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Unidade Demandante"
                                value={unidadeDemandante}
                                onChange={e => setUnidadeDemandante(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Responsável pela Análise"
                                value={responsavelId}
                                onChange={e => setResponsavelId(e.target.value)}
                                required
                            >
                                <MenuItem value="">
                                    <em>Selecione...</em>
                                </MenuItem>
                                {usuarios.map(u => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.nome_completo}
                                    </MenuItem>
                                ))}
                            </TextField>
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

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Valor Estimado Global (R$)"
                                value={valorEstimado}
                                onChange={handleValorChange}
                                placeholder="R$ 0,00"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Centro de Custo"
                                value={centroCusto}
                                onChange={e => setCentroCusto(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Elemento de Despesa"
                                value={elementoDespesa}
                                onChange={e => setElementoDespesa(e.target.value)}
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
                            onClick={() => navigate(isEditing ? `/demandas/${id}` : '/demandas')}
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
