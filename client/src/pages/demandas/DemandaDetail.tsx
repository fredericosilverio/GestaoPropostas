import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { InitiateContractingModal, FinalizeContractModal } from './ContractingModals';

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
    itens: Item[];
}



export function DemandaDetail() {
    const navigate = useNavigate();
    const [demanda, setDemanda] = useState<DemandaDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInitiateModal, setShowInitiateModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);

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

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{demanda.codigo_demanda}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{demanda.descricao}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                         ${demanda.status === 'CONTRATADA' ? 'bg-green-100 text-green-800' :
                            demanda.status === 'EM_CONTRATACAO' ? 'bg-orange-100 text-orange-800' :
                                demanda.status === 'ESTIMADA' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {demanda.status}
                    </span>
                </div>

                <div className="mt-4 flex justify-end gap-3">
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

            {/* List Items ... */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Itens da Demanda</h2>
                    {demanda.status !== 'CONTRATADA' && (
                        <button
                            onClick={() => navigate(`/demandas/${id}/itens/novo`)}
                            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-sm">
                            Adicionar Item
                        </button>
                    )}
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
