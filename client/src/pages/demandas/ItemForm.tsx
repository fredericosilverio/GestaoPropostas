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
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export function ItemForm() {
    const { demandaId, itemId } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isEditing = !!itemId;

    const [loading, setLoading] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [unidade, setUnidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [elementoDespesa, setElementoDespesa] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadItem();
        }
    }, [itemId]);

    async function loadItem() {
        setLoading(true);
        try {
            const response = await api.get(`/itens/${itemId}`);
            const item = response.data;
            setDescricao(item.descricao);
            setUnidade(item.unidade_medida);
            setQuantidade(item.quantidade);
            setElementoDespesa(item.elemento_despesa);
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar item' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                await api.put(`/itens/${itemId}`, {
                    descricao,
                    unidade_medida: unidade,
                    quantidade: Number(quantidade),
                    elemento_despesa: elementoDespesa
                });
                addToast({ type: 'success', title: 'Sucesso', description: 'Item atualizado com sucesso!' });
            } else {
                await api.post('/itens', {
                    demanda_id: Number(demandaId),
                    descricao,
                    unidade_medida: unidade,
                    quantidade: Number(quantidade),
                    elemento_despesa: elementoDespesa
                });
                addToast({ type: 'success', title: 'Sucesso', description: 'Item criado com sucesso!' });
            }
            navigate(`/demandas/${demandaId}`);
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: `Erro ao ${isEditing ? 'atualizar' : 'criar'} item` });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    {isEditing ? 'Editar Item' : 'Novo Item'}
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                required
                                multiline
                                rows={2}
                            />
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Unidade"
                                value={unidade}
                                onChange={e => setUnidade(e.target.value)}
                                required
                                placeholder="Ex: UN, KG, M"
                            />
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Quantidade"
                                type="number"
                                value={quantidade}
                                onChange={e => setQuantidade(e.target.value)}
                                required
                            />
                        </Grid>
                        
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Elemento Despesa"
                                value={elementoDespesa}
                                onChange={e => setElementoDespesa(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
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
