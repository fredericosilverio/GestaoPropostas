import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Button, 
    Container, 
    Grid, 
    Paper, 
    TextField, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon, 
    Save as SaveIcon, 
    AttachFile as AttachFileIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { FornecedorSelect } from '../../components/FornecedorSelect';
import type { Item, TipoFonte } from '../../types/api';

const TIPO_FONTE_OPTIONS: { value: TipoFonte; label: string }[] = [
    { value: 'COTACAO_FORNECEDOR', label: 'Cotação de Fornecedor' },
    { value: 'PAINEL_PRECOS', label: 'Painel de Preços' },
    { value: 'BANCO_PRECOS', label: 'Banco de Preços' },
    { value: 'CONTRATACAO_SIMILAR', label: 'Contratação Similar' },
    { value: 'NOTA_FISCAL', label: 'Nota Fiscal' },
    { value: 'OUTROS', label: 'Outros' },
];

interface ProposalItem {
    item_id: number;
    codigo_item: number;
    descricao: string;
    quantidade: number;
    unidade_medida: string;
    valor_unitario: string;
    marca: string;
}

export function ProposalEntry() {
    const { id } = useParams(); // Demanda ID
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Header Data
    const [fornecedorId, setFornecedorId] = useState<number | null>(null);
    const [dataProposta, setDataProposta] = useState(new Date().toISOString().split('T')[0]);
    const [tipoFonte, setTipoFonte] = useState<TipoFonte>('COTACAO_FORNECEDOR');
    const [linkFonte, setLinkFonte] = useState('');

    // File upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Items Data
    const [items, setItems] = useState<ProposalItem[]>([]);

    useEffect(() => {
        loadDemandaItems();
    }, [id]);

    async function loadDemandaItems() {
        try {
            const response = await api.get(`/demandas/${id}`);
            const demandaItems: Item[] = response.data.itens;

            // Map to local state
            setItems(demandaItems.map(item => ({
                item_id: item.id,
                codigo_item: item.codigo_item,
                descricao: item.descricao,
                quantidade: item.quantidade,
                unidade_medida: item.unidade_medida,
                valor_unitario: '',
                marca: ''
            })));
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar itens da demanda' });
            navigate(`/demandas/${id}`);
        } finally {
            setLoading(false);
        }
    }

    const handleItemChange = (index: number, field: keyof ProposalItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        // Validar tamanho (max 10MB cada)
        const validFiles = files.filter(f => {
            if (f.size > 10 * 1024 * 1024) {
                addToast({ type: 'error', title: 'Arquivo muito grande', description: `${f.name} excede 10MB` });
                return false;
            }
            return true;
        });

        // Limitar a 5 arquivos
        if (selectedFiles.length + validFiles.length > 5) {
            addToast({ type: 'error', title: 'Limite de arquivos', description: 'Máximo de 5 arquivos por proposta.' });
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!fornecedorId) {
            addToast({ type: 'error', title: 'Atenção', description: 'Selecione um fornecedor' });
            return;
        }

        const itemsToSave = items
            .filter(item => item.valor_unitario && parseFloat(item.valor_unitario) > 0)
            .map(item => ({
                item_id: item.item_id,
                valor_unitario: parseFloat(item.valor_unitario),
            }));

        if (itemsToSave.length === 0) {
            addToast({ type: 'error', title: 'Atenção', description: 'Preencha ao menos um valor de item.' });
            return;
        }

        setSubmitting(true);
        try {
            // 1. Criar os preços em lote
            const response = await api.post('/precos/batch-entry', {
                fornecedor_id: fornecedorId,
                data_coleta: dataProposta,
                tipo_fonte: tipoFonte,
                link_fonte: linkFonte || null,
                itens: itemsToSave
            });

            const createdCount = response.data.count || itemsToSave.length;

            // 2. Upload dos anexos vinculados aos preços criados
            if (response.data.preco_ids && response.data.preco_ids.length > 0) {
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('entityType', 'PRECO');
                    formData.append('entityId', response.data.preco_ids[0].toString());
                    formData.append('descricao', `Proposta Lote - ${file.name}`);

                    await api.post('/uploads', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            addToast({ type: 'success', title: 'Sucesso', description: `Proposta registrada com ${createdCount} item(s) e ${selectedFiles.length} anexo(s)!` });
            navigate(`/demandas/${id}`);
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', description: error.response?.data?.error || 'Erro ao salvar proposta' });
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando itens..." />;

    return (
        <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/demandas/${id}`)}
                        variant="text"
                        color="inherit"
                        sx={{ mb: 1 }}
                    >
                        Voltar para Demanda
                    </Button>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Lançamento de Proposta em Lote
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    size="large"
                >
                    {submitting ? 'Salvando...' : 'Salvar Proposta'}
                </Button>
            </Box>

            {/* Config Panel */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FornecedorSelect
                            value={fornecedorId}
                            onChange={setFornecedorId}
                            label="Fornecedor *"
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Data da Proposta *"
                            type="date"
                            fullWidth
                            value={dataProposta}
                            onChange={e => setDataProposta(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Fonte *</InputLabel>
                            <Select
                                value={tipoFonte}
                                label="Tipo de Fonte *"
                                onChange={e => setTipoFonte(e.target.value as TipoFonte)}
                            >
                                {TIPO_FONTE_OPTIONS.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Link do Edital */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Link do Edital / Fonte Pública"
                            fullWidth
                            type="url"
                            placeholder="https://exemplo.gov.br/edital/123"
                            value={linkFonte}
                            onChange={e => setLinkFonte(e.target.value)}
                        />
                    </Grid>

                    {/* Evidence Upload */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Anexos de Evidência (Opcional)
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                PDF, JPG, PNG - Max 10MB cada, até 5 arquivos
                            </Typography>
                        </Typography>
                        
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<AttachFileIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                size="small"
                            >
                                Selecionar Arquivos
                            </Button>
                            {selectedFiles.length === 0 && (
                                <Typography variant="caption" color="error">
                                    ⚠️ Adicione ao menos 1 evidência
                                </Typography>
                            )}
                        </Stack>

                        {selectedFiles.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedFiles.map((file, index) => (
                                    <Chip
                                        key={index}
                                        label={file.name}
                                        onDelete={() => removeFile(index)}
                                        icon={<DescriptionIcon />}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Items Table */}
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ width: 80 }}>Item</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell sx={{ width: 100 }}>Qtd.</TableCell>
                                <TableCell sx={{ width: 200 }}>Valor Unit. (R$)</TableCell>
                                <TableCell sx={{ width: 250 }}>Marca/Modelo (Opcional)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.item_id} hover>
                                    <TableCell>{item.codigo_item}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{item.descricao}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.unidade_medida}</Typography>
                                    </TableCell>
                                    <TableCell>{item.quantidade}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            fullWidth
                                            placeholder="0,00"
                                            value={item.valor_unitario}
                                            onChange={e => handleItemChange(index, 'valor_unitario', e.target.value)}
                                            inputProps={{ step: "0.01", min: "0" }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="text"
                                            size="small"
                                            fullWidth
                                            placeholder="Marca ofertada"
                                            value={item.marca}
                                            onChange={e => handleItemChange(index, 'marca', e.target.value)}
                                            disabled
                                            title="Recurso de marca em breve"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    size="large"
                >
                    {submitting ? 'Salvando...' : 'Salvar Proposta'}
                </Button>
            </Box>
        </Container>
    );
}
