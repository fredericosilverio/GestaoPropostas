import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Add as AddIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AttachmentList } from '../../components/AttachmentList';
import { FornecedorSelect } from '../../components/FornecedorSelect';
import { useToast } from '../../contexts/ToastContext';
import { validateCNPJ, formatCNPJ } from '../../utils/validators';
import type { Preco, Anexo, Fornecedor, TipoFonte, Item } from '../../types/api';

const TIPO_FONTE_OPTIONS: { value: TipoFonte; label: string }[] = [
    { value: 'COTACAO_FORNECEDOR', label: 'Cotação de Fornecedor' },
    { value: 'PAINEL_PRECOS', label: 'Painel de Preços' },
    { value: 'BANCO_PRECOS', label: 'Banco de Preços' },
    { value: 'CONTRATACAO_SIMILAR', label: 'Contratação Similar' },
    { value: 'NOTA_FISCAL', label: 'Nota Fiscal' },
    { value: 'OUTROS', label: 'Outros' },
];

export function PriceManager() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [prices, setPrices] = useState<Preco[]>([]);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [fornecedorId, setFornecedorId] = useState<number | null>(null);
    const [valor, setValor] = useState('');
    const [fonte, setFonte] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [cnpjError, setCnpjError] = useState('');
    const [linkFonte, setLinkFonte] = useState('');
    const [tipoFonte, setTipoFonte] = useState<TipoFonte>('COTACAO_FORNECEDOR');
    const [dataColeta, setDataColeta] = useState(new Date().toISOString().split('T')[0]);

    // Edit modal state
    const [editingPrice, setEditingPrice] = useState<Preco | null>(null);
    const [editValor, setEditValor] = useState('');
    const [editFonte, setEditFonte] = useState('');
    const [editTipoFonte, setEditTipoFonte] = useState<TipoFonte>('COTACAO_FORNECEDOR');
    const [editLinkFonte, setEditLinkFonte] = useState('');
    const [editDataColeta, setEditDataColeta] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleFornecedorChange(id: number | null) {
        setFornecedorId(id);
        if (id) {
            try {
                const res = await api.get(`/fornecedores/${id}`);
                const f: Fornecedor = res.data;
                setFonte(f.nome_fantasia || f.razao_social);
                setCnpj(f.cnpj);
            } catch (error) {
                console.error('Error fetching supplier', error);
            }
        } else {
            setFonte('');
            setCnpj('');
        }
    }

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    // File upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [expandedPriceId, setExpandedPriceId] = useState<number | null>(null);
    const [priceAttachments, setPriceAttachments] = useState<Record<number, Anexo[]>>({});

    useEffect(() => {
        loadData();
    }, [itemId]);

    async function loadData() {
        setLoading(true);
        
        // Carregar preços (Prioridade)
        try {
            const pricesRes = await api.get(`/precos?item_id=${itemId}`);
            setPrices(pricesRes.data);
        } catch (err) {
            console.error('Erro ao carregar preços:', err);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar preços' });
        }

        // Carregar dados do item (Secundário)
        try {
            const itemRes = await api.get(`/itens/${itemId}`);
            setItem(itemRes.data);
        } catch (err) {
            console.error('Erro ao carregar item:', err);
            // Não bloqueia a tela se falhar ao carregar detalhes do item
        } finally {
            setLoading(false);
        }
    }

    async function refresh() {
        const res = await api.get(`/precos?item_id=${itemId}`);
        setPrices(res.data);
    }

    async function handleAddPrice(e: React.FormEvent) {
        e.preventDefault();

        try {
            // 1. Criar o preço
            const precoRes = await api.post('/precos', {
                item_id: Number(itemId),
                valor_unitario: Number(valor),
                fonte,
                cnpj_fornecedor: cnpj,
                fornecedor_id: fornecedorId,
                tipo_fonte: tipoFonte,
                link_fonte: linkFonte || null,
                unidade_medida: 'UN',
                data_coleta: dataColeta,
                classificacao: 'ACEITO'
            });

            const precoId = precoRes.data.id;

            // 2. Fazer upload dos anexos vinculados ao preço
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('entityType', 'PRECO');
                formData.append('entityId', precoId.toString());
                formData.append('descricao', file.name);

                await api.post('/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // 3. Limpar formulário
            setValor('');
            setFonte('');
            setCnpj('');
            setFornecedorId(null);
            setLinkFonte('');
            setTipoFonte('COTACAO_FORNECEDOR');
            setDataColeta(new Date().toISOString().split('T')[0]);
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';

            addToast({ type: 'success', title: 'Sucesso', description: `Cotação adicionada com ${selectedFiles.length} anexo(s)!` });
            refresh();
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
            addToast({ type: 'error', title: 'Erro', description: `Erro ao adicionar preço: ${errorMsg}` });
        }
    }

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
            addToast({ type: 'error', title: 'Limite de arquivos', description: 'Máximo de 5 arquivos por preço.' });
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }

    async function loadAttachments(precoId: number) {
        if (priceAttachments[precoId]) {
            setExpandedPriceId(expandedPriceId === precoId ? null : precoId);
            return;
        }
        try {
            const res = await api.get(`/uploads?entityType=PRECO&entityId=${precoId}`);
            setPriceAttachments(prev => ({ ...prev, [precoId]: res.data }));
            setExpandedPriceId(precoId);
        } catch {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar anexos' });
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await api.delete(`/precos/${deleteId}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Preço removido com sucesso!' });
            refresh();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao remover preço' });
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    }

    // Edit functions
    function openEditModal(price: Preco) {
        setEditingPrice(price);
        setEditValor(String(price.valor_unitario));
        setEditFonte(price.fonte);
        setEditTipoFonte(price.tipo_fonte);
        setEditLinkFonte(price.link_fonte || '');
        setEditDataColeta(new Date(price.data_coleta).toISOString().split('T')[0]);
    }

    async function handleSaveEdit() {
        if (!editingPrice) return;
        setSaving(true);
        try {
            await api.put(`/precos/${editingPrice.id}`, {
                valor_unitario: Number(editValor),
                fonte: editFonte,
                tipo_fonte: editTipoFonte,
                link_fonte: editLinkFonte || null,
                data_coleta: editDataColeta
            });
            addToast({ type: 'success', title: 'Sucesso', description: 'Preço atualizado com sucesso!' });
            setEditingPrice(null);
            refresh();
        } catch (err: any) {
            addToast({ type: 'error', title: 'Erro', description: err.response?.data?.error || 'Erro ao atualizar preço' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando preços..." />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Gerenciar Preços do Item
                    </Typography>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        variant="outlined"
                    >
                        Voltar para Demanda
                    </Button>
                </Box>
                {item && (
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'normal' }}>
                        {item.codigo_item ? `${item.codigo_item} - ` : ''}{item.descricao}
                    </Typography>
                )}
            </Box>

            {/* Prices Table */}
            <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Cotações Cadastradas
                    </Typography>
                </Box>
                {prices.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Nenhuma cotação cadastrada.</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Var.</TableCell>
                                    <TableCell>Fonte</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Tipo</TableCell>
                                    <TableCell>Anexos</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prices.map(p => (
                                    <TableRow key={p.id} hover>
                                        <TableCell sx={{ fontWeight: 'medium' }}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.valor_unitario))}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={p.classificacao} />
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            {p.percentual_variacao ? `${Number(p.percentual_variacao).toFixed(1)}%` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{p.fonte}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(p.data_coleta).toLocaleDateString('pt-BR')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                                            <Chip 
                                                label={TIPO_FONTE_OPTIONS.find(o => o.value === p.tipo_fonte)?.label || p.tipo_fonte}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                startIcon={expandedPriceId === p.id ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                onClick={() => loadAttachments(p.id)}
                                            >
                                                {expandedPriceId === p.id ? 'Ocultar' : 'Ver'}
                                            </Button>
                                            {expandedPriceId === p.id && (
                                                <Box sx={{ mt: 1 }}>
                                                    <AttachmentList entityType="PRECO" entityId={p.id} refreshTrigger={0} />
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Editar">
                                                    <IconButton size="small" onClick={() => openEditModal(p)} color="primary">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton size="small" onClick={() => setDeleteId(p.id)} color="error">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Add Form */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Adicionar Cotação
                </Typography>
                <Box component="form" onSubmit={handleAddPrice}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Valor Unitário (R$)"
                                type="number"
                                fullWidth
                                required
                                value={valor}
                                onChange={e => setValor(e.target.value)}
                                inputProps={{ step: "0.01" }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Data da Coleta"
                                type="date"
                                fullWidth
                                required
                                value={dataColeta}
                                onChange={e => setDataColeta(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FornecedorSelect
                                value={fornecedorId}
                                onChange={handleFornecedorChange}
                                label="Fornecedor (Cadastrado)"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Fonte / Fornecedor (Nome)"
                                fullWidth
                                required
                                value={fonte}
                                onChange={e => setFonte(e.target.value)}
                                disabled={!!fornecedorId}
                                placeholder="Nome da Fonte"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="CNPJ"
                                fullWidth
                                value={cnpj}
                                onChange={e => {
                                    if (fornecedorId) return;
                                    setCnpj(e.target.value);
                                    if (cnpjError) setCnpjError('');
                                }}
                                onBlur={() => {
                                    if (!fornecedorId && cnpj && cnpj.replace(/[^\d]/g, '').length > 0) {
                                        if (!validateCNPJ(cnpj)) {
                                            setCnpjError('CNPJ inválido');
                                        } else {
                                            setCnpjError('');
                                            setCnpj(formatCNPJ(cnpj));
                                        }
                                    }
                                }}
                                disabled={!!fornecedorId}
                                error={!!cnpjError || (!!cnpj && !validateCNPJ(cnpj) && !fornecedorId)}
                                helperText={cnpjError}
                                InputProps={{
                                    endAdornment: cnpj && (
                                        <Box component="span" sx={{ fontSize: '1.2rem' }}>
                                            {validateCNPJ(cnpj) ? '✅' : cnpj.replace(/[^\d]/g, '').length >= 14 ? '❌' : ''}
                                        </Box>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                label="Link do Edital / Fonte Pública"
                                fullWidth
                                type="url"
                                value={linkFonte}
                                onChange={e => setLinkFonte(e.target.value)}
                                placeholder="https://exemplo.gov.br/edital/123"
                            />
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Anexos (Opcional)
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
                                >
                                    Selecionar Arquivos
                                </Button>
                                {selectedFiles.length === 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                        Nenhum arquivo selecionado
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
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>

                        <Grid size={12} sx={{ display: 'flex', justifySelf: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                size="large"
                            >
                                Adicionar Cotação
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteId !== null}
                title="Remover Cotação"
                message="Tem certeza que deseja remover esta cotação? Esta ação não pode ser desfeita."
                confirmText="Remover"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* Edit Modal */}
            <Dialog open={!!editingPrice} onClose={() => setEditingPrice(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Cotação</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Valor Unitário (R$)"
                            type="number"
                            fullWidth
                            value={editValor}
                            onChange={e => setEditValor(e.target.value)}
                            inputProps={{ step: "0.01" }}
                        />
                        <TextField
                            label="Fonte"
                            fullWidth
                            value={editFonte}
                            onChange={e => setEditFonte(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Fonte</InputLabel>
                            <Select
                                value={editTipoFonte}
                                label="Tipo de Fonte"
                                onChange={e => setEditTipoFonte(e.target.value as TipoFonte)}
                            >
                                {TIPO_FONTE_OPTIONS.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Link do Edital"
                            fullWidth
                            type="url"
                            value={editLinkFonte}
                            onChange={e => setEditLinkFonte(e.target.value)}
                        />
                        <TextField
                            label="Data da Coleta"
                            type="date"
                            fullWidth
                            value={editDataColeta}
                            onChange={e => setEditDataColeta(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingPrice(null)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
