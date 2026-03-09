import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Typography,
    Tooltip,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Warning as WarningIcon,
    FileDownload as ReportIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { format, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';

export function ContatoList() {
    const [contatos, setContatos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [contatoToDelete, setContatoToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const { addToast } = useToast();

    // Specific filters from URL
    const pcaIdFilter = searchParams.get('pca_id');
    const demandaIdFilter = searchParams.get('demanda_id');
    const fornecedorIdFilter = searchParams.get('fornecedor_id');

    useEffect(() => {
        const timer = setTimeout(() => {
            loadContatos();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, pcaIdFilter, demandaIdFilter, fornecedorIdFilter]);

    async function loadContatos() {
        setLoading(true);
        try {
            const params: any = {};
            if (searchTerm) params.q = searchTerm;
            if (pcaIdFilter) params.pca_id = pcaIdFilter;
            if (demandaIdFilter) params.demanda_id = demandaIdFilter;
            if (fornecedorIdFilter) params.fornecedor_id = fornecedorIdFilter;

            const response = await api.get('/contatos', { params });
            setContatos(response.data);
        } catch (error) {
            console.error('Erro ao carregar contatos', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar lista de contatos' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!contatoToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/contatos/${contatoToDelete.id}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Registro de contato excluído com sucesso' });
            setContatoToDelete(null);
            loadContatos();
        } catch (error) {
            console.error('Erro ao excluir contato', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao excluir registro de contato' });
        } finally {
            setIsDeleting(false);
        }
    }

    const handleClearFilter = () => {
        setSearchParams({});
        setSearchTerm('');
    };

    const columns: GridColDef[] = [
        {
            field: 'data_hora',
            headerName: 'Data/Hora',
            width: 160,
            renderCell: (params) => {
                const isDelayed = differenceInHours(new Date(params.row.created_at), new Date(params.value)) > 24;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                            {format(new Date(params.value), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </Typography>
                        {isDelayed && (
                            <Tooltip title="Registro com atraso (> 24h)">
                                <WarningIcon color="warning" fontSize="small" />
                            </Tooltip>
                        )}
                    </Box>
                )
            }
        },
        {
            field: 'fornecedor',
            headerName: 'Fornecedor',
            flex: 1.5,
            minWidth: 200,
            valueGetter: (_, row) => row.fornecedor?.razao_social || 'N/A'
        },
        {
            field: 'demanda',
            headerName: 'Demanda / PCA',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => {
                const d = params.row.demanda;
                const p = params.row.pca;
                if (!d && !p) return <Typography variant="caption" color="text.secondary">Sem vínculo</Typography>;
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" noWrap>{d ? d.codigo_demanda : 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {p ? `PCA ${p.ano} - ${p.numero_pca}` : ''}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'pauta',
            headerName: 'Resumo / Pauta',
            flex: 2,
            minWidth: 250,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Visualizar/Editar"
                    onClick={() => navigate(`/contatos/${params.id}`)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Excluir"
                    onClick={() => setContatoToDelete(params.row)}
                />
            ]
        }
    ];

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Contatos com Fornecedores
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ReportIcon />}
                        onClick={() => navigate('/relatorio-contatos')}
                    >
                        Relatório
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/contatos/new')}
                    >
                        Novo Contato
                    </Button>
                </Box>
            </Box>

            <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Pesquisar por fornecedor, CNPJ, pauta ou demanda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <Button size="small" onClick={() => setSearchTerm('')}>Limpar</Button>
                                </InputAdornment>
                            )
                        }}
                        size="small"
                        sx={{ flex: 1, minWidth: 300 }}
                    />

                    {(pcaIdFilter || demandaIdFilter || fornecedorIdFilter) && (
                        <Chip
                            label="Filtro de contexto ativo"
                            onDelete={handleClearFilter}
                            color="primary"
                            variant="outlined"
                            icon={<ClearIcon />}
                        />
                    )}
                </Box>
            </Card>

            <Card sx={{ flexGrow: 1, height: 600, width: '100%' }}>
                {loading && <LoadingOverlay message="Carregando contatos..." />}
                <DataGrid
                    rows={contatos}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 12 } },
                    }}
                    pageSizeOptions={[12, 25, 50]}
                    disableRowSelectionOnClick
                    density="comfortable"
                />
            </Card>

            {/* Diálogo de Confirmação de Exclusão */}
            <Dialog open={!!contatoToDelete} onClose={() => setContatoToDelete(null)}>
                <DialogTitle>Excluir Registro de Contato</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o registro de contato com o fornecedor <strong>{contatoToDelete?.fornecedor?.razao_social}</strong> realizado em {contatoToDelete && format(new Date(contatoToDelete.data_hora), "dd/MM/yyyy HH:mm")}?
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
        </Box>
    );
}
