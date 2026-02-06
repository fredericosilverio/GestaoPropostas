import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  InputAdornment,
  Chip,
  IconButton
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
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import type { Demanda } from '../../types/api';

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

export function DemandaList() {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pcaIdFilter = searchParams.get('pca_id');

  useEffect(() => {
    loadDemandas();
  }, [pcaIdFilter]);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDemandas(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  async function loadDemandas(query: string = '') {
    try {
      const params: any = {};
      if (query) params.q = query;
      if (pcaIdFilter) params.pca_id = pcaIdFilter;

      const response = await api.get('/demandas', { params });
      setDemandas(response.data);
    } catch (error) {
      console.error('Erro ao carregar Demandas', error);
    } finally {
      setLoading(false);
    }
  }

  const handleClearFilter = () => {
    setSearchParams({});
  };

  const columns: GridColDef[] = [
    { 
      field: 'codigo_demanda', 
      headerName: 'Código', 
      width: 150,
      flex: 1,
      minWidth: 120
    },
    {
      field: 'pca',
      headerName: 'PCA',
      width: 150,
      valueGetter: (_, row: Demanda) => {
          if (!row.pca) return '';
          return `${row.pca.ano} - ${row.pca.orgao}`;
      }
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 2,
      minWidth: 200
    },
    {
      field: 'valor_estimado_global',
      headerName: 'Valor Estimado',
      width: 150,
      type: 'number',
      valueFormatter: (value: number) => {
        if (!value) return '';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <StatusBadge status={params.value as string} />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Visualizar"
          onClick={() => navigate(`/demandas/${params.id}`)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(`/demandas/${params.id}/edit`)}
          showInMenu={false}
        />
      ]
    }
  ];

  if (loading) return <LoadingOverlay message="Carregando demandas..." />;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Demandas de Contratação
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/demandas/new')}
        >
          Nova Demanda
        </Button>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar demandas..."
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
            sx={{ flex: 1 }}
          />
          
          {pcaIdFilter && (
             <Chip
               label={`Filtrado por PCA ID: ${pcaIdFilter}`}
               onDelete={handleClearFilter}
               color="primary"
               variant="outlined"
             />
          )}
        </Box>
      </Card>

      {demandas.length === 0 && !searchTerm ? (
        <EmptyState
          title="Nenhuma demanda encontrada"
          description="Comece criando sua primeira demanda de contratação."
          action={{
            label: 'Nova Demanda',
            onClick: () => navigate('/demandas/new')
          }}
        />
      ) : (
        <Card sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={demandas}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
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
          />
        </Card>
      )}
    </Box>
  );
}
