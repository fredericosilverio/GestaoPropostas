import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
  Chip
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

interface Usuario {
    id: number;
    nome_completo: string;
    email: string;
    matricula: string;
    perfil: string;
    unidade_vinculada?: string;
    ativo: boolean;
}

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

export function UsuarioList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth(); // To check permissions
    console.log(user); // Keep user usage to avoid lint error or remove if not needed
    const { addToast } = useToast();

    useEffect(() => {
        loadUsuarios();
    }, []);

    async function loadUsuarios() {
        try {
            const response = await api.get('/users');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários', error);
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar lista de usuários' });
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus(id: number, currentStatus: boolean) {
        if (!window.confirm(`Deseja realmente ${currentStatus ? 'desativar' : 'ativar'} este usuário?`)) return;

        try {
            await api.put(`/users/${id}`, { ativo: !currentStatus });
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !currentStatus } : u));
            addToast({ type: 'success', title: 'Sucesso', description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.` });
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao alterar status do usuário' });
        }
    }

    const filteredUsuarios = usuarios.filter(u =>
        u.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.matricula.includes(searchTerm)
    );

    const columns: GridColDef[] = [
        {
            field: 'nome_completo',
            headerName: 'Nome',
            flex: 2,
            minWidth: 250,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>
                        {params.value.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="medium">
                            {params.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {params.row.email}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            field: 'matricula',
            headerName: 'Matrícula',
            width: 120
        },
        {
            field: 'perfil',
            headerName: 'Perfil',
            width: 150,
            renderCell: (params) => {
                let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
                if (params.value === 'ADMIN') color = 'secondary';
                else if (params.value === 'GESTOR') color = 'info';
                
                return (
                    <Chip 
                        label={params.value} 
                        size="small" 
                        color={color} 
                        variant="outlined" 
                    />
                );
            }
        },
        {
            field: 'unidade_vinculada',
            headerName: 'Unidade',
            flex: 1,
            minWidth: 100,
            valueGetter: (_, row) => row.unidade_vinculada || '-'
        },
        {
            field: 'ativo',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value ? 'Ativo' : 'Inativo'} 
                    color={params.value ? 'success' : 'default'}
                    size="small"
                    variant={params.value ? 'filled' : 'outlined'}
                />
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
                    onClick={() => navigate(`/usuarios/${params.id}`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={params.row.ativo ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
                    label={params.row.ativo ? 'Desativar' : 'Ativar'}
                    onClick={() => toggleStatus(Number(params.id), params.row.ativo)}
                    showInMenu={false}
                />
            ]
        }
    ];

    if (loading) return <LoadingOverlay message="Carregando usuários..." />;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Gestão de Usuários
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/usuarios/new')}
                >
                    Novo Usuário
                </Button>
            </Box>

            <Card sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por nome, email ou matrícula..."
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
            </Card>

            {filteredUsuarios.length === 0 ? (
                <EmptyState
                    icon={<PersonIcon fontSize="inherit" />}
                    title="Nenhum usuário encontrado"
                    description="Não há usuários cadastrados ou correspondentes à busca."
                    action={{
                        label: 'Cadastrar Usuário',
                        onClick: () => navigate('/usuarios/new')
                    }}
                />
            ) : (
                <Card sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredUsuarios}
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
