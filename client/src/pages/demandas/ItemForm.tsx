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

interface NaturezaDespesa {
    id: number;
    codigo: string;
    descricao: string;
    tipo: string;
}

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

    // New fields for budget distribution
    const [naturezas, setNaturezas] = useState<NaturezaDespesa[]>([]);
    const [naturezaDespesaId, setNaturezaDespesaId] = useState<number | ''>('');
    const [percentual1grau, setPercentual1grau] = useState('');
    const [percentual2grau, setPercentual2grau] = useState('');
    const [percentualAreaMeio, setPercentualAreaMeio] = useState('');
    const [tipoDespesa, setTipoDespesa] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');

    useEffect(() => {
        loadNaturezas();
        if (isEditing) {
            loadItem();
        }
    }, [itemId]);

    async function loadNaturezas() {
        try {
            const response = await api.get('/naturezas-despesa');
            setNaturezas(response.data);
        } catch (error) {
            console.error('Erro ao carregar naturezas de despesa:', error);
        }
    }

    async function loadItem() {
        setLoading(true);
        try {
            const response = await api.get(`/itens/${itemId}`);
            const item = response.data;
            setDescricao(item.descricao);
            setUnidade(item.unidade_medida);
            setQuantidade(item.quantidade);
            setElementoDespesa(item.elemento_despesa);
            setNaturezaDespesaId(item.natureza_despesa_id || '');
            setPercentual1grau(item.percentual_1grau?.toString() || '');
            setPercentual2grau(item.percentual_2grau?.toString() || '');
            setPercentualAreaMeio(item.percentual_area_meio?.toString() || '');
            setTipoDespesa(item.tipo_despesa || '');
            setFormaPagamento(item.forma_pagamento || '');
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar item' });
        } finally {
            setLoading(false);
        }
    }

    function handleNaturezaChange(id: number | '') {
        setNaturezaDespesaId(id);
        if (id) {
            const nat = naturezas.find(n => n.id === id);
            if (nat) {
                setElementoDespesa(nat.codigo);
                setTipoDespesa(nat.tipo === 'INVESTIMENTO' ? 'Investimento' : 'Custeio');
            }
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload: any = {
            descricao,
            unidade_medida: unidade,
            quantidade: Number(quantidade),
            elemento_despesa: elementoDespesa,
            natureza_despesa_id: naturezaDespesaId || null,
            percentual_1grau: percentual1grau ? Number(percentual1grau) : null,
            percentual_2grau: percentual2grau ? Number(percentual2grau) : null,
            percentual_area_meio: percentualAreaMeio ? Number(percentualAreaMeio) : null,
            tipo_despesa: tipoDespesa || null,
            forma_pagamento: formaPagamento || null
        };

        try {
            if (isEditing) {
                await api.put(`/itens/${itemId}`, payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Item atualizado com sucesso!' });
            } else {
                await api.post('/itens', {
                    demanda_id: Number(demandaId),
                    ...payload
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
        <Container maxWidth="md" sx={{ py: 4 }}>
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

                        {/* Natureza de Despesa Section */}
                        <Grid size={12}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1, mb: -1, color: 'primary.main' }}>
                                Distribuição Orçamentária
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                fullWidth
                                select
                                label="Natureza de Despesa"
                                value={naturezaDespesaId}
                                onChange={e => handleNaturezaChange(e.target.value ? Number(e.target.value) : '')}
                                helperText="Selecione para preencher automaticamente o código e tipo"
                            >
                                <MenuItem value="">
                                    <em>Nenhuma</em>
                                </MenuItem>
                                {naturezas.map(nat => (
                                    <MenuItem key={nat.id} value={nat.id}>
                                        {nat.codigo} - {nat.descricao} ({nat.tipo})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Elemento Despesa"
                                value={elementoDespesa}
                                onChange={e => setElementoDespesa(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="% 1º Grau"
                                type="number"
                                value={percentual1grau}
                                onChange={e => setPercentual1grau(e.target.value)}
                                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
                                placeholder="Ex: 82"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="% 2º Grau"
                                type="number"
                                value={percentual2grau}
                                onChange={e => setPercentual2grau(e.target.value)}
                                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
                                placeholder="Ex: 5"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="% Área Meio"
                                type="number"
                                value={percentualAreaMeio}
                                onChange={e => setPercentualAreaMeio(e.target.value)}
                                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
                                placeholder="Ex: 13"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Tipo de Despesa"
                                value={tipoDespesa}
                                onChange={e => setTipoDespesa(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Nenhum</em>
                                </MenuItem>
                                <MenuItem value="Investimento">Investimento</MenuItem>
                                <MenuItem value="Custeio">Custeio</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Forma de Pagamento"
                                value={formaPagamento}
                                onChange={e => setFormaPagamento(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Nenhuma</em>
                                </MenuItem>
                                <MenuItem value="Parcela única">Parcela única</MenuItem>
                                <MenuItem value="Mensal">Mensal</MenuItem>
                                <MenuItem value="Anual">Anual</MenuItem>
                                <MenuItem value="Sob demanda">Sob demanda</MenuItem>
                            </TextField>
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
