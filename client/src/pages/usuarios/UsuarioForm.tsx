import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider,
    type SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface UsuarioFormData {
    nome_completo: string;
    email: string;
    cpf: string;
    matricula: string;
    telefone: string;
    perfil: string;
    unidade_vinculada: string;
    senha?: string;
    ativo: boolean;
}

export function UsuarioForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<UsuarioFormData>({
        nome_completo: '',
        email: '',
        cpf: '',
        matricula: '',
        telefone: '',
        perfil: 'OPERADOR',
        unidade_vinculada: '',
        ativo: true
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (id) {
            loadUsuario(Number(id));
        }
    }, [id]);

    async function loadUsuario(userId: number) {
        setLoading(true);
        try {
            const response = await api.get(`/users/${userId}`);
            const u = response.data;
            setFormData({
                nome_completo: u.nome_completo,
                email: u.email,
                cpf: u.cpf,
                matricula: u.matricula,
                telefone: u.telefone || '',
                perfil: u.perfil,
                unidade_vinculada: u.unidade_vinculada || '',
                ativo: u.ativo
            });
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar usuário' });
            navigate('/usuarios');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const name = e.target.name as keyof UsuarioFormData;
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setFormData(prev => ({ ...prev, cpf: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.nome_completo || !formData.email || !formData.cpf || !formData.matricula) {
            addToast({ type: 'error', title: 'Atenção', description: 'Preencha todos os campos obrigatórios' });
            return;
        }

        if (!id && !password) {
            addToast({ type: 'error', title: 'Atenção', description: 'Senha é obrigatória para novos usuários' });
            return;
        }

        if (password && password !== confirmPassword) {
            addToast({ type: 'error', title: 'Erro', description: 'As senhas não conferem' });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, ...(password ? { senha: password } : {}) };

            if (id) {
                await api.put(`/users/${id}`, payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Usuário atualizado com sucesso' });
            } else {
                await api.post('/users', payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Usuário criado com sucesso' });
            }
            navigate('/usuarios');
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao salvar usuário';
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    {id ? 'Editar Usuário' : 'Novo Usuário'}
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/usuarios')}
                    variant="outlined"
                    color="inherit"
                >
                    Voltar
                </Button>
            </Box>

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    {/* Nome */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Nome Completo"
                            name="nome_completo"
                            value={formData.nome_completo}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>

                    {/* Email */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Email Institucional"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>

                    {/* Telefone */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    {/* CPF */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="CPF"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleCpfChange}
                            fullWidth
                            required
                            inputProps={{ maxLength: 14 }}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Matrícula */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Matrícula"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>

                    {/* Perfil */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Perfil de Acesso</InputLabel>
                            <Select
                                name="perfil"
                                value={formData.perfil}
                                label="Perfil de Acesso"
                                onChange={handleChange}
                            >
                                <MenuItem value="OPERADOR">Operador</MenuItem>
                                <MenuItem value="GESTOR">Gestor</MenuItem>
                                <MenuItem value="ADMIN">Administrador</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Unidade */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Unidade Vinculada"
                            name="unidade_vinculada"
                            value={formData.unidade_vinculada}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Ex: DITI, GAC..."
                            variant="outlined"
                        />
                    </Grid>

                    {/* Segurança */}
                    <Grid size={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Segurança
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label={id ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required={!id}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Confirmação de Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            fullWidth
                            required={!!password}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/usuarios')}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                            {loading ? 'Salvando...' : 'Salvar Usuário'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
