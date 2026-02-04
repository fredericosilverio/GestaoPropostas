import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { PcaSummary } from '../../components/pca/PcaSummary';
import type { Pca, Demanda } from '../../types/api';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    Grid, 
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface PcaWithDetails extends Pca {
    demandas: (Demanda & { _count?: { itens: number } })[];
    versao_anterior?: { id: number; versao: number; data_criacao: string };
    responsavel_consolidacao?: { id: number; nome_completo: string; email?: string };
}

interface PcaVersion {
    id: number;
    versao: number;
    situacao: string;
    data_criacao: string;
    motivo_versao?: string;
    responsavel: { id: number; nome_completo: string };
}

const STATUS_LABELS: Record<string, { label: string; nextStatus?: string; nextLabel?: string }> = {
    'EM_ELABORACAO': { label: 'Em Elaboração', nextStatus: 'APROVADO', nextLabel: 'Aprovar' },
    'EM_ANALISE': { label: 'Em Análise', nextStatus: 'APROVADO', nextLabel: 'Aprovar' },
    'APROVADO': { label: 'Aprovado', nextStatus: 'EM_EXECUCAO', nextLabel: 'Iniciar Execução' },
    'EM_EXECUCAO': { label: 'Em Execução', nextStatus: 'ENCERRADO', nextLabel: 'Encerrar' },
    'REVISADO': { label: 'Revisado', nextStatus: 'APROVADO', nextLabel: 'Reaprovar' },
    'ENCERRADO': { label: 'Encerrado' },
    'CANCELADO': { label: 'Cancelado' }
};

export function PcaDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.perfil === 'ADMIN' || user?.perfil === 'GESTOR';

    const [pca, setPca] = useState<PcaWithDetails | null>(null);
    const [versions, setVersions] = useState<PcaVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Form states
    const [justificativa, setJustificativa] = useState('');
    const [motivo, setMotivo] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadPca();
        loadVersions();
    }, [id]);

    async function loadPca() {
        try {
            setLoading(true);
            const response = await api.get(`/pcas/${id}`);
            setPca(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao carregar PCA');
        } finally {
            setLoading(false);
        }
    }

    async function loadVersions() {
        try {
            const response = await api.get(`/pcas/${id}/versions`);
            setVersions(response.data);
        } catch (err) {
            console.error('Erro ao carregar versões', err);
        }
    }

    async function handleChangeStatus(newStatus: string) {
        try {
            setActionLoading(true);
            await api.patch(`/pcas/${id}/status`, {
                situacao: newStatus,
                justificativa: justificativa || undefined
            });
            setShowStatusModal(false);
            setShowCancelModal(false);
            setJustificativa('');
            await loadPca();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao alterar status');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCreateVersion() {
        try {
            setActionLoading(true);
            const response = await api.post(`/pcas/${id}/version`, { motivo });
            setShowVersionModal(false);
            setMotivo('');
            navigate(`/pcas/${response.data.pca.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar nova versão');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete() {
        try {
            setActionLoading(true);
            await api.delete(`/pcas/${id}`, {
                data: { justificativa }
            });
            setShowDeleteModal(false);
            navigate('/pcas');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao excluir PCA');
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando PCA..." />;
    if (error && !pca) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={() => navigate('/pcas')}>
                        Voltar para lista
                    </Button>
                }>
                    {error}
                </Alert>
            </Container>
        );
    }
    if (!pca) return null;

    const isReadOnly = pca.situacao === 'ENCERRADO' || pca.situacao === 'CANCELADO';
    const statusInfo = STATUS_LABELS[pca.situacao] || { label: pca.situacao };
    const totalDemandas = pca.demandas?.length || 0;


    const DetailItem = ({ label, value, subValue }: { label: string; value: string | undefined | null; subValue?: string }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                {label}
            </Typography>
            <Typography variant="body1" color="text.primary">
                {value || '-'}
            </Typography>
            {subValue && (
                <Typography variant="caption" color="text.secondary" display="block">
                    {subValue}
                </Typography>
            )}
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { sm: 'center' }, 
                gap: 2,
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 1,
                boxShadow: 1
            }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {pca.numero_pca}
                        </Typography>
                        <StatusBadge status={pca.situacao} />
                        {pca.versao > 1 && (
                            <Chip 
                                label={`v${pca.versao}`} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                            />
                        )}
                    </Box>
                    {pca.denominacao && (
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {pca.denominacao}
                        </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                        {pca.orgao} • Ano {pca.ano}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/pcas')}
                        variant="outlined"
                        color="inherit"
                    >
                        Voltar
                    </Button>
                    {canEdit && !isReadOnly && (
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/pcas/${id}/edit`)}
                            variant="contained"
                            color="primary"
                        >
                            Editar
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Stats Overview */}
            <Box sx={{ mb: 4 }}>
                <PcaSummary pcaId={pca.id} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">Vigência</Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {pca.periodo_vigencia_inicio ? new Date(pca.periodo_vigencia_inicio).toLocaleDateString('pt-BR') : '-'}
                            {' até '}
                            {pca.periodo_vigencia_fim ? new Date(pca.periodo_vigencia_fim).toLocaleDateString('pt-BR') : '-'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">Última Atualização</Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {new Date(pca.updated_at).toLocaleDateString('pt-BR')}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Left Column: Details */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Grid container spacing={3}>
                        {/* Vinculação Institucional */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span" role="img" aria-label="institucional">🏛️</Box> Vinculação Institucional
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <DetailItem label="Unidade Demandante" value={pca.unidade_demandante} />
                                    <DetailItem label="Área Técnica" value={pca.area_tecnica} />
                                    <DetailItem label="Órgão" value={pca.orgao} />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Responsáveis */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span" role="img" aria-label="responsaveis">👤</Box> Responsáveis
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <DetailItem
                                        label="Elaboração"
                                        value={pca.responsavel?.nome_completo}
                                        subValue={pca.responsavel?.email}
                                    />
                                    <DetailItem
                                        label="Consolidação / Gestão"
                                        value={pca.responsavel_consolidacao?.nome_completo}
                                        subValue={pca.responsavel_consolidacao?.email}
                                    />
                                    {(pca.contato_email || pca.contato_telefone) && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" gutterBottom>
                                                Contatos Adicionais
                                            </Typography>
                                            {pca.contato_email && (
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    📧 {pca.contato_email}
                                                </Typography>
                                            )}
                                            {pca.contato_telefone && (
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    📞 {pca.contato_telefone}
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Aprovação */}
                        <Grid size={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircleIcon color="success" /> Dados da Aprovação
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                        <DetailItem label="Autoridade" value={pca.autoridade_aprovadora} />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                        <DetailItem label="Cargo" value={pca.cargo_autoridade} />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                        <DetailItem label="Documento" value={pca.documento_aprovacao} />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                        <DetailItem
                                            label="Data Aprovação"
                                            value={pca.data_aprovacao ? new Date(pca.data_aprovacao).toLocaleDateString('pt-BR') : null}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Observações e Histórico */}
                        {(pca.observacoes || pca.historico_alteracoes) && (
                            <Grid size={12}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DescriptionIcon color="action" /> Notas
                                    </Typography>
                                    <Grid container spacing={3} sx={{ mt: 1 }}>
                                        {pca.observacoes && (
                                            <Grid size={12}>
                                                <Typography variant="subtitle2" gutterBottom>Observações Gerais</Typography>
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {pca.observacoes}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        )}
                                        {pca.historico_alteracoes && (
                                            <Grid size={12}>
                                                <Typography variant="subtitle2" gutterBottom>Histórico de Alterações</Typography>
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {pca.historico_alteracoes}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}

                        {/* Actions Card */}
                        {canEdit && !isReadOnly && (
                            <Grid size={12}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Ações do Workflow
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                                        {statusInfo.nextStatus && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => setShowStatusModal(true)}
                                            >
                                                {statusInfo.nextLabel}
                                            </Button>
                                        )}
                                        {(pca.situacao === 'APROVADO' || pca.situacao === 'EM_EXECUCAO') && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<AddIcon />}
                                                onClick={() => setShowVersionModal(true)}
                                            >
                                                Nova Versão
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            startIcon={<PauseCircleIcon />}
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            Cancelar PCA
                                        </Button>
                                        {totalDemandas === 0 && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => setShowDeleteModal(true)}
                                            >
                                                Excluir PCA
                                            </Button>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        )}

                        {/* Demandas Table */}
                        <Grid size={12}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">
                                        Demandas Vinculadas
                                    </Typography>
                                    {canEdit && !isReadOnly && (
                                        <Button
                                            component={Link}
                                            to={`/demandas/new?pca_id=${id}`}
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddIcon />}
                                        >
                                            Nova Demanda
                                        </Button>
                                    )}
                                </Box>
                                {pca.demandas && pca.demandas.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                <TableRow>
                                                    <TableCell>Código</TableCell>
                                                    <TableCell>Descrição</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Itens</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pca.demandas.map((demanda) => (
                                                    <TableRow
                                                        key={demanda.id}
                                                        hover
                                                        onClick={() => navigate(`/demandas/${demanda.id}`)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'medium' }}>
                                                            {demanda.codigo_demanda}
                                                        </TableCell>
                                                        <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {demanda.descricao}
                                                        </TableCell>
                                                        <TableCell>
                                                            <StatusBadge status={demanda.status} />
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'text.secondary' }}>
                                                            {demanda._count?.itens || 0}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        py: 4, 
                                        bgcolor: 'action.hover', 
                                        borderRadius: 1, 
                                        border: 1, 
                                        borderColor: 'divider',
                                        borderStyle: 'dashed'
                                    }}>
                                        <Typography color="text.secondary" gutterBottom>
                                            Nenhuma demanda cadastrada neste PCA.
                                        </Typography>
                                        {canEdit && !isReadOnly && (
                                            <Button
                                                component={Link}
                                                to={`/demandas/new?pca_id=${id}`}
                                                color="primary"
                                            >
                                                Cadastrar primeira demanda
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Column: Versions */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HistoryIcon color="action" /> Histórico de Versões
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            {versions.length > 0 ? (
                                <Box sx={{ position: 'relative', ml: 2, borderLeft: 2, borderColor: 'divider', pl: 3, py: 1 }}>
                                    {versions.map((version) => (
                                        <Paper
                                            key={version.id}
                                            variant="outlined"
                                            sx={{ 
                                                p: 2, 
                                                mb: 2, 
                                                position: 'relative',
                                                borderColor: version.id === Number(id) ? 'primary.main' : 'divider',
                                                bgcolor: version.id === Number(id) ? 'primary.50' : 'background.paper',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: -29,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: 'background.paper',
                                                    border: 2,
                                                    borderColor: version.id === Number(id) ? 'primary.main' : 'divider'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        v{version.versao}.0
                                                    </Typography>
                                                    {version.id === Number(id) && (
                                                        <Chip label="Atual" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                    )}
                                                </Box>
                                                <StatusBadge status={version.situacao} size="small" />
                                            </Box>

                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                                {new Date(version.data_criacao).toLocaleDateString('pt-BR')} às {new Date(version.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>

                                            {version.motivo_versao && (
                                                <Paper variant="outlined" sx={{ p: 1, my: 1, bgcolor: 'action.hover' }}>
                                                    <Typography variant="caption" fontStyle="italic" color="text.secondary">
                                                        "{version.motivo_versao}"
                                                    </Typography>
                                                </Paper>
                                            )}

                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Por: {version.responsavel?.nome_completo}
                                            </Typography>

                                            {version.id !== Number(id) && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => navigate(`/pcas/${version.id}`)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Visualizar Versão
                                                </Button>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>
                            ) : (
                                <Typography color="text.secondary" align="center" fontStyle="italic">
                                    Sem histórico de versões.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modals */}
            <Dialog
                open={showStatusModal}
                onClose={() => { setShowStatusModal(false); setJustificativa(''); }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Alterar Status para "{statusInfo.nextLabel}"</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Confirma a alteração do status do PCA {pca.numero_pca} para <Box component="span" fontWeight="bold">"{statusInfo.nextLabel}"</Box>?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Justificativa (opcional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        placeholder="Insira uma justificativa para esta mudança de status..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowStatusModal(false); setJustificativa(''); }} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={() => statusInfo.nextStatus && handleChangeStatus(statusInfo.nextStatus)}
                        variant="contained" 
                        color="success"
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Processando...' : 'Confirmar Alteração'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showCancelModal}
                onClose={() => { setShowCancelModal(false); setJustificativa(''); }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
                    <WarningIcon /> Cancelar PCA
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Esta ação cancelará o PCA definitivamente.
                        </Typography>
                        O PCA permanecerá no sistema para consulta histórica, mas não poderá receber novas demandas ou alterações.
                    </Alert>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Justificativa (obrigatória)"
                        fullWidth
                        multiline
                        rows={3}
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        placeholder="Informe detalhadamente o motivo do cancelamento..."
                        required
                        error={justificativa.length > 0 && justificativa.length < 10}
                        helperText={justificativa.length > 0 && justificativa.length < 10 ? "Mínimo 10 caracteres" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowCancelModal(false); setJustificativa(''); }} color="inherit">
                        Voltar
                    </Button>
                    <Button 
                        onClick={() => handleChangeStatus('CANCELADO')}
                        variant="contained" 
                        color="warning"
                        disabled={actionLoading || justificativa.length < 10}
                    >
                        {actionLoading ? 'Processando...' : 'Confirmar Cancelamento'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showVersionModal}
                onClose={() => { setShowVersionModal(false); setMotivo(''); }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Criar Nova Versão</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">Como funciona:</Typography>
                        Será criada uma cópia deste PCA (v{pca.versao}) como v{pca.versao + 1}.
                        A nova versão iniciará com status "Em Elaboração" e herdará todas as demandas ativas.
                    </Alert>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Motivo da nova versão (obrigatório)"
                        fullWidth
                        multiline
                        rows={3}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Ex: Ajuste de valores após análise de mercado, Inclusão de novas demandas..."
                        required
                        error={motivo.length > 0 && motivo.length < 10}
                        helperText={motivo.length > 0 && motivo.length < 10 ? "Mínimo 10 caracteres" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowVersionModal(false); setMotivo(''); }} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCreateVersion}
                        variant="contained" 
                        color="secondary"
                        disabled={actionLoading || motivo.length < 10}
                    >
                        {actionLoading ? 'Criando...' : 'Criar Versão v' + (pca.versao + 1)}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setJustificativa(''); }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <DeleteIcon /> Excluir PCA
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Atenção: Ação Irreversível
                        </Typography>
                        Esta ação excluirá permanentemente o PCA e todo seu histórico.
                    </Alert>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Justificativa (opcional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        placeholder="Motivo da exclusão..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowDeleteModal(false); setJustificativa(''); }} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        variant="contained" 
                        color="error"
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Processando...' : 'Confirmar Exclusão'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
