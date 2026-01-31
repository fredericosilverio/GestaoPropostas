import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { InitiateContractingModal, FinalizeContractModal } from './ContractingModals';
import { FileUploader } from '../../components/FileUploader';
import { AttachmentList } from '../../components/AttachmentList';
import { StatusTimeline } from '../../components/StatusTimeline';

interface Item {
    id: number;
    codigo_item: number;
    descricao: string;
    unidade_medida: string;
    quantidade: number;
    valor_estimado_unitario: number;
    valor_estimado_total: number;
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
    itens: Item[];
}

export function DemandaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [demanda, setDemanda] = useState<DemandaDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInitiateModal, setShowInitiateModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [refreshAnexos, setRefreshAnexos] = useState(0);

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

    if (loading) return <div>Carregando...</div>;
    if (!demanda) return <div>Demanda não encontrada</div>;

    const formattedValorEstimado = demanda.valor_estimado_global
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(demanda.valor_estimado_global))
        : 'Não informado';

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{demanda.codigo_demanda}</h1>
                            {demanda.pca && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    PCA {demanda.pca.ano} - {demanda.pca.orgao} (v{demanda.pca.versao})
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{demanda.descricao}</p>

                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div>
                                <span className="font-medium text-gray-900 dark:text-gray-300">Valor Estimado:</span>
                                <span className="ml-2 text-gray-900 dark:text-gray-200 font-semibold">{formattedValorEstimado}</span>
                            </div>
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap
                         ${demanda.status === 'CONTRATADA' ? 'bg-green-100 text-green-800' :
                            demanda.status === 'EM_CONTRATACAO' ? 'bg-orange-100 text-orange-800' :
                                demanda.status === 'ESTIMADA' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {demanda.status}
                    </span>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-700 pt-4">
                    {/* Report Button */}
                    <button
                        onClick={() => navigate(`/reports/market-analysis/${demanda.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
                        <span>📊</span> Relatório
                    </button>

                    {/* Contracting Buttons */}
                    {demanda.status === 'ESTIMADA' && (
                        <button
                            onClick={() => setShowInitiateModal(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm">
                            Iniciar Contratação
                        </button>
                    )}

                    {demanda.status === 'EM_CONTRATACAO' && (
                        <button
                            onClick={() => setShowFinalizeModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                            Registrar Contrato
                        </button>
                    )}
                </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Anexos e Documentos</h2>
                    <FileUploader
                        entityType="DEMANDA"
                        entityId={demanda.id}
                        onUploadSuccess={() => setRefreshAnexos(n => n + 1)}
                    />
                </div>
                <AttachmentList
                    entityType="DEMANDA"
                    entityId={demanda.id}
                    refreshTrigger={refreshAnexos}
                />
            </div>

            {/* Histórico de Status */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Histórico de Status</h2>
                <StatusTimeline demandaId={demanda.id} />
            </div>

            {/* List Items */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Itens da Demanda</h2>
                    <div className="flex gap-2">
                        {demanda.status !== 'CONTRATADA' && (
                            <>
                                <button
                                    onClick={() => navigate(`/demandas/${id}/proposta-lote`)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
                                    <span>💰</span> Lançar Proposta (Lote)
                                </button>
                                <button
                                    onClick={() => navigate(`/demandas/${id}/itens/novo`)}
                                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm">
                                    Adicionar Item
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unid.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unit. (Est.)</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cotações</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {demanda.itens.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.codigo_item}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.descricao}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.unidade_medida}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{Number(item.quantidade)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {item.valor_estimado_unitario ?
                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.valor_estimado_unitario)) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item._count?.precos || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
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
