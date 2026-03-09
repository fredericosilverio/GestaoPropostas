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
    Container,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
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

    // Novos Campos
    const [objetoFornecimento, setObjetoFornecimento] = useState('');
    const [situacaoCadastral, setSituacaoCadastral] = useState('ATIVO');

    // Representantes
    const [representantes, setRepresentantes] = useState<any[]>([]);
    const [openRepModal, setOpenRepModal] = useState(false);
    const [newRep, setNewRep] = useState({ nome: '', cpf: '', cargo: '', email: '', telefone: '' });
    const [savingRep, setSavingRep] = useState(false);
    const [editingRepId, setEditingRepId] = useState<number | null>(null);

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

            setObjetoFornecimento(data.objeto_fornecimento || '');
            setSituacaoCadastral(data.situacao_cadastral || 'ATIVO');
            setRepresentantes(data.representantes || []);
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
            telefone_contato: telefoneContato,
            objeto_fornecimento: objetoFornecimento,
            situacao_cadastral: situacaoCadastral
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

    function handleOpenAddModal() {
        setEditingRepId(null);
        setNewRep({ nome: '', cpf: '', cargo: '', email: '', telefone: '' });
        setOpenRepModal(true);
    }

    function handleOpenEditModal(rep: any) {
        setEditingRepId(rep.id);
        setNewRep({
            nome: rep.nome || '',
            cpf: rep.cpf || '',
            cargo: rep.cargo || '',
            email: rep.email || '',
            telefone: rep.telefone || ''
        });
        setOpenRepModal(true);
    }

    async function handleSaveRepresentante() {
        if (!newRep.nome) {
            addToast({ type: 'warning', title: 'Atenção', description: 'Nome do representante é obrigatório' });
            return;
        }

        setSavingRep(true);
        try {
            if (editingRepId) {
                await api.put(`/fornecedores/${id}/representantes/${editingRepId}`, newRep);
                addToast({ type: 'success', title: 'Sucesso', description: 'Representante atualizado' });
            } else {
                await api.post(`/fornecedores/${id}/representantes`, newRep);
                addToast({ type: 'success', title: 'Sucesso', description: 'Representante adicionado' });
            }
            setOpenRepModal(false);
            setNewRep({ nome: '', cpf: '', cargo: '', email: '', telefone: '' });
            setEditingRepId(null);
            loadFornecedor(); // reload data
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', description: `Falha ao ${editingRepId ? 'atualizar' : 'adicionar'} representante` });
        } finally {
            setSavingRep(false);
        }
    }

    async function handleRemoveRepresentante(repId: number) {
        if (!window.confirm('Deseja realmente remover este representante?')) return;

        try {
            await api.delete(`/fornecedores/${id}/representantes/${repId}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Representante removido' });
            loadFornecedor();
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao remover representante' });
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

            <Paper sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Objeto de Fornecimento"
                            value={objetoFornecimento}
                            onChange={e => setObjetoFornecimento(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Situação Cadastral</InputLabel>
                            <Select
                                value={situacaoCadastral}
                                onChange={e => setSituacaoCadastral(e.target.value)}
                                label="Situação Cadastral"
                            >
                                <MenuItem value="ATIVO">Ativo</MenuItem>
                                <MenuItem value="SUSPENSO">Suspenso</MenuItem>
                                <MenuItem value="INABILITADO">Inabilitado</MenuItem>
                            </Select>
                        </FormControl>
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

            {isEditing && (
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, width: '100%' }}>
                            Representantes
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddModal}
                            size="small"
                            sx={{ ml: -20, whiteSpace: 'nowrap' }} // Adjust to float right alongside border
                        >
                            Adicionar
                        </Button>
                    </Box>

                    {representantes.length === 0 ? (
                        <Typography color="text.secondary" variant="body2">Nenhum representante cadastrado.</Typography>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Cargo</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>E-mail / Telefone</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {representantes.map(rep => (
                                    <TableRow key={rep.id}>
                                        <TableCell>{rep.nome}</TableCell>
                                        <TableCell>{rep.cargo || '-'}</TableCell>
                                        <TableCell>{rep.cpf || '-'}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{rep.email || '-'}</Typography>
                                            <Typography variant="caption" color="text.secondary">{rep.telefone || '-'}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(rep)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleRemoveRepresentante(rep.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Paper>
            )}

            {/* Modal Novo Representante */}
            <Dialog open={openRepModal} onClose={() => setOpenRepModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingRepId ? 'Editar Representante' : 'Novo Representante'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nome"
                                fullWidth
                                required
                                value={newRep.nome}
                                onChange={e => setNewRep({ ...newRep, nome: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="CPF"
                                fullWidth
                                value={newRep.cpf}
                                onChange={e => setNewRep({ ...newRep, cpf: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Cargo"
                                fullWidth
                                value={newRep.cargo}
                                onChange={e => setNewRep({ ...newRep, cargo: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="E-mail"
                                fullWidth
                                type="email"
                                value={newRep.email}
                                onChange={e => setNewRep({ ...newRep, email: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Telefone"
                                fullWidth
                                value={newRep.telefone}
                                onChange={e => setNewRep({ ...newRep, telefone: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRepModal(false)} disabled={savingRep}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSaveRepresentante} disabled={savingRep}>
                        {savingRep ? 'Salvando...' : editingRepId ? 'Atualizar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}
