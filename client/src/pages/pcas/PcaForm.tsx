import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import type { User } from '../../types/api';

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

export function PcaForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [situacao, setSituacao] = useState('');
    const [numeroPca, setNumeroPca] = useState('');
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

            setNumeroPca(pca.numero_pca);
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
        { id: 'dados-gerais', label: 'Dados Gerais', icon: '📋' },
        { id: 'vinculacao', label: 'Vinculação Institucional', icon: '🏛️' },
        { id: 'responsaveis', label: 'Responsáveis', icon: '👤' },
        { id: 'vigencia', label: 'Vigência', icon: '📅' },
        { id: 'aprovacao', label: 'Aprovação', icon: '✅' },
        { id: 'observacoes', label: 'Observações', icon: '📝' }
    ];

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-zinc-600";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    if (loading) return <LoadingOverlay message="Carregando PCA..." />;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {isEditing ? `Editar PCA ${numeroPca}` : 'Novo Plano de Contratações Anual'}
                    </h1>
                    {isEditing && situacao && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${situacao === 'EM_ELABORACAO' ? 'bg-blue-100 text-blue-800' :
                            situacao === 'EM_ANALISE' ? 'bg-purple-100 text-purple-800' :
                                situacao === 'APROVADO' ? 'bg-green-100 text-green-800' :
                                    situacao === 'EM_EXECUCAO' ? 'bg-yellow-100 text-yellow-800' :
                                        situacao === 'REVISADO' ? 'bg-orange-100 text-orange-800' :
                                            situacao === 'ENCERRADO' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                            }`}>
                            {situacao.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>
            </div>

            {isReadOnly && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
                    <p className="text-yellow-700 dark:text-yellow-300">
                        ⚠️ Este PCA está com status "{situacao}" e não pode ser editado.
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="flex gap-6">
                {/* Sidebar Navigation */}
                <div className="w-64 flex-shrink-0">
                    <nav className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 sticky top-4">
                        <ul className="space-y-2">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        <span className="mr-2">{section.icon}</span>
                                        {section.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        {/* Dados Gerais */}
                        {activeSection === 'dados-gerais' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    📋 Dados Gerais do Plano
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Ano de Referência *</label>
                                        <input
                                            type="number"
                                            value={formData.ano}
                                            onChange={e => updateField('ano', Number(e.target.value))}
                                            min={2020}
                                            max={2050}
                                            className={inputClass}
                                            disabled={isEditing || isReadOnly}
                                            required
                                        />
                                    </div>
                                    {isEditing && (
                                        <div>
                                            <label className={labelClass}>Código do PCA</label>
                                            <input
                                                type="text"
                                                value={numeroPca}
                                                className={`${inputClass} font-mono`}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Denominação do Plano</label>
                                    <input
                                        type="text"
                                        value={formData.denominacao}
                                        onChange={e => updateField('denominacao', e.target.value)}
                                        placeholder="Ex: Plano Anual de Contratações 2026 – DTI"
                                        className={inputClass}
                                        disabled={isReadOnly}
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Nome descritivo do plano para fácil identificação
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Vinculação Institucional */}
                        {activeSection === 'vinculacao' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    🏛️ Vinculação Institucional
                                </h2>

                                <div>
                                    <label className={labelClass}>Órgão / Entidade *</label>
                                    <select
                                        value={formData.orgao}
                                        onChange={e => updateField('orgao', e.target.value)}
                                        className={inputClass}
                                        disabled={isEditing || isReadOnly}
                                        required
                                    >
                                        <option value="">Selecione um órgão</option>
                                        {ORGAOS_PREDEFINIDOS.map(org => (
                                            <option key={org} value={org}>{org}</option>
                                        ))}
                                    </select>
                                    {formData.orgao === 'Outro' && (
                                        <input
                                            type="text"
                                            value={formData.orgaoCustom}
                                            onChange={e => updateField('orgaoCustom', e.target.value)}
                                            placeholder="Digite o nome do órgão"
                                            className={`${inputClass} mt-2`}
                                            disabled={isEditing || isReadOnly}
                                            required
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Unidade Administrativa Demandante</label>
                                    <input
                                        type="text"
                                        value={formData.unidade_demandante}
                                        onChange={e => updateField('unidade_demandante', e.target.value)}
                                        placeholder="Diretoria, Secretaria ou Coordenação responsável"
                                        className={inputClass}
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Área Técnica Responsável</label>
                                    <input
                                        type="text"
                                        value={formData.area_tecnica}
                                        onChange={e => updateField('area_tecnica', e.target.value)}
                                        placeholder="Área que prestará suporte técnico às contratações"
                                        className={inputClass}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Responsáveis */}
                        {activeSection === 'responsaveis' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    👤 Responsáveis
                                </h2>

                                <div>
                                    <label className={labelClass}>Responsável pela Consolidação / Gestão</label>
                                    <select
                                        value={formData.responsavel_consolidacao_id}
                                        onChange={e => updateField('responsavel_consolidacao_id', e.target.value ? Number(e.target.value) : '')}
                                        className={inputClass}
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Selecione um responsável</option>
                                        {usuarios.map(u => (
                                            <option key={u.id} value={u.id}>{u.nome_completo}</option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Servidor encarregado do acompanhamento global do plano
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>E-mail Institucional</label>
                                        <input
                                            type="email"
                                            value={formData.contato_email}
                                            onChange={e => updateField('contato_email', e.target.value)}
                                            placeholder="contato@orgao.gov.br"
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Telefone Funcional</label>
                                        <input
                                            type="text"
                                            value={formData.contato_telefone}
                                            onChange={e => updateField('contato_telefone', e.target.value)}
                                            placeholder="(00) 0000-0000"
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vigência */}
                        {activeSection === 'vigencia' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    📅 Período de Vigência
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Início da Vigência</label>
                                        <input
                                            type="date"
                                            value={formData.periodo_vigencia_inicio}
                                            onChange={e => updateField('periodo_vigencia_inicio', e.target.value)}
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Fim da Vigência</label>
                                        <input
                                            type="date"
                                            value={formData.periodo_vigencia_fim}
                                            onChange={e => updateField('periodo_vigencia_fim', e.target.value)}
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Normalmente coincidente com o exercício financeiro (01/01 a 31/12)
                                </p>
                            </div>
                        )}

                        {/* Aprovação */}
                        {activeSection === 'aprovacao' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    ✅ Aprovação Institucional
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Autoridade Aprovadora</label>
                                        <input
                                            type="text"
                                            value={formData.autoridade_aprovadora}
                                            onChange={e => updateField('autoridade_aprovadora', e.target.value)}
                                            placeholder="Nome da autoridade"
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cargo / Função</label>
                                        <input
                                            type="text"
                                            value={formData.cargo_autoridade}
                                            onChange={e => updateField('cargo_autoridade', e.target.value)}
                                            placeholder="Cargo da autoridade"
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Forma de Aprovação</label>
                                        <select
                                            value={formData.forma_aprovacao}
                                            onChange={e => updateField('forma_aprovacao', e.target.value)}
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        >
                                            {FORMAS_APROVACAO.map(f => (
                                                <option key={f.value} value={f.value}>{f.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Data da Aprovação</label>
                                        <input
                                            type="date"
                                            value={formData.data_aprovacao}
                                            onChange={e => updateField('data_aprovacao', e.target.value)}
                                            className={inputClass}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Documento de Aprovação</label>
                                    <input
                                        type="text"
                                        value={formData.documento_aprovacao}
                                        onChange={e => updateField('documento_aprovacao', e.target.value)}
                                        placeholder="Número do processo (ex.: SEI, PROAD)"
                                        className={inputClass}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Observações */}
                        {activeSection === 'observacoes' && (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                                    📝 Observações
                                </h2>

                                <div>
                                    <label className={labelClass}>Observações Gerais</label>
                                    <textarea
                                        value={formData.observacoes}
                                        onChange={e => updateField('observacoes', e.target.value)}
                                        placeholder="Informações relevantes não contempladas nos campos anteriores..."
                                        className={inputClass}
                                        rows={4}
                                        disabled={isReadOnly}
                                    />
                                </div>

                                {isEditing && (
                                    <div>
                                        <label className={labelClass}>Histórico de Alterações</label>
                                        <textarea
                                            value={formData.historico_alteracoes}
                                            onChange={e => updateField('historico_alteracoes', e.target.value)}
                                            placeholder="Resumo das modificações realizadas em cada versão..."
                                            className={inputClass}
                                            rows={4}
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {!isReadOnly && <span>* Campos obrigatórios</span>}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => isEditing ? navigate(`/pcas/${id}`) : navigate('/pcas')}
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600"
                                >
                                    Cancelar
                                </button>
                                {!isReadOnly && (
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light disabled:opacity-50"
                                    >
                                        {saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar PCA')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
