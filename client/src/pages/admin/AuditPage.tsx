import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Tooltip
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import type { AuditLog, PaginatedResponse } from '../../types/api';
import { Policy as PolicyIcon } from '@mui/icons-material';

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

export function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 20,
    });

    useEffect(() => {
        fetchLogs();
    }, [paginationModel]);

    async function fetchLogs() {
        setLoading(true);
        try {
            // API uses 1-based page index
            const page = paginationModel.page + 1;
            const limit = paginationModel.pageSize;
            const response = await api.get<PaginatedResponse<AuditLog>>(`/audit?page=${page}&limit=${limit}`);
            setLogs(response.data.data);
            setRowCount(response.data.total); 
        } catch (error) {
            console.error('Erro ao carregar logs', error);
        } finally {
            setLoading(false);
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'data_hora',
            headerName: 'Data/Hora',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString('pt-BR')
        },
        {
            field: 'usuario',
            headerName: 'Usuário',
            width: 250,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight="medium">
                        {params.value?.nome_completo || 'Sistema'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.value?.email}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'acao',
            headerName: 'Ação',
            width: 150,
            renderCell: (params) => (
                <StatusBadge status={params.value as string} />
            )
        },
        {
            field: 'entidade',
            headerName: 'Entidade',
            width: 200,
            valueGetter: (_value, row) => `${row.entidade_tipo} #${row.entidade_id}`
        },
        {
            field: 'descricao',
            headerName: 'Descrição',
            flex: 1,
            minWidth: 300,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography variant="body2" noWrap>
                        {params.value}
                    </Typography>
                </Tooltip>
            )
        }
    ];

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Trilha de Auditoria
                </Typography>
            </Box>

            {logs.length === 0 && !loading ? (
                <EmptyState
                    icon={<PolicyIcon fontSize="inherit" />}
                    title="Nenhum log de auditoria encontrado"
                    description="Não há registros de atividades no momento."
                />
            ) : (
                <Card sx={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={logs}
                        columns={columns}
                        rowCount={rowCount}
                        loading={loading}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[20, 50, 100]}
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
