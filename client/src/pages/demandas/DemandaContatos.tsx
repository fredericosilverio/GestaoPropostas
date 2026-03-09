import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContactPhone as ContactPhoneIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { format, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';

interface DemandaContatosProps {
    demandaId: number;
    pcaId?: number;
}

export function DemandaContatos({ demandaId, pcaId }: DemandaContatosProps) {
    const [contatos, setContatos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [contatoToDelete, setContatoToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        loadContatos();
    }, [demandaId]);

    async function loadContatos() {
        setLoading(true);
        try {
            const response = await api.get('/contatos', { 
                params: { demanda_id: demandaId } 
            });
            setContatos(response.data);
        } catch (error) {
            console.error('Erro ao carregar contatos da demanda', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar interações com fornecedores' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!contatoToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/contatos/${contatoToDelete.id}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Interação excluída com sucesso' });
            setContatoToDelete(null);
            loadContatos();
        } catch (error) {
            console.error('Erro ao excluir contato', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao excluir interação' });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, position: 'relative' }}>
            {loading && <LoadingOverlay message="Carregando interações..." />}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactPhoneIcon color="primary" />
                    Interações e Contatos com Fornecedores ({contatos.length})
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/contatos/new?demandaId=${demandaId}${pcaId ? `&pcaId=${pcaId}` : ''}`)}
                    size="small"
                >
                    Nova Interação
                </Button>
            </Box>

            {contatos.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Nenhuma interação registrada para esta demanda até o momento.
                    </Typography>
                </Box>
            ) : (
                <TableContainer variant="outlined" component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>Data/Hora</TableCell>
                                <TableCell>Fornecedor</TableCell>
                                <TableCell>Tipo / Meio</TableCell>
                                <TableCell>Pauta / Assunto</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contatos.map((contato) => {
                                const isDelayed = differenceInHours(new Date(contato.created_at), new Date(contato.data_hora)) > 24;
                                return (
                                    <TableRow key={contato.id} hover>
                                        <TableCell sx={{ minWidth: 140 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {format(new Date(contato.data_hora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                {isDelayed && (
                                                    <Tooltip title="Registro com atraso (> 24h)">
                                                        <WarningIcon color="warning" sx={{ fontSize: 16 }} />
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {contato.fornecedor?.nome_fantasia || contato.fornecedor?.razao_social}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {contato.representante?.nome || 'Sem representante'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={contato.tipo_contato} size="small" variant="outlined" />
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {contato.local_meio}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" noWrap title={contato.pauta}>
                                                {contato.pauta}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => navigate(`/contatos/${contato.id}`)}
                                                    title="Editar/Visualizar"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => setContatoToDelete(contato)}
                                                    title="Excluir"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Diálogo de Confirmação de Exclusão */}
            <Dialog open={!!contatoToDelete} onClose={() => setContatoToDelete(null)}>
                <DialogTitle>Excluir Interação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o registro de contato com o fornecedor <strong>{contatoToDelete?.fornecedor?.razao_social}</strong>?
                        <br /><br />
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContatoToDelete(null)} color="inherit" disabled={isDeleting}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
