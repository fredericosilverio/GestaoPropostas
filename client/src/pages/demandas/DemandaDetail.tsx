import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    AttachMoney as AttachMoneyIcon,
    NoteAdd as NoteAddIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { InitiateContractingModal, FinalizeContractModal } from './ContractingModals';
import { FileUploader } from '../../components/FileUploader';
import { AttachmentList } from '../../components/AttachmentList';
import { StatusTimeline } from '../../components/StatusTimeline';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';

interface Item {
    id: number;
    codigo_item: number;
    descricao: string;
    unidade_medida: string;
    quantidade: number;
    valor_estimado_unitario: number;
    valor_estimado_total: number;
    observacoes?: string;
    _count: {
        precos: number;
    };
}

interface DemandaDetailType {
    id: number;
    codigo_demanda: string;
    descricao: string;
    status: string;
    pca?: {
        ano: number;
        orgao: string;
        numero_pca: string;
        versao: number;
    };
    valor_estimado_global?: number;
    observacoes?: string;
    itens: Item[];
}

export function DemandaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [demanda, setDemanda] = useState<DemandaDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInitiateModal, setShowInitiateModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [refreshAnexos, setRefreshAnexos] = useState(0);

    // Observations editing state
    const [editingObsItemId, setEditingObsItemId] = useState<number | null>(null);
    const [obsText, setObsText] = useState('');
    const [savingObs, setSavingObs] = useState(false);

    // General observations state
    const [editingGeneralObs, setEditingGeneralObs] = useState(false);
    const [generalObsText, setGeneralObsText] = useState('');
    const [savingGeneralObs, setSavingGeneralObs] = useState(false);

    useEffect(() => {
        loadDemanda();
    }, [id]);

    async function loadDemanda() {
        try {
            const response = await api.get(`/demandas/${id}`);
            const itemsResponse = await api.get(`/itens?demanda_id=${id}`);

            setDemanda({
                ...response.data,
                itens: itemsResponse.data
            });
        } catch (error) {
            console.error('Erro ao carregar demanda', error);
        } finally {
            setLoading(false);
        }
    }

    function startEditObs(item: Item) {
        setEditingObsItemId(item.id);
        setObsText(item.observacoes || '');
    }

    async function saveObservations(itemId: number) {
        setSavingObs(true);
        try {
            await api.put(`/itens/${itemId}`, { observacoes: obsText });
            addToast({ type: 'success', title: 'Sucesso', description: 'Observações salvas!' });
            setEditingObsItemId(null);
            loadDemanda();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao salvar observações' });
        } finally {
            setSavingObs(false);
        }
    }

    async function saveGeneralObs() {
        setSavingGeneralObs(true);
        try {
            await api.put(`/demandas/${id}`, { observacoes: generalObsText });
            addToast({ type: 'success', title: 'Sucesso', description: 'Observações gerais salvas!' });
            setEditingGeneralObs(false);
            loadDemanda();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao salvar observações gerais' });
        } finally {
            setSavingGeneralObs(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando detalhes da demanda..." />;
    if (!demanda) return <Box p={3}><Typography>Demanda não encontrada</Typography></Box>;

    const formattedValorEstimado = demanda.valor_estimado_global
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(demanda.valor_estimado_global))
        : 'Não informado';

    return (
        <Box sx={{ pb: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                            {demanda.codigo_demanda}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {demanda.descricao}
                        </Typography>
                        {demanda.pca && (
                            <Typography variant="caption" display="block" color="text.disabled">
                                PCA: {demanda.pca.numero_pca}/{demanda.pca.ano} (v{demanda.pca.versao})
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Valor Estimado Global: <strong>{formattedValorEstimado}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip 
                            label={demanda.status} 
                            color="primary" 
                            variant="outlined" 
                            sx={{ fontWeight: 'bold' }} 
                        />
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/demandas/${id}/edit`)}
                            size="small"
                        >
                            Editar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DescriptionIcon />}
                            onClick={() => navigate(`/reports/market-analysis/${id}`)}
                            size="small"
                        >
                            Relatório
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AssignmentIcon />}
                            onClick={() => navigate(`/demandas/${id}/proposta-lote`)}
                            size="small"
                        >
                            Lançar Proposta
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Status Timeline */}
            <Box sx={{ mb: 3 }}>
                <StatusTimeline demandaId={Number(id)} />
            </Box>

            {/* Items List */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Itens da Demanda ({demanda.itens.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`/demandas/${id}/itens/novo`)}
                            size="small"
                        >
                            Novo Item
                        </Button>
                        {demanda.status === 'RASCUNHO' && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => setShowInitiateModal(true)}
                                size="small"
                            >
                                Publicar Demanda
                            </Button>
                        )}
                    </Box>
                </Box>

                <TableContainer variant="outlined" component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>Item</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Unid.</TableCell>
                                <TableCell>Qtd.</TableCell>
                                <TableCell>Valor Unit. (Est.)</TableCell>
                                <TableCell align="center">Cotações</TableCell>
                                <TableCell align="center">Obs.</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {demanda.itens.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.codigo_item}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2">{item.descricao}</Typography>
                                        {item.observacoes && editingObsItemId !== item.id && (
                                            <Paper 
                                                elevation={0} 
                                                sx={{ 
                                                    mt: 1, 
                                                    p: 0.5, 
                                                    px: 1, 
                                                    bgcolor: 'warning.light', 
                                                    color: 'warning.contrastText',
                                                    display: 'inline-block',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                📝 {item.observacoes}
                                            </Paper>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.unidade_medida}</TableCell>
                                    <TableCell>{Number(item.quantidade)}</TableCell>
                                    <TableCell>
                                        {item.valor_estimado_unitario ?
                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.valor_estimado_unitario)) : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={item._count?.precos || 0} size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Editar observações de mercado">
                                            <IconButton
                                                onClick={() => startEditObs(item)}
                                                size="small"
                                                color={item.observacoes ? "warning" : "default"}
                                            >
                                                {item.observacoes ? <EditIcon fontSize="small" /> : <NoteAddIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => navigate(`/demandas/${id}/itens/${item.id}/edit`)}
                                                title="Editar Item"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<AttachMoneyIcon />}
                                                onClick={() => navigate(`/itens/${item.id}/precos`)}
                                            >
                                                Preços
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Observações Gerais da Análise */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        📋 Observações Gerais da Análise de Mercado
                    </Typography>
                    {!editingGeneralObs && (
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => {
                                setEditingGeneralObs(true);
                                setGeneralObsText(demanda.observacoes || '');
                            }}
                            size="small"
                        >
                            Editar
                        </Button>
                    )}
                </Box>
                {editingGeneralObs ? (
                    <Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={generalObsText}
                            onChange={e => setGeneralObsText(e.target.value)}
                            placeholder="Registre aqui observações gerais sobre a análise de mercado, metodologia aplicada, particularidades, ressalvas ou recomendações..."
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                onClick={() => setEditingGeneralObs(false)}
                                color="inherit"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={saveGeneralObs}
                                disabled={savingGeneralObs}
                            >
                                {savingGeneralObs ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        {demanda.observacoes ? (
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'warning.light', borderColor: 'warning.main', color: 'warning.contrastText' }}>
                                <Typography variant="body2" whiteSpace="pre-wrap">
                                    {demanda.observacoes}
                                </Typography>
                            </Paper>
                        ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                Nenhuma observação geral registrada. Clique em "Editar" para adicionar.
                            </Typography>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Anexos */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📎 Anexos da Demanda
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        (inclui anexos de cotações)
                    </Typography>
                </Typography>
                <FileUploader
                    entityType="DEMANDA"
                    entityId={Number(id)}
                    onUploadSuccess={() => setRefreshAnexos(prev => prev + 1)}
                />
                <Box sx={{ mt: 2 }}>
                    <AttachmentList
                        entityType="DEMANDA"
                        entityId={Number(id)}
                        refreshTrigger={refreshAnexos}
                        consolidate={true}
                    />
                </Box>
            </Paper>

            {/* Edit Observations Modal */}
            <Dialog open={!!editingObsItemId} onClose={() => setEditingObsItemId(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Observações de Análise de Mercado</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Registre particularidades ou observações relevantes que serão incluídas no relatório.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="obs"
                        label="Observações"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={obsText}
                        onChange={(e) => setObsText(e.target.value)}
                        placeholder="Ex: Preço do fornecedor X desconsiderado por estar fora da validade. Mediana utilizada como referência devido à alta dispersão."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingObsItemId(null)} color="inherit">Cancelar</Button>
                    <Button onClick={() => editingObsItemId && saveObservations(editingObsItemId)} variant="contained" disabled={savingObs}>
                        {savingObs ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modals */}
            {demanda && (
                <>
                    <InitiateContractingModal
                        isOpen={showInitiateModal}
                        onClose={() => setShowInitiateModal(false)}
                        onSuccess={loadDemanda}
                        demandaId={demanda.id}
                    />
                    <FinalizeContractModal
                        isOpen={showFinalizeModal}
                        onClose={() => setShowFinalizeModal(false)}
                        onSuccess={loadDemanda}
                        demandaId={demanda.id}
                    />
                </>
            )}
        </Box>
    );
}
