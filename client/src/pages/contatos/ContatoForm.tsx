import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Container,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Card
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { FileUploader } from '../../components/FileUploader';
import { AttachmentList } from '../../components/AttachmentList';
import type { User, Fornecedor, Pca, Demanda } from '../../types/api';

export function ContatoForm() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isEditing = !!id;

    const routePcaId = searchParams.get('pcaId');
    const routeDemandaId = searchParams.get('demandaId');

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Dictionaries for Selects
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [representantes, setRepresentantes] = useState<any[]>([]);
    const [servidores, setServidores] = useState<User[]>([]);
    const [pcas, setPcas] = useState<Pca[]>([]);
    const [demandas, setDemandas] = useState<Demanda[]>([]);

    // Form Data
    const [dataHora, setDataHora] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [tipoContato, setTipoContato] = useState('REUNIAO');
    const [localMeio, setLocalMeio] = useState('');
    const [fornecedorId, setFornecedorId] = useState<number | ''>('');
    const [representanteId, setRepresentanteId] = useState<number | ''>('');
    const [pauta, setPauta] = useState('');
    const [resultado, setResultado] = useState('');
    const [conflitoInteresse, setConflitoInteresse] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [fontePesquisa, setFontePesquisa] = useState('');
    const [servidoresEnvolvidosIds, setServidoresEnvolvidosIds] = useState<number[]>([]);
    const [pcaId, setPcaId] = useState<number | ''>(routePcaId ? Number(routePcaId) : '');
    const [demandaId, setDemandaId] = useState<number | ''>(routeDemandaId ? Number(routeDemandaId) : '');

    // Auto-fill local_meio from supplier data based on contact type
    useEffect(() => {
        if (!fornecedorId) return;
        const forn = fornecedores.find(f => f.id === fornecedorId);
        if (!forn) return;

        if (tipoContato === 'EMAIL' && forn.email_contato) {
            setLocalMeio(forn.email_contato);
        } else if (tipoContato === 'TELEFONE' && forn.telefone_contato) {
            setLocalMeio(forn.telefone_contato);
        } else if (tipoContato === 'EMAIL' || tipoContato === 'TELEFONE') {
            // Type changed but no data available – clear to allow manual entry
            setLocalMeio('');
        }
    }, [tipoContato, fornecedorId, fornecedores]);

    // Load representantes whenever fornecedor changes
    useEffect(() => {
        if (fornecedorId) {
            loadRepresentantes(Number(fornecedorId));
        } else {
            setRepresentantes([]);
            setRepresentanteId('');
        }
    }, [fornecedorId]);

    useEffect(() => {
        loadDependencias();
    }, []);

    async function loadDependencias() {
        try {
            const [fornRes, servRes, pcaRes, demandaRes] = await Promise.all([
                api.get('/fornecedores?ativo=true'),
                api.get('/users?ativo=true'),
                api.get('/pcas'),
                api.get('/demandas')
            ]);
            setFornecedores(fornRes.data);
            setServidores(servRes.data);
            // pcas may be paginated
            setPcas(Array.isArray(pcaRes.data) ? pcaRes.data : (pcaRes.data.data || []));
            setDemandas(Array.isArray(demandaRes.data) ? demandaRes.data : (demandaRes.data.data || []));

            if (isEditing) {
                await loadContato();
            } else {
                setInitialLoading(false);
            }
        } catch (error) {
            console.error('Erro ao carregar dependências', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar dados auxiliares do formulário' });
            setInitialLoading(false);
        }
    }

    async function loadRepresentantes(idFornecedor: number) {
        try {
            const response = await api.get(`/fornecedores/${idFornecedor}`);
            setRepresentantes(response.data.representantes || []);
        } catch (error) {
            console.error('Erro ao carregar representantes', error);
        }
    }

    async function loadContato() {
        try {
            const response = await api.get(`/contatos/${id}`);
            const data = response.data;

            setDataHora(format(new Date(data.data_hora), "yyyy-MM-dd'T'HH:mm"));
            setTipoContato(data.tipo_contato);
            setLocalMeio(data.local_meio);
            setFornecedorId(data.fornecedor_id);
            setRepresentanteId(data.representante_id || '');
            setPauta(data.pauta);
            setResultado(data.resultado || '');
            setConflitoInteresse(data.conflito_interesse);
            setFontePesquisa(data.fonte_pesquisa || '');
            setPcaId(data.pca_id || '');
            setDemandaId(data.demanda_id || '');
            setObservacoes(data.observacoes || '');

            const servIds = data.servidores_envolvidos?.map((s: any) => s.usuario_id) || [];
            setServidoresEnvolvidosIds(servIds);

            await loadRepresentantes(data.fornecedor_id);
        } catch (error) {
            console.error('Erro ao carregar contato', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar dados do registro' });
            navigate('/contatos');
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!conflitoInteresse) {
            addToast({ type: 'warning', title: 'Atenção', description: 'Você deve assinar a Declaração de Ausência de Conflito de Interesses para salvar.' });
            return;
        }

        if (servidoresEnvolvidosIds.length === 0) {
            addToast({ type: 'warning', title: 'Atenção', description: 'Pelo menos um servidor do órgão deve estar envolvido.' });
            return;
        }

        setLoading(true);

        const data = {
            data_hora: new Date(dataHora).toISOString(),
            tipo_contato: tipoContato,
            local_meio: localMeio,
            fornecedor_id: Number(fornecedorId),
            representante_id: representanteId ? Number(representanteId) : null,
            pauta,
            resultado,
            conflito_interesse: conflitoInteresse,
            fonte_pesquisa: fontePesquisa || null,
            pca_id: pcaId ? Number(pcaId) : null,
            demanda_id: demandaId ? Number(demandaId) : null,
            observacoes,
            servidores_ids: servidoresEnvolvidosIds
        };

        try {
            if (isEditing) {
                await api.put(`/contatos/${id}`, data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Registro de contato atualizado com sucesso' });
            } else {
                const res = await api.post('/contatos', data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Registro efetuado com sucesso. Você já pode anexar arquivos.' });
                navigate(`/contatos/${res.data.id}`);
            }
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao registrar contato';
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) return <LoadingOverlay message="Carregando..." />;

    const isPreFilledFromDemanda = !!(routePcaId || routeDemandaId);

    // Helper: label for localMeio input
    const localMeioLabel = tipoContato === 'EMAIL'
        ? 'E-mail de Contato'
        : tipoContato === 'TELEFONE'
            ? 'Telefone de Contato'
            : 'Local / Link (Meio)';

    const localMeioPlaceholder = tipoContato === 'EMAIL'
        ? 'Ex: contato@empresa.com.br'
        : tipoContato === 'TELEFONE'
            ? 'Ex: (62) 99999-9999'
            : 'Ex: Sala 2, MS Teams, endereço…';

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {isEditing ? 'Editar Registro de Contato' : 'Registrar Novo Contato'}
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    color="inherit"
                >
                    Voltar
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: isEditing ? 8 : 12 }}>
                    <Paper sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>

                            {/* ===== SEÇÃO 1: DADOS DO FORNECEDOR ===== */}
                            <Grid size={12}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                                    1. Dados do Fornecedor
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Fornecedor</InputLabel>
                                    <Select
                                        value={fornecedorId}
                                        onChange={e => setFornecedorId(e.target.value as number)}
                                        label="Fornecedor"
                                    >
                                        {fornecedores.map(f => (
                                            <MenuItem key={f.id} value={f.id}>
                                                {f.razao_social}{f.nome_fantasia ? ` (${f.nome_fantasia})` : ''} — {f.cnpj}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Representante do Fornecedor (opcional)</InputLabel>
                                    <Select
                                        value={representanteId}
                                        onChange={e => setRepresentanteId(e.target.value as number)}
                                        label="Representante do Fornecedor (opcional)"
                                        disabled={!fornecedorId || representantes.length === 0}
                                    >
                                        <MenuItem value="">Não informado</MenuItem>
                                        {representantes.map(rep => (
                                            <MenuItem key={rep.id} value={rep.id}>{rep.nome} - {rep.cargo}</MenuItem>
                                        ))}
                                        {representantes.length === 0 && (
                                            <MenuItem value="" disabled>Nenhum representante cadastrado</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* ===== SEÇÃO 2: DADOS DO CONTATO ===== */}
                            <Grid size={12}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 1 }}>
                                    2. Informações do Contato
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Data e Hora"
                                    type="datetime-local"
                                    value={dataHora}
                                    onChange={e => setDataHora(e.target.value)}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Meio de Comunicação</InputLabel>
                                    <Select
                                        value={tipoContato}
                                        onChange={e => setTipoContato(e.target.value)}
                                        label="Meio de Comunicação"
                                    >
                                        <MenuItem value="REUNIAO">Reunião Presencial</MenuItem>
                                        <MenuItem value="VIDEOCONFERENCIA">Videoconferência</MenuItem>
                                        <MenuItem value="EMAIL">E-mail</MenuItem>
                                        <MenuItem value="TELEFONE">Telefone</MenuItem>
                                        <MenuItem value="VISITA_TECNICA">Visita Técnica</MenuItem>
                                        <MenuItem value="OUTROS">Outros</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label={localMeioLabel}
                                    value={localMeio}
                                    onChange={e => setLocalMeio(e.target.value)}
                                    fullWidth
                                    required
                                    placeholder={localMeioPlaceholder}
                                    helperText={
                                        (tipoContato === 'EMAIL' || tipoContato === 'TELEFONE') && fornecedorId
                                            ? 'Preenchido automaticamente do cadastro do fornecedor (editável)'
                                            : undefined
                                    }
                                />
                            </Grid>

                            <Grid size={12}>
                                <Autocomplete
                                    multiple
                                    options={servidores}
                                    getOptionLabel={(option) => option.nome_completo}
                                    value={servidores.filter(s => servidoresEnvolvidosIds.includes(s.id))}
                                    onChange={(_, newValue) => {
                                        setServidoresEnvolvidosIds(newValue.map(v => v.id));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Servidores do Órgão Envolvidos"
                                            placeholder="Selecione os servidores"
                                            required={servidoresEnvolvidosIds.length === 0}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* ===== SEÇÃO 3: ASSUNTO ===== */}
                            <Grid size={12}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 1 }}>
                                    3. Assunto, Vinculação e Fonte
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Pauta / Assunto"
                                    value={pauta}
                                    onChange={e => setPauta(e.target.value)}
                                    fullWidth
                                    required
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Resultado / Deliberações"
                                    value={resultado}
                                    onChange={e => setResultado(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Fonte de Pesquisa (URL ou descrição)"
                                    value={fontePesquisa}
                                    onChange={e => setFontePesquisa(e.target.value)}
                                    fullWidth
                                    placeholder="Ex: https://sislor.go.gov.br/... ou Nome do Portal"
                                    helperText="Indique a origem da pesquisa utilizada para justificar o contato"
                                />
                            </Grid>

                            {/* PCA e Demanda como selects descritivos */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth disabled={!!routePcaId}>
                                    <InputLabel>PCA Relacionado (opcional)</InputLabel>
                                    <Select
                                        value={pcaId}
                                        onChange={e => {
                                            setPcaId(e.target.value as number);
                                            // Clear demanda when changing PCA
                                            if (!routeDemandaId) setDemandaId('');
                                        }}
                                        label="PCA Relacionado (opcional)"
                                    >
                                        <MenuItem value="">Nenhum</MenuItem>
                                        {pcas.map(p => (
                                            <MenuItem key={p.id} value={p.id}>
                                                PCA {p.ano} — {p.numero_pca}{p.denominacao ? ` | ${p.denominacao}` : ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth disabled={!!routeDemandaId}>
                                    <InputLabel>Demanda Relacionada (opcional)</InputLabel>
                                    <Select
                                        value={demandaId}
                                        onChange={e => setDemandaId(e.target.value as number)}
                                        label="Demanda Relacionada (opcional)"
                                    >
                                        <MenuItem value="">Nenhuma</MenuItem>
                                        {(pcaId
                                            ? demandas.filter(d => d.pca?.id === pcaId)
                                            : demandas
                                        ).map(d => (
                                            <MenuItem key={d.id} value={d.id}>
                                                {d.codigo_demanda} — {d.descricao}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {isPreFilledFromDemanda && (
                                    <Typography variant="caption" color="text.secondary">
                                        Vínculo automático preenchido a partir do atalho de Demanda.
                                    </Typography>
                                )}
                            </Grid>

                            {/* ===== DECLARAÇÃO ===== */}
                            <Grid size={12} sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={conflitoInteresse}
                                            onChange={e => setConflitoInteresse(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            DECLARO, para os devidos fins legais, a AUSÊNCIA de conflitos de interesses da minha parte e dos demais servidores em relação ao Fornecedor e Representante supra qualificados.
                                        </Typography>
                                    }
                                />
                            </Grid>

                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/contatos')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                >
                                    {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {isEditing && (
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom>Anexos Comprobatórios</Typography>
                        <Card sx={{ p: 2, mb: 2 }}>
                            <FileUploader
                                entityType="CONTATO_FORNECEDOR"
                                entityId={Number(id)}
                                onUploadSuccess={loadContato}
                            />
                        </Card>
                        <Card sx={{ p: 2 }}>
                            <AttachmentList
                                entityType="CONTATO_FORNECEDOR"
                                entityId={Number(id)}
                                refreshTrigger={Date.now()}
                            />
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
