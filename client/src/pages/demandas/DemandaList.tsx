import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface Demanda {
    id: number;
    codigo_demanda: string;
    descricao: string;
    status: string;
    valor_estimado_global: number;
    pca: {
        ano: number;
        orgao: string;
    };
    responsavel: {
        nome_completo: string;
    };
}

export function DemandaList() {
    const [demandas, setDemandas] = useState<Demanda[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDemandas();
    }, []);

    async function loadDemandas() {
        try {
            const response = await api.get('/demandas');
            setDemandas(response.data);
        } catch (error) {
            console.error('Erro ao carregar Demandas', error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Demandas de Contratação</h1>
                <button
                    onClick={() => navigate('/demandas/new')}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md shadow-sm transition-colors">
                    Nova Demanda
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PCA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor Estimado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responsável</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                        {demandas.map((demanda) => (
                            <tr key={demanda.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{demanda.codigo_demanda}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{demanda.pca?.ano} - {demanda.pca?.orgao}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={demanda.descricao}>{demanda.descricao}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {demanda.valor_estimado_global ?
                                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(demanda.valor_estimado_global))
                                        : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${demanda.status === 'CONTRATADA' ? 'bg-green-100 text-green-800' :
                                            demanda.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                                                demanda.status === 'EM_ANALISE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {demanda.status?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{demanda.responsavel?.nome_completo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary hover:text-primary-light mr-4">Editar</a>
                                    <button
                                        onClick={() => navigate(`/demandas/${demanda.id}`)}
                                        className="text-primary hover:text-primary-light">
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {demandas.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        Nenhuma demanda encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
