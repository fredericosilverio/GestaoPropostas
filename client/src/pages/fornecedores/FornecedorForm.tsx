import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Container
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';

export function FornecedorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    // Form Stats
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');

    // Endereço
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [cep, setCep] = useState('');

    // Contato
    const [responsavelLegal, setResponsavelLegal] = useState('');
    const [emailContato, setEmailContato] = useState('');
    const [telefoneContato, setTelefoneContato] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadFornecedor();
        }
    }, [id]);

    async function loadFornecedor() {
        try {
            const response = await api.get(`/fornecedores/${id}`);
            const data = response.data;

            setRazaoSocial(data.razao_social);
            setNomeFantasia(data.nome_fantasia || '');
            setCnpj(data.cnpj);
            setLogradouro(data.logradouro || '');
            setNumero(data.numero || '');
            setComplemento(data.complemento || '');
            setBairro(data.bairro || '');
            setCidade(data.cidade || '');
            setUf(data.uf || '');
            setCep(data.cep || '');
            setResponsavelLegal(data.responsavel_legal || '');
            setEmailContato(data.email_contato || '');
            setTelefoneContato(data.telefone_contato || '');
        } catch (error) {
            console.error('Erro ao carregar fornecedor', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar dados do fornecedor' });
            navigate('/fornecedores');
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const data = {
            razao_social: razaoSocial,
            nome_fantasia: nomeFantasia,
            cnpj: cnpj.replace(/[^\d]/g, ''), // Clean CNPJ if mask is used (currently manual)
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep: cep.replace(/[^\d]/g, ''),
            responsavel_legal: responsavelLegal,
            email_contato: emailContato,
            telefone_contato: telefoneContato
        };

        try {
            if (isEditing) {
                await api.put(`/fornecedores/${id}`, data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Fornecedor atualizado com sucesso' });
            } else {
                await api.post('/fornecedores', data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Fornecedor cadastrado com sucesso' });
            }
            navigate('/fornecedores');
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao salvar fornecedor';
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    }

    const formatCNPJ = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    };

    const handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCnpj(formatCNPJ(e.target.value));
    };

    if (initialLoading) return <LoadingOverlay message="Carregando..." />;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/fornecedores')}
                    variant="outlined"
                    color="inherit"
                >
                    Voltar
                </Button>
            </Box>

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    {/* Dados Principais */}
                    <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            Dados Principais
                        </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Razão Social"
                            value={razaoSocial}
                            onChange={e => setRazaoSocial(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Nome Fantasia"
                            value={nomeFantasia}
                            onChange={e => setNomeFantasia(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="CNPJ"
                            value={cnpj}
                            onChange={handleCnpjChange}
                            fullWidth
                            required
                            inputProps={{ maxLength: 18 }}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Endereço */}
                    <Grid size={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            Endereço
                        </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="CEP"
                            value={cep}
                            onChange={e => setCep(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Logradouro"
                            value={logradouro}
                            onChange={e => setLogradouro(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="Número"
                            value={numero}
                            onChange={e => setNumero(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="Complemento"
                            value={complemento}
                            onChange={e => setComplemento(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Bairro"
                            value={bairro}
                            onChange={e => setBairro(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Cidade"
                            value={cidade}
                            onChange={e => setCidade(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="UF"
                            value={uf}
                            onChange={e => setUf(e.target.value)}
                            fullWidth
                            inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Contato */}
                    <Grid size={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            Contato
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Responsável Legal"
                            value={responsavelLegal}
                            onChange={e => setResponsavelLegal(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="E-mail"
                            type="email"
                            value={emailContato}
                            onChange={e => setEmailContato(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Telefone"
                            value={telefoneContato}
                            onChange={e => setTelefoneContato(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    {/* Botões */}
                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/fornecedores')}
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
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
