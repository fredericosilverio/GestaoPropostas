import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Button,
  useTheme,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  AccessTime,
  CheckCircle,
  Warning,
  FilterList
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import type { DashboardSummary, DashboardAlert } from '../../types/api';

const STATUS_COLORS: Record<string, string> = {
  'RASCUNHO': '#6b7280',
  'EM_ANALISE': '#f59e0b',
  'ESTIMADA': '#8b5cf6',
  'EM_CONTRATACAO': '#3b82f6',
  'CONTRATADA': '#10b981',
  'SUSPENSA': '#ef4444',
  'CANCELADA': '#991b1b'
};

const STATUS_LABELS: Record<string, string> = {
  'RASCUNHO': 'Rascunho',
  'EM_ANALISE': 'Em Análise',
  'ESTIMADA': 'Estimada',
  'EM_CONTRATACAO': 'Em Contratação',
  'CONTRATADA': 'Contratada',
  'SUSPENSA': 'Suspensa',
  'CANCELADA': 'Cancelada'
};

export function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state (default: current year)
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  
  // Applied filters state (to avoid reloading on every keystroke)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      startDate,
      endDate
    });
  };

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/summary', {
      params: {
        start_date: appliedFilters.startDate,
        end_date: appliedFilters.endDate
      }
    })
      .then(res => setSummary(res.data))
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar dados do dashboard');
      })
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  // If loading initially and no summary, show full loading overlay
  // But if we have summary (re-filtering), show loading indicator over content
  
  const renderContent = () => {
    if (loading && !summary) {
      return <LoadingOverlay message="Carregando dashboard..." />;
    }

    if (error) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
          <Warning color="warning" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">{error}</Typography>
        </Box>
      );
    }

    if (!summary) return null;

    const { stats, alertas } = summary;

    // Pie Chart Data
    const pieData = Object.entries(stats.byStatus)
      .filter(([_, count]) => count > 0)
      .map(([status, count], index) => ({
        id: index,
        value: count,
        label: STATUS_LABELS[status] || status,
        color: STATUS_COLORS[status] || '#6b7280'
      }));

    // Bar Chart Data
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });
    const barData = [
      (stats.byStatus['RASCUNHO'] as number) || 0, 
      (stats.byStatus['ESTIMADA'] as number) || 0, 
      (stats.byStatus['CONTRATADA'] as number) || 0
    ];
    const xLabels = ['Rascunhos', 'Estimadas', 'Contratadas'];

    return (
      <Box sx={{ position: 'relative', opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        {loading && (
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            zIndex={10} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        )}

        {/* KPIs */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="overline">
                      Total Demandas
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.total}
                    </Typography>
                  </Box>
                  <TrendingUp color="primary" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.success.main}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="overline">
                      Valor Estimado
                    </Typography>
                    <Typography variant="h5" component="div" fontWeight="bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValorEstimado)}
                    </Typography>
                  </Box>
                  <AttachMoney color="success" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.warning.main}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="overline">
                      Em Análise
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.byStatus['EM_ANALISE'] || 0}
                    </Typography>
                  </Box>
                  <AccessTime color="warning" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: '100%', borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="overline">
                      Contratadas
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.byStatus['CONTRATADA'] || 0}
                    </Typography>
                  </Box>
                  <CheckCircle color="secondary" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Demandas por Status
              </Typography>
              <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
                {pieData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: { hidden: true } as any
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    Sem dados para exibir
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Evolução Mensal ({currentMonth})
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: xLabels }]}
                  series={[{ data: barData, color: theme.palette.primary.main }]}
                  height={300}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Alerts */}
        <Grid container spacing={3}>
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                  <Warning fontSize="small" /> Alertas de Prazo (Próximos 30 dias)
                </Typography>
                
                {alertas.length === 0 ? (
                   <Typography variant="body2" color="text.secondary" align="center" py={2}>
                      Nenhum alerta de prazo.
                   </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {alertas.map((alerta: DashboardAlert) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={alerta.id}>
                        <Alert 
                          severity="warning" 
                          variant="outlined"
                          action={
                            <Button color="inherit" size="small" onClick={() => navigate(`/demandas/${alerta.id}`)}>
                              VER
                            </Button>
                          }
                          sx={{ alignItems: 'center' }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {alerta.codigo_demanda}
                          </Typography>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {alerta.descricao}
                          </Typography>
                          <Typography variant="caption" display="block" color="error" fontWeight="bold" mt={0.5}>
                             Vence em: {new Date(alerta.data_prevista_contratacao).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Alert>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          Visão Geral
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Data Início"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data Fim"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button 
            variant="contained" 
            startIcon={<FilterList />}
            onClick={handleApplyFilters}
            disabled={loading && !summary}
          >
            Filtrar
          </Button>
        </Box>
      </Box>

      {renderContent()}
    </Box>
  );
}
