import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    MenuItem
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export function NaturezaDespesaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadItem();
        }
    }, [id]);

    async function loadItem() {
        setLoading(true);
        try {
            const response = await api.get(`/naturezas-despesa/${id}`);
            const item = response.data;
            setCodigo(item.codigo);
            setDescricao(item.descricao);
            setTipo(item.tipo);
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar natureza de despesa' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { codigo, descricao, tipo };

            if (isEditing) {
                await api.put(`/naturezas-despesa/${id}`, payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Natureza de despesa atualizada!' });
            } else {
                await api.post('/naturezas-despesa', payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Natureza de despesa criada!' });
            }
            navigate('/naturezas-despesa');
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: `Erro ao ${isEditing ? 'atualizar' : 'criar'} natureza de despesa` });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    {isEditing ? 'Editar Natureza de Despesa' : 'Nova Natureza de Despesa'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Código"
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                                required
                                placeholder="Ex: 4.4.90.52.11"
                                helperText="Código do elemento de despesa orçamentária"
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                required
                                multiline
                                rows={2}
                                placeholder="Ex: Equipamentos de Tecnologia da Informação"
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                select
                                label="Tipo"
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                                required
                            >
                                <MenuItem value="INVESTIMENTO">Investimento</MenuItem>
                                <MenuItem value="CUSTEIO">Custeio</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/naturezas-despesa')}
                            startIcon={<ArrowBackIcon />}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
