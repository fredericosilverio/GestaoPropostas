import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
import type { GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  ListAlt as ListAltIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import type { Pca } from '../../types/api';

const SITUACOES = [
    { value: 'EM_ELABORACAO', label: 'Em Elaboração' },
    { value: 'APROVADO', label: 'Aprovado' },
    { value: 'EM_EXECUCAO', label: 'Em Execução' },
    { value: 'ENCERRADO', label: 'Encerrado' },
    { value: 'CANCELADO', label: 'Cancelado' }
];

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

export function PcaList() {
    const [pcas, setPcas] = useState<Pca[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const canCreate = user?.perfil === 'ADMIN' || user?.perfil === 'GESTOR';

    // Filters
    const [filterAno, setFilterAno] = useState<number | ''>('');
    const [filterSituacao, setFilterSituacao] = useState('');

    useEffect(() => {
        loadPcas();
    }, [filterAno, filterSituacao]);

    async function loadPcas() {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterAno) params.append('ano', String(filterAno));
            if (filterSituacao) params.append('situacao', filterSituacao);

            const response = await api.get(`/pcas?${params.toString()}`);
            setPcas(response.data);
        } catch (error) {
            console.error('Erro ao carregar PCAs', error);
        } finally {
            setLoading(false);
        }
    }

    // Generate year options (current year + 2 years, previous 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear + 2 - i);

    const columns: GridColDef[] = [
        {
            field: 'numero_pca',
            headerName: 'Número',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <Typography variant="body2" component="span" fontWeight="medium" color="primary">
                        {params.value}
                    </Typography>
                    <Typography variant="caption" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        ({params.row.ano})
                    </Typography>
                </Box>
            )
        },
        {
            field: 'orgao',
            headerName: 'Órgão',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'situacao',
            headerName: 'Situação',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <StatusBadge status={params.value as string} />
            )
        },
        {
            field: 'versao',
            headerName: 'Versão',
            width: 100,
            valueFormatter: (value: number) => `v${value}`
        },
        {
            field: 'demandas_count',
            headerName: 'Demandas',
            width: 120,
            valueGetter: (_, row: Pca) => row._count?.demandas || 0
        },
        {
            field: 'responsavel',
            headerName: 'Responsável',
            width: 200,
            valueGetter: (_, row: Pca) => row.responsavel?.nome_completo || ''
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 120,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="Visualizar"
                    onClick={() => navigate(`/pcas/${params.id}`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={<ListAltIcon />}
                    label="Demandas"
                    onClick={() => navigate(`/demandas?pca_id=${params.id}`)}
                    showInMenu={false}
                />
            ]
        }
    ];

    if (loading && pcas.length === 0) return <LoadingOverlay message="Carregando PCAs..." />;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Planos de Contratação Anual
                </Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/pcas/new')}
                    >
                        Novo PCA
                    </Button>
                )}
            </Box>

            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Ano</InputLabel>
                        <Select
                            value={filterAno}
                            label="Ano"
                            onChange={(e) => setFilterAno(e.target.value ? Number(e.target.value) : '')}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {yearOptions.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Situação</InputLabel>
                        <Select
                            value={filterSituacao}
                            label="Situação"
                            onChange={(e) => setFilterSituacao(e.target.value)}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {SITUACOES.map(s => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {(filterAno || filterSituacao) && (
                        <Button
                            startIcon={<ClearIcon />}
                            onClick={() => { setFilterAno(''); setFilterSituacao(''); }}
                            color="inherit"
                        >
                            Limpar filtros
                        </Button>
                    )}
                </Box>
            </Card>

            {pcas.length === 0 ? (
                <EmptyState
                    icon={<ListAltIcon fontSize="inherit" />}
                    title="Nenhum PCA encontrado"
                    description={canCreate ? "Comece criando seu primeiro Plano de Contratação Anual." : "Nenhum PCA disponível no momento."}
                    action={canCreate ? {
                        label: 'Novo PCA',
                        onClick: () => navigate('/pcas/new')
                    } : undefined}
                />
            ) : (
                <Card sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={pcas}
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
