import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import type { User } from '../../types/api';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

const ORGAOS_PREDEFINIDOS = [
    'Secretaria de Administração',
    'Secretaria de Saúde',
    'Secretaria de Educação',
    'Secretaria de Finanças',
    'Secretaria de Infraestrutura',
    'Secretaria de Segurança',
    'Secretaria de Meio Ambiente',
    'Secretaria de Cultura',
    'Secretaria de Esporte e Lazer',
    'Secretaria de Assistência Social',
    'Gabinete do Prefeito',
    'Procuradoria Geral',
    'Controladoria',
    'Outro'
];

const FORMAS_APROVACAO = [
    { value: '', label: 'Selecione...' },
    { value: 'DESPACHO', label: 'Despacho' },
    { value: 'PORTARIA', label: 'Portaria' },
    { value: 'DELIBERACAO', label: 'Deliberação Colegiada' },
    { value: 'OUTRO', label: 'Outro' }
];

interface FormData {
    // Dados Gerais
    ano: number;
    numero_pca: string;
    denominacao: string;

    // Vinculação Institucional
    orgao: string;
    orgaoCustom: string;
    unidade_demandante: string;
    area_tecnica: string;

    // Responsáveis
    responsavel_consolidacao_id: number | '';
    contato_email: string;
    contato_telefone: string;

    // Vigência
    periodo_vigencia_inicio: string;
    periodo_vigencia_fim: string;

    // Aprovação
    autoridade_aprovadora: string;
    cargo_autoridade: string;
    forma_aprovacao: string;
    documento_aprovacao: string;
    data_aprovacao: string;

    // Observações
    observacoes: string;
    historico_alteracoes: string;
}

const initialFormData: FormData = {
    ano: new Date().getFullYear(),
    numero_pca: '',
    denominacao: '',
    orgao: '',
    orgaoCustom: '',
    unidade_demandante: '',
    area_tecnica: '',
    responsavel_consolidacao_id: '',
    contato_email: '',
    contato_telefone: '',
    periodo_vigencia_inicio: '',
    periodo_vigencia_fim: '',
    autoridade_aprovadora: '',
    cargo_autoridade: '',
    forma_aprovacao: '',
    documento_aprovacao: '',
    data_aprovacao: '',
    observacoes: '',
    historico_alteracoes: ''
};

import { useAuth } from '../../contexts/AuthContext';

export function PcaForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: _user } = useAuth(); // _user to indicate unused or just remove it if strictly unused.
    // Better to just remove it if unused.
    // checking if user is used... "const canCreate = user?.perfil..." was in PcaList.tsx
    // in PcaForm.tsx, user is NOT used.

    const isEditing = !!id;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [situacao, setSituacao] = useState('');
    const [activeSection, setActiveSection] = useState('dados-gerais');

    useEffect(() => {
        loadUsuarios();
        if (isEditing) {
            loadPca();
        }
    }, [id]);

    async function loadUsuarios() {
        try {
            const response = await api.get('/users');
            setUsuarios(response.data.filter((u: User) => u.ativo));
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        }
    }

    async function loadPca() {
        try {
            setLoading(true);
            const response = await api.get(`/pcas/${id}`);
            const pca = response.data;

            const selectedOrgao = ORGAOS_PREDEFINIDOS.includes(pca.orgao) ? pca.orgao : 'Outro';
            const customOrgao = ORGAOS_PREDEFINIDOS.includes(pca.orgao) ? '' : pca.orgao;

            setFormData({
                ano: pca.ano,
                numero_pca: pca.numero_pca || '',
                denominacao: pca.denominacao || '',
                orgao: selectedOrgao,
                orgaoCustom: customOrgao,
                unidade_demandante: pca.unidade_demandante || '',
                area_tecnica: pca.area_tecnica || '',
                responsavel_consolidacao_id: pca.responsavel_consolidacao_id || '',
                contato_email: pca.contato_email || '',
                contato_telefone: pca.contato_telefone || '',
                periodo_vigencia_inicio: pca.periodo_vigencia_inicio ? pca.periodo_vigencia_inicio.split('T')[0] : '',
                periodo_vigencia_fim: pca.periodo_vigencia_fim ? pca.periodo_vigencia_fim.split('T')[0] : '',
                autoridade_aprovadora: pca.autoridade_aprovadora || '',
                cargo_autoridade: pca.cargo_autoridade || '',
                forma_aprovacao: pca.forma_aprovacao || '',
                documento_aprovacao: pca.documento_aprovacao || '',
                data_aprovacao: pca.data_aprovacao ? pca.data_aprovacao.split('T')[0] : '',
                observacoes: pca.observacoes || '',
                historico_alteracoes: pca.historico_alteracoes || ''
            });

            setSituacao(pca.situacao);
            setIsReadOnly(pca.situacao === 'ENCERRADO' || pca.situacao === 'CANCELADO');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao carregar PCA');
        } finally {
            setLoading(false);
        }
    }

    function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const finalOrgao = formData.orgao === 'Outro' ? formData.orgaoCustom : formData.orgao;

        // Validações
        if (!finalOrgao || finalOrgao.trim().length < 3) {
            setError('Órgão é obrigatório e deve ter pelo menos 3 caracteres');
            setSaving(false);
            return;
        }

        if (formData.ano < 2020 || formData.ano > 2050) {
            setError('Ano deve estar entre 2020 e 2050');
            setSaving(false);
            return;
        }

        try {
            const payload: any = {
                ano: Number(formData.ano),
                numero_pca: formData.numero_pca,
                orgao: finalOrgao.trim(),
                denominacao: formData.denominacao || null,
                unidade_demandante: formData.unidade_demandante || null,
                area_tecnica: formData.area_tecnica || null,
                responsavel_consolidacao_id: formData.responsavel_consolidacao_id || null,
                contato_email: formData.contato_email || null,
                contato_telefone: formData.contato_telefone || null,
                periodo_vigencia_inicio: formData.periodo_vigencia_inicio ? new Date(formData.periodo_vigencia_inicio) : null,
                periodo_vigencia_fim: formData.periodo_vigencia_fim ? new Date(formData.periodo_vigencia_fim) : null,
                autoridade_aprovadora: formData.autoridade_aprovadora || null,
                cargo_autoridade: formData.cargo_autoridade || null,
                forma_aprovacao: formData.forma_aprovacao || null,
                documento_aprovacao: formData.documento_aprovacao || null,
                data_aprovacao: formData.data_aprovacao ? new Date(formData.data_aprovacao) : null,
                observacoes: formData.observacoes || null,
                historico_alteracoes: formData.historico_alteracoes || null
            };

            if (isEditing) {
                await api.put(`/pcas/${id}`, payload);
                navigate(`/pcas/${id}`);
            } else {
                const response = await api.post('/pcas', payload);
                navigate(`/pcas/${response.data.id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar PCA');
        } finally {
            setSaving(false);
        }
    }

    const sections = [
        { id: 'dados-gerais', label: 'Dados Gerais', icon: <AssignmentIcon /> },
        { id: 'vinculacao', label: 'Vinculação Institucional', icon: <AccountBalanceIcon /> },
        { id: 'responsaveis', label: 'Responsáveis', icon: <PersonIcon /> },
        { id: 'vigencia', label: 'Vigência', icon: <EventIcon /> },
        { id: 'aprovacao', label: 'Aprovação', icon: <CheckCircleIcon /> },
        { id: 'observacoes', label: 'Observações', icon: <NotesIcon /> }
    ];

    if (loading) return <LoadingOverlay message="Carregando PCA..." />;

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { sm: 'center' }, 
                gap: 2,
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 1,
                boxShadow: 1
            }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        {isEditing ? `Editar PCA ${formData.numero_pca}` : 'Novo Plano de Contratações Anual'}
                    </Typography>
                    {isEditing && situacao && (
                        <Box sx={{ mt: 1 }}>
                            <StatusBadge status={situacao} />
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    {!isReadOnly && (
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={saving}
                            color="primary"
                        >
                            {saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar PCA')}
                        </Button>
                    )}
                </Box>
            </Box>

            {isReadOnly && (
                <Alert severity="warning" sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Atenção: Modo Somente Leitura
                    </Typography>
                    Este PCA está com status "{situacao}" e não pode ser editado.
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Sidebar Navigation */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ position: 'sticky', top: 24 }}>
                        <List component="nav">
                            {sections.map((section) => (
                                <ListItemButton
                                    key={section.id}
                                    selected={activeSection === section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    sx={{
                                        borderLeft: activeSection === section.id ? 4 : 0,
                                        borderColor: 'primary.main',
                                        '&.Mui-selected': {
                                            bgcolor: 'action.selected',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: activeSection === section.id ? 'primary.main' : 'inherit' }}>
                                        {section.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={section.label} 
                                        primaryTypographyProps={{ 
                                            fontWeight: activeSection === section.id ? 'bold' : 'medium' 
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Form Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit}>
                            {/* Dados Gerais */}
                            {activeSection === 'dados-gerais' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Dados Gerais do Plano
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Ano de Referência"
                                                type="number"
                                                value={formData.ano}
                                                onChange={e => updateField('ano', Number(e.target.value))}
                                                inputProps={{ min: 2020, max: 2050 }}
                                                disabled={isEditing || isReadOnly}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Código do PCA"
                                                value={formData.numero_pca}
                                                onChange={e => updateField('numero_pca', e.target.value)}
                                                placeholder="Ex: PCA-2026/001"
                                                helperText="Código identificador único do PCA"
                                                disabled={isReadOnly}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Denominação do Plano"
                                                value={formData.denominacao}
                                                onChange={e => updateField('denominacao', e.target.value)}
                                                placeholder="Ex: Plano Anual de Contratações 2026 – DTI"
                                                helperText="Nome descritivo do plano para fácil identificação"
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Vinculação Institucional */}
                            {activeSection === 'vinculacao' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Vinculação Institucional
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Órgão / Entidade"
                                                value={formData.orgao}
                                                onChange={e => updateField('orgao', e.target.value)}
                                                disabled={isEditing || isReadOnly}
                                                required
                                            >
                                                <MenuItem value="">Selecione um órgão</MenuItem>
                                                {ORGAOS_PREDEFINIDOS.map(org => (
                                                    <MenuItem key={org} value={org}>{org}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        {formData.orgao === 'Outro' && (
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Nome do Órgão"
                                                    value={formData.orgaoCustom}
                                                    onChange={e => updateField('orgaoCustom', e.target.value)}
                                                    placeholder="Digite o nome do órgão"
                                                    disabled={isEditing || isReadOnly}
                                                    required
                                                />
                                            </Grid>
                                        )}
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Unidade Administrativa Demandante"
                                                value={formData.unidade_demandante}
                                                onChange={e => updateField('unidade_demandante', e.target.value)}
                                                placeholder="Diretoria, Secretaria ou Coordenação responsável"
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Área Técnica Responsável"
                                                value={formData.area_tecnica}
                                                onChange={e => updateField('area_tecnica', e.target.value)}
                                                placeholder="Área que prestará suporte técnico às contratações"
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Responsáveis */}
                            {activeSection === 'responsaveis' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Responsáveis
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Responsável pela Consolidação / Gestão"
                                                value={formData.responsavel_consolidacao_id}
                                                onChange={e => updateField('responsavel_consolidacao_id', e.target.value ? Number(e.target.value) : '')}
                                                disabled={isReadOnly}
                                                helperText="Servidor encarregado do acompanhamento global do plano"
                                            >
                                                <MenuItem value="">Selecione um responsável</MenuItem>
                                                {usuarios.map(u => (
                                                    <MenuItem key={u.id} value={u.id}>{u.nome_completo}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="E-mail de Contato"
                                                type="email"
                                                value={formData.contato_email}
                                                onChange={e => updateField('contato_email', e.target.value)}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Telefone de Contato"
                                                value={formData.contato_telefone}
                                                onChange={e => updateField('contato_telefone', e.target.value)}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Vigência */}
                            {activeSection === 'vigencia' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Período de Vigência
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Início da Vigência"
                                                type="date"
                                                value={formData.periodo_vigencia_inicio}
                                                onChange={e => updateField('periodo_vigencia_inicio', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Fim da Vigência"
                                                type="date"
                                                value={formData.periodo_vigencia_fim}
                                                onChange={e => updateField('periodo_vigencia_fim', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Normalmente coincidente com o exercício financeiro (01/01 a 31/12)
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Aprovação */}
                            {activeSection === 'aprovacao' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Dados da Aprovação
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Autoridade Aprovadora"
                                                value={formData.autoridade_aprovadora}
                                                onChange={e => updateField('autoridade_aprovadora', e.target.value)}
                                                placeholder="Nome da autoridade que aprovou o plano"
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Cargo da Autoridade"
                                                value={formData.cargo_autoridade}
                                                onChange={e => updateField('cargo_autoridade', e.target.value)}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Forma de Aprovação"
                                                value={formData.forma_aprovacao}
                                                onChange={e => updateField('forma_aprovacao', e.target.value)}
                                                disabled={isReadOnly}
                                            >
                                                {FORMAS_APROVACAO.map(forma => (
                                                    <MenuItem key={forma.value} value={forma.value}>{forma.label}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Data da Aprovação"
                                                type="date"
                                                value={formData.data_aprovacao}
                                                onChange={e => updateField('data_aprovacao', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Documento de Aprovação"
                                                value={formData.documento_aprovacao}
                                                onChange={e => updateField('documento_aprovacao', e.target.value)}
                                                placeholder="Ex: Portaria nº 123/2026"
                                                disabled={isReadOnly}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Observações */}
                            {activeSection === 'observacoes' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
                                        Observações e Histórico
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Observações Gerais"
                                                multiline
                                                rows={4}
                                                value={formData.observacoes}
                                                onChange={e => updateField('observacoes', e.target.value)}
                                                disabled={isReadOnly}
                                                placeholder="Informações relevantes não contempladas nos campos anteriores..."
                                            />
                                        </Grid>
                                        {isEditing && (
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Histórico de Alterações"
                                                    multiline
                                                    rows={4}
                                                    value={formData.historico_alteracoes}
                                                    onChange={e => updateField('historico_alteracoes', e.target.value)}
                                                    disabled={isReadOnly}
                                                    placeholder="Resumo das modificações realizadas em cada versão..."
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            )}
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
