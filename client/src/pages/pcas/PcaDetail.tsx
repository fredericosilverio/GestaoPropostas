import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PcaSummary } from '../../components/pca/PcaSummary';
import type { Pca, Demanda } from '../../types/api';

interface PcaWithDetails extends Pca {
    demandas: (Demanda & { _count?: { itens: number } })[];
    versao_anterior?: { id: number; versao: number; data_criacao: string };
    responsavel_consolidacao?: { id: number; nome_completo: string; email?: string };
}

interface PcaVersion {
    id: number;
    versao: number;
    situacao: string;
    data_criacao: string;
    motivo_versao?: string;
    responsavel: { id: number; nome_completo: string };
}

const STATUS_LABELS: Record<string, { label: string; nextStatus?: string; nextLabel?: string }> = {
    'EM_ELABORACAO': { label: 'Em Elaboração', nextStatus: 'APROVADO', nextLabel: 'Aprovar' },
    'EM_ANALISE': { label: 'Em Análise', nextStatus: 'APROVADO', nextLabel: 'Aprovar' },
    'APROVADO': { label: 'Aprovado', nextStatus: 'EM_EXECUCAO', nextLabel: 'Iniciar Execução' },
    'EM_EXECUCAO': { label: 'Em Execução', nextStatus: 'ENCERRADO', nextLabel: 'Encerrar' },
    'REVISADO': { label: 'Revisado', nextStatus: 'APROVADO', nextLabel: 'Reaprovar' },
    'ENCERRADO': { label: 'Encerrado' },
    'CANCELADO': { label: 'Cancelado' }
};

export function PcaDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.perfil === 'ADMIN' || user?.perfil === 'GESTOR';

    const [pca, setPca] = useState<PcaWithDetails | null>(null);
    const [versions, setVersions] = useState<PcaVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Form states
    const [justificativa, setJustificativa] = useState('');
    const [motivo, setMotivo] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadPca();
        loadVersions();
    }, [id]);

    async function loadPca() {
        try {
            setLoading(true);
            const response = await api.get(`/pcas/${id}`);
            setPca(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao carregar PCA');
        } finally {
            setLoading(false);
        }
    }

    async function loadVersions() {
        try {
            const response = await api.get(`/pcas/${id}/versions`);
            setVersions(response.data);
        } catch (err) {
            console.error('Erro ao carregar versões', err);
        }
    }

    async function handleChangeStatus(newStatus: string) {
        try {
            setActionLoading(true);
            await api.patch(`/pcas/${id}/status`, {
                situacao: newStatus,
                justificativa: justificativa || undefined
            });
            setShowStatusModal(false);
            setShowCancelModal(false);
            setJustificativa('');
            await loadPca();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao alterar status');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCreateVersion() {
        try {
            setActionLoading(true);
            const response = await api.post(`/pcas/${id}/version`, { motivo });
            setShowVersionModal(false);
            setMotivo('');
            navigate(`/pcas/${response.data.pca.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar nova versão');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete() {
        try {
            setActionLoading(true);
            await api.delete(`/pcas/${id}`, {
                data: { justificativa }
            });
            setShowDeleteModal(false);
            navigate('/pcas');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao excluir PCA');
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando PCA..." />;
    if (error && !pca) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                <button onClick={() => navigate('/pcas')} className="ml-4 underline">
                    Voltar para lista
                </button>
            </div>
        );
    }
    if (!pca) return null;

    const isReadOnly = pca.situacao === 'ENCERRADO' || pca.situacao === 'CANCELADO';
    const statusInfo = STATUS_LABELS[pca.situacao] || { label: pca.situacao };
    const totalDemandas = pca.demandas?.length || 0;


    const DetailItem = ({ label, value, subValue }: { label: string; value: string | undefined | null; subValue?: string }) => (
        <div className="mb-4">
            <dt className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</dt>
            <dd className="text-gray-900 dark:text-gray-100 mt-1">{value || '-'}</dd>
            {subValue && <dd className="text-xs text-gray-500 dark:text-gray-400">{subValue}</dd>}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {pca.numero_pca}
                        </h1>
                        <StatusBadge status={pca.situacao} />
                        {pca.versao > 1 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-sm">
                                v{pca.versao}
                            </span>
                        )}
                    </div>
                    {pca.denominacao && (
                        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-medium">
                            {pca.denominacao}
                        </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {pca.orgao} • Ano {pca.ano}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/pcas')}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        ← Voltar
                    </button>
                    {canEdit && !isReadOnly && (
                        <button
                            onClick={() => navigate(`/pcas/${id}/edit`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                            ✏️ Editar
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            {/* Resumo Financeiro e Estatístico */}
            <PcaSummary pcaId={pca.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Vigência</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
                        {pca.periodo_vigencia_inicio ? new Date(pca.periodo_vigencia_inicio).toLocaleDateString('pt-BR') : '-'}
                        {' até '}
                        {pca.periodo_vigencia_fim ? new Date(pca.periodo_vigencia_fim).toLocaleDateString('pt-BR') : '-'}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Última Atualização</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-2">
                        {new Date(pca.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Informações Institucionais e Responsáveis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vinculação Institucional */}
                        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 h-full">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                🏛️ Vinculação Institucional
                            </h2>
                            <dl>
                                <DetailItem label="Unidade Demandante" value={pca.unidade_demandante} />
                                <DetailItem label="Área Técnica" value={pca.area_tecnica} />
                                <DetailItem label="Órgão" value={pca.orgao} />
                            </dl>
                        </div>

                        {/* Responsáveis */}
                        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 h-full">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                👤 Responsáveis
                            </h2>
                            <dl>
                                <DetailItem
                                    label="Elaboração"
                                    value={pca.responsavel?.nome_completo}
                                    subValue={pca.responsavel?.email}
                                />
                                <DetailItem
                                    label="Consolidação / Gestão"
                                    value={pca.responsavel_consolidacao?.nome_completo}
                                    subValue={pca.responsavel_consolidacao?.email}
                                />
                                {(pca.contato_email || pca.contato_telefone) && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
                                        <dt className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">Contatos Adicionais</dt>
                                        {pca.contato_email && <dd className="text-sm text-gray-900 dark:text-gray-100">📧 {pca.contato_email}</dd>}
                                        {pca.contato_telefone && <dd className="text-sm text-gray-900 dark:text-gray-100">📞 {pca.contato_telefone}</dd>}
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Aprovação */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            ✅ Dados da Aprovação
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DetailItem label="Autoridade" value={pca.autoridade_aprovadora} />
                            <DetailItem label="Cargo" value={pca.cargo_autoridade} />
                            <DetailItem label="Documento" value={pca.documento_aprovacao} />
                            <DetailItem
                                label="Data Aprovação"
                                value={pca.data_aprovacao ? new Date(pca.data_aprovacao).toLocaleDateString('pt-BR') : null}
                            />
                        </div>
                    </div>

                    {/* Observações e Histórico */}
                    {(pca.observacoes || pca.historico_alteracoes) && (
                        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                📝 Notas
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {pca.observacoes && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações Gerais</h3>
                                        <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-700/50 p-3 rounded-md whitespace-pre-wrap">
                                            {pca.observacoes}
                                        </p>
                                    </div>
                                )}
                                {pca.historico_alteracoes && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Histórico de Alterações</h3>
                                        <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-700/50 p-3 rounded-md whitespace-pre-wrap">
                                            {pca.historico_alteracoes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions Card */}
                    {canEdit && !isReadOnly && (
                        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                Ações do Workflow
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {statusInfo.nextStatus && (
                                    <button
                                        onClick={() => setShowStatusModal(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        ✓ {statusInfo.nextLabel}
                                    </button>
                                )}
                                {(pca.situacao === 'APROVADO' || pca.situacao === 'EM_EXECUCAO') && (
                                    <button
                                        onClick={() => setShowVersionModal(true)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-sm"
                                    >
                                        📋 Nova Versão
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors shadow-sm"
                                >
                                    ⏸️ Cancelar PCA
                                </button>
                                {totalDemandas === 0 && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        🗑️ Excluir PCA
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Demandas Table */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Demandas Vinculadas
                            </h2>
                            {canEdit && !isReadOnly && (
                                <Link
                                    to={`/demandas/new?pca_id=${id}`}
                                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-light transition-colors shadow-sm"
                                >
                                    + Nova Demanda
                                </Link>
                            )}
                        </div>
                        {pca.demandas && pca.demandas.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                                    <thead className="bg-gray-50 dark:bg-zinc-700/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Descrição
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Itens
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-800">
                                        {pca.demandas.map((demanda) => (
                                            <tr
                                                key={demanda.id}
                                                onClick={() => navigate(`/demandas/${demanda.id}`)}
                                                className="hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                                            >
                                                <td className="px-4 py-3 text-sm font-mono text-primary font-medium">
                                                    {demanda.codigo_demanda}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
                                                    {demanda.descricao}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={demanda.status} />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                    {demanda._count?.itens || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-zinc-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-600">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Nenhuma demanda cadastrada neste PCA.
                                </p>
                                {canEdit && !isReadOnly && (
                                    <Link
                                        to={`/demandas/new?pca_id=${id}`}
                                        className="mt-2 inline-block text-primary hover:underline font-medium"
                                    >
                                        Cadastrar primeira demanda
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Versions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Histórico de Versões
                        </h2>
                        {versions.length > 0 ? (
                            <div className="flex flex-col gap-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-700">
                                {versions.map((version) => (
                                    <div
                                        key={version.id}
                                        className={`p-4 rounded-lg border ml-8 relative before:absolute before:-left-8 before:top-1/2 before:-translate-y-1/2 before:w-8 before:h-0.5 before:bg-gray-200 dark:before:bg-zinc-700 ${version.id === Number(id)
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                                            }`}
                                    >
                                        <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-zinc-800 border-2 border-primary z-10"></div>

                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    v{version.versao}.0
                                                </span>
                                                {version.id === Number(id) && (
                                                    <span className="ml-2 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Atual</span>
                                                )}
                                            </div>
                                            <StatusBadge status={version.situacao} />
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {new Date(version.data_criacao).toLocaleDateString('pt-BR')} às {new Date(version.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {version.motivo_versao && (
                                            <div className="bg-gray-50 dark:bg-zinc-700/50 p-2 rounded text-xs text-gray-600 dark:text-gray-300 italic mb-2 border-l-2 border-gray-300 dark:border-zinc-600">
                                                "{version.motivo_versao}"
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Por: {version.responsavel?.nome_completo}
                                        </div>

                                        {version.id !== Number(id) && (
                                            <button
                                                onClick={() => navigate(`/pcas/${version.id}`)}
                                                className="w-full mt-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded hover:bg-primary/5 transition-colors"
                                            >
                                                Visualizar Versão
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 italic">
                                Sem histórico de versões.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => { setShowStatusModal(false); setJustificativa(''); }}
                title={`Alterar Status para "${statusInfo.nextLabel}"`}
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        Confirma a alteração do status do PCA {pca.numero_pca} para <span className="font-bold text-gray-900 dark:text-gray-100">"{statusInfo.nextLabel}"</span>?
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Justificativa (opcional)
                        </label>
                        <textarea
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-gray-100 focus:ring-primary focus:border-primary"
                            rows={3}
                            placeholder="Insira uma justificativa para esta mudança de status..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => { setShowStatusModal(false); setJustificativa(''); }}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => statusInfo.nextStatus && handleChangeStatus(statusInfo.nextStatus)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 shadow-sm"
                        >
                            {actionLoading ? 'Processando...' : 'Confirmar Alteração'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showCancelModal}
                onClose={() => { setShowCancelModal(false); setJustificativa(''); }}
                title="Cancelar PCA"
            >
                <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                ⚠️
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                                    Esta ação cancelará o PCA definitivamente.
                                </p>
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                    O PCA permanecerá no sistema para consulta histórica, mas não poderá receber novas demandas ou alterações.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Justificativa (obrigatória)
                        </label>
                        <textarea
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-gray-100 focus:ring-orange-500 focus:border-orange-500"
                            rows={3}
                            placeholder="Informe detalhadamente o motivo do cancelamento..."
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => { setShowCancelModal(false); setJustificativa(''); }}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => handleChangeStatus('CANCELADO')}
                            disabled={actionLoading || justificativa.length < 10}
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 shadow-sm"
                        >
                            {actionLoading ? 'Processando...' : 'Confirmar Cancelamento'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showVersionModal}
                onClose={() => { setShowVersionModal(false); setMotivo(''); }}
                title="Criar Nova Versão"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <span className="font-bold">Como funciona:</span> Será criada uma cópia deste PCA (v{pca.versao}) como v{pca.versao + 1}.
                            A nova versão iniciará com status "Em Elaboração" e herdará todas as demandas ativas.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Motivo da nova versão (obrigatório)
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                            rows={3}
                            placeholder="Ex: Ajuste de valores após análise de mercado, Inclusão de novas demandas..."
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => { setShowVersionModal(false); setMotivo(''); }}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateVersion}
                            disabled={actionLoading || motivo.length < 10}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 shadow-sm"
                        >
                            {actionLoading ? 'Criando...' : 'Criar Versão v' + (pca.versao + 1)}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setJustificativa(''); }}
                title="Excluir PCA"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0 text-red-500">
                                🗑️
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                    Atenção: Ação Irreversível
                                </h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                                    <p>Esta ação excluirá permanentemente o PCA e todo seu histórico.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Justificativa (opcional)
                        </label>
                        <textarea
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-gray-100 focus:ring-red-500 focus:border-red-500"
                            rows={3}
                            placeholder="Motivo da exclusão..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => { setShowDeleteModal(false); setJustificativa(''); }}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 shadow-sm"
                        >
                            {actionLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
