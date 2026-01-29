import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Pca {
    id: number;
    ano: number;
    orgao: string;
    situacao: string;
    versao: number;
    responsavel: {
        nome_completo: string;
    };
    _count: {
        demandas: number;
    }
}

export function PcaList() {
    const [pcas, setPcas] = useState<Pca[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const canCreate = user?.perfil === 'ADMIN' || user?.perfil === 'GESTOR';

    useEffect(() => {
        loadPcas();
    }, []);

    async function loadPcas() {
        try {
            const response = await api.get('/pcas');
            setPcas(response.data);
        } catch (error) {
            console.error('Erro ao carregar PCAs', error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Planos de Contratação Anual</h1>
                {canCreate && (
                    <button
                        onClick={() => navigate('/pcas/new')}
                        className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md shadow-sm transition-colors">
                        Novo PCA
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ano</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Órgão</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Situação</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Versão</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demandas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responsável</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                        {pcas.map((pca) => (
                            <tr key={pca.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{pca.ano}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pca.orgao}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${pca.situacao === 'APROVADO' ? 'bg-green-100 text-green-800' :
                                            pca.situacao === 'EM_ELABORACAO' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {pca.situacao?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pca.versao}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pca._count?.demandas || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pca.responsavel?.nome_completo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary hover:text-primary-light mr-4">Editar</a>
                                    <a href="#" className="text-primary hover:text-primary-light">Demandas</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pcas.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        Nenhum PCA encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
