import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import type { Fornecedor } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export function FornecedorList() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            loadFornecedores();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, showOnlyActive]);

    async function loadFornecedores() {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (showOnlyActive) queryParams.append('ativo', 'true');

            const response = await api.get(`/fornecedores?${queryParams.toString()}`);
            setFornecedores(response.data);
        } catch (error) {
            console.error('Erro ao carregar fornecedores', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar lista de fornecedores' });
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(id: number) {
        try {
            await api.patch(`/fornecedores/${id}/toggle-status`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Status atualizado com sucesso' });
            loadFornecedores();
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao atualizar status' });
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'razao_social',
            headerName: 'Razão Social / Fantasia',
            flex: 2,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight="medium">
                        {params.row.razao_social}
                    </Typography>
                    {params.row.nome_fantasia && (
                        <Typography variant="caption" color="text.secondary">
                            {params.row.nome_fantasia}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'cnpj',
            headerName: 'CNPJ',
            width: 150
        },
        {
            field: 'contato',
            headerName: 'Contato',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2">
                        {params.row.responsavel_legal}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        {params.row.email_contato}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        {params.row.telefone_contato}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'ativo',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.value ? 'success.main' : 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    {params.value ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                    <Typography variant="body2">
                        {params.value ? 'Ativo' : 'Inativo'}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Editar"
                    onClick={() => navigate(`/fornecedores/${params.id}`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={params.row.ativo ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
                    label={params.row.ativo ? 'Desativar' : 'Ativar'}
                    onClick={() => handleToggleStatus(Number(params.id))}
                    showInMenu={false}
                />
            ]
        }
    ];

    if (loading && fornecedores.length === 0) return <LoadingOverlay message="Carregando fornecedores..." />;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Fornecedores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/fornecedores/novo')}
                >
                    Novo Fornecedor
                </Button>
            </Box>

            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por Razão Social, CNPJ ou Nome Fantasia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showOnlyActive}
                                onChange={(e) => setShowOnlyActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Apenas Ativos"
                        sx={{ whiteSpace: 'nowrap' }}
                    />
                </Box>
            </Card>

            {fornecedores.length === 0 && !searchTerm && showOnlyActive ? (
                <EmptyState
                    title="Nenhum fornecedor encontrado"
                    description="Comece cadastrando seu primeiro fornecedor."
                    action={{
                        label: 'Novo Fornecedor',
                        onClick: () => navigate('/fornecedores/novo')
                    }}
                />
            ) : (
                <Card sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={fornecedores}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },
                        }}
                        getRowHeight={() => 'auto'}
                    />
                </Card>
            )}
        </Box>
    );
}
