import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { InitiateContractingModal, FinalizeContractModal } from './ContractingModals';
import { FileUploader } from '../../components/FileUploader';
import { AttachmentList } from '../../components/AttachmentList';
import { StatusTimeline } from '../../components/StatusTimeline';
import { useToast } from '../../contexts/ToastContext';

interface Item {
    id: number;
    codigo_item: number;
    descricao: string;
    unidade_medida: string;
    quantidade: number;
    valor_estimado_unitario: number;
    valor_estimado_total: number;
    observacoes?: string;
    _count: {
        precos: number;
    };
}

interface DemandaDetailType {
    id: number;
    codigo_demanda: string;
    descricao: string;
    status: string;
    pca?: {
        ano: number;
        orgao: string;
        numero_pca: string;
        versao: number;
    };
    valor_estimado_global?: number;
    observacoes?: string;
    itens: Item[];
}

export function DemandaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [demanda, setDemanda] = useState<DemandaDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInitiateModal, setShowInitiateModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [refreshAnexos, setRefreshAnexos] = useState(0);

    // Observations editing state
    const [editingObsItemId, setEditingObsItemId] = useState<number | null>(null);
    const [obsText, setObsText] = useState('');
    const [savingObs, setSavingObs] = useState(false);

    // General observations state
    const [editingGeneralObs, setEditingGeneralObs] = useState(false);
    const [generalObsText, setGeneralObsText] = useState('');
    const [savingGeneralObs, setSavingGeneralObs] = useState(false);

    useEffect(() => {
        loadDemanda();
    }, [id]);

    async function loadDemanda() {
        try {
            const response = await api.get(`/demandas/${id}`);
            const itemsResponse = await api.get(`/itens?demanda_id=${id}`);

            setDemanda({
                ...response.data,
                itens: itemsResponse.data
            });
        } catch (error) {
            console.error('Erro ao carregar demanda', error);
        } finally {
            setLoading(false);
        }
    }

    function startEditObs(item: Item) {
        setEditingObsItemId(item.id);
        setObsText(item.observacoes || '');
    }

    async function saveObservations(itemId: number) {
        setSavingObs(true);
        try {
            await api.put(`/itens/${itemId}`, { observacoes: obsText });
            addToast({ type: 'success', title: 'Sucesso', description: 'Observações salvas!' });
            setEditingObsItemId(null);
            loadDemanda();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao salvar observações' });
        } finally {
            setSavingObs(false);
        }
    }

    async function saveGeneralObs() {
        setSavingGeneralObs(true);
        try {
            await api.put(`/demandas/${id}`, { observacoes: generalObsText });
            addToast({ type: 'success', title: 'Sucesso', description: 'Observações gerais salvas!' });
            setEditingGeneralObs(false);
            loadDemanda();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao salvar observações gerais' });
        } finally {
            setSavingGeneralObs(false);
        }
    }

    if (loading) return <div>Carregando...</div>;
    if (!demanda) return <div>Demanda não encontrada</div>;

    const formattedValorEstimado = demanda.valor_estimado_global
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(demanda.valor_estimado_global))
        : 'Não informado';

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{demanda.codigo_demanda}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{demanda.descricao}</p>
                        {demanda.pca && (
                            <p className="text-sm text-gray-400 mt-1">
                                PCA: {demanda.pca.numero_pca}/{demanda.pca.ano} (v{demanda.pca.versao})
                            </p>
                        )}
                        <p className="text-sm text-gray-400">
                            Valor Estimado Global: <span className="font-medium">{formattedValorEstimado}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {demanda.status}
                        </span>
                        <button
                            onClick={() => navigate(`/reports/market-analysis/${id}`)}
                            className="text-sm bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded"
                        >
                            📄 Relatório
                        </button>
                        <button
                            onClick={() => navigate(`/demandas/${id}/proposta-lote`)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                            📝 Lançar Proposta
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Timeline */}
            <StatusTimeline demandaId={Number(id)} />

            {/* Anexos */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
                    📎 Anexos da Demanda
                    <span className="text-sm font-normal text-gray-500 ml-2">(inclui anexos de cotações)</span>
                </h2>
                <FileUploader
                    entityType="DEMANDA"
                    entityId={Number(id)}
                    onUploadSuccess={() => setRefreshAnexos(prev => prev + 1)}
                />
                <AttachmentList
                    entityType="DEMANDA"
                    entityId={Number(id)}
                    refreshTrigger={refreshAnexos}
                    consolidate={true}
                />
            </div>

            {/* Observações Gerais da Análise */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                        📋 Observações Gerais da Análise de Mercado
                    </h2>
                    {!editingGeneralObs && (
                        <button
                            onClick={() => {
                                setEditingGeneralObs(true);
                                setGeneralObsText(demanda.observacoes || '');
                            }}
                            className="text-sm text-primary hover:text-primary-dark"
                        >
                            ✏️ Editar
                        </button>
                    )}
                </div>
                {editingGeneralObs ? (
                    <div className="space-y-3">
                        <textarea
                            value={generalObsText}
                            onChange={e => setGeneralObsText(e.target.value)}
                            placeholder="Registre aqui observações gerais sobre a análise de mercado, metodologia aplicada, particularidades, ressalvas ou recomendações..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingGeneralObs(false)}
                                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveGeneralObs}
                                disabled={savingGeneralObs}
                                className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                                {savingGeneralObs ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {demanda.observacoes ? (
                            <p className="whitespace-pre-wrap bg-amber-50 dark:bg-amber-900/30 p-3 rounded border-l-4 border-amber-400">
                                {demanda.observacoes}
                            </p>
                        ) : (
                            <p className="text-gray-400 italic">Nenhuma observação geral registrada. Clique em "Editar" para adicionar.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                        Itens da Demanda ({demanda.itens.length})
                    </h2>
                    <div className="flex gap-2">
                        {['RASCUNHO', 'CADASTRADA', 'EM_ANALISE', 'EM_COTACAO'].includes(demanda.status) && (
                            <>
                                <button
                                    onClick={() => navigate(`/demandas/${id}/itens/novo`)}
                                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                >
                                    + Novo Item
                                </button>
                                {demanda.status === 'RASCUNHO' && (
                                    <button
                                        onClick={() => setShowInitiateModal(true)}
                                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        Publicar Demanda
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unid.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unit. (Est.)</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cotações</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Obs.</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {demanda.itens.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{item.codigo_item}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs">
                                        {item.descricao}
                                        {item.observacoes && editingObsItemId !== item.id && (
                                            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                                                📝 {item.observacoes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{item.unidade_medida}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{Number(item.quantidade)}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {item.valor_estimado_unitario ?
                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.valor_estimado_unitario)) : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item._count?.precos || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => startEditObs(item)}
                                            className={`text-sm px-2 py-1 rounded ${item.observacoes ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                            title="Editar observações de mercado"
                                        >
                                            {item.observacoes ? '📝' : '➕'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm">
                                        <button
                                            onClick={() => navigate(`/itens/${item.id}/precos`)}
                                            className="text-primary hover:text-primary-light font-medium">
                                            Gerenciar Preços
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Observations Modal */}
            {editingObsItemId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                            Observações de Análise de Mercado
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Registre particularidades ou observações relevantes que serão incluídas no relatório.
                        </p>
                        <textarea
                            value={obsText}
                            onChange={e => setObsText(e.target.value)}
                            placeholder="Ex: Preço do fornecedor X desconsiderado por estar fora da validade. Mediana utilizada como referência devido à alta dispersão."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white resize-none"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setEditingObsItemId(null)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => saveObservations(editingObsItemId)}
                                disabled={savingObs}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {savingObs ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {demanda && (
                <>
                    <InitiateContractingModal
                        isOpen={showInitiateModal}
                        onClose={() => setShowInitiateModal(false)}
                        onSuccess={loadDemanda}
                        demandaId={demanda.id}
                    />
                    <FinalizeContractModal
                        isOpen={showFinalizeModal}
                        onClose={() => setShowFinalizeModal(false)}
                        onSuccess={loadDemanda}
                        demandaId={demanda.id}
                    />
                </>
            )}
        </div>
    );
}
