import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

interface NaturezaDespesa {
    id: number;
    codigo: string;
    descricao: string;
    tipo: string;
    ativo: boolean;
}

export function NaturezaDespesaList() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [items, setItems] = useState<NaturezaDespesa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const response = await api.get('/naturezas-despesa');
            setItems(response.data);
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar naturezas de despesa' });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Tem certeza que deseja excluir esta natureza de despesa?')) return;
        try {
            await api.delete(`/naturezas-despesa/${id}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Natureza de despesa excluída' });
            loadItems();
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao excluir' });
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} color="inherit">
                        Voltar
                    </Button>
                    <Typography variant="h5" fontWeight="bold">
                        Naturezas de Despesa
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/naturezas-despesa/novo')}
                >
                    Nova Natureza
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Código</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                            <TableCell align="center" width={120}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Carregando...</TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Nenhuma natureza de despesa cadastrada</TableCell>
                            </TableRow>
                        ) : items.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{item.codigo}</TableCell>
                                <TableCell>{item.descricao}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={item.tipo === 'INVESTIMENTO' ? 'Investimento' : 'Custeio'}
                                        color={item.tipo === 'INVESTIMENTO' ? 'primary' : 'secondary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/naturezas-despesa/${item.id}/editar`)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
