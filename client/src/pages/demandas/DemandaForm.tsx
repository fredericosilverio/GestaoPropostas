import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface PcaOption {
    id: number;
    ano: number;
    orgao: string;
}

export function DemandaForm() {
    const [pcaId, setPcaId] = useState('');
    const [pcas, setPcas] = useState<PcaOption[]>([]);
    const [descricao, setDescricao] = useState('');
    const [justificativaTecnica, setJustificativaTecnica] = useState('');
    const [justificativaAdministrativa, setJustificativaAdministrativa] = useState('');
    const [centroCusto, setCentroCusto] = useState('');
    const [prazoVigencia, setPrazoVigencia] = useState('');
    const [dataPrevista, setDataPrevista] = useState('');

    // Default enums (should ideally come from backend or shared constant)
    const [tipoContratacao, setTipoContratacao] = useState('NOVA');
    const [naturezaDespesa, setNaturezaDespesa] = useState('CUSTEIO');
    const [elementoDespesa, setElementoDespesa] = useState('');
    const [unidadeDemandante, setUnidadeDemandante] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadPcas();
    }, []);

    async function loadPcas() {
        try {
            const response = await api.get('/pcas');
            // Filter only active PCAs if needed
            setPcas(response.data);
        } catch (err) {
            console.error("Failed to load PCAs");
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!pcaId) {
            setError('Selecione um PCA');
            setLoading(false);
            return;
        }

        try {
            await api.post('/demandas', {
                pca_id: Number(pcaId),
                descricao,
                justificativa_tecnica: justificativaTecnica,
                justificativa_administrativa: justificativaAdministrativa,
                centro_custo: centroCusto,
                prazo_vigencia_meses: Number(prazoVigencia),
                data_prevista_contratacao: new Date(dataPrevista), // ISO String conversion handled by axios/backend?
                // Backend expects DateTime. JSON.stringify usually keeps ISO.
                tipo_contratacao: tipoContratacao,
                natureza_despesa: naturezaDespesa,
                elemento_despesa: elementoDespesa,
                unidade_demandante: unidadeDemandante
            });
            navigate('/demandas');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar Demanda');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Nova Demanda</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PCA Vinculado (Ano/Órgão)</label>
                        <select
                            value={pcaId}
                            onChange={e => setPcaId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        >
                            <option value="">Selecione...</option>
                            {pcas.map(pca => (
                                <option key={pca.id} value={pca.id}>{pca.ano} - {pca.orgao}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade Demandante</label>
                        <input
                            type="text"
                            value={unidadeDemandante}
                            onChange={e => setUnidadeDemandante(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Objeto (Descrição Resumida)</label>
                        <textarea
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Justificativa Técnica</label>
                        <textarea
                            value={justificativaTecnica}
                            onChange={e => setJustificativaTecnica(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Justificativa Administrativa</label>
                        <textarea
                            value={justificativaAdministrativa}
                            onChange={e => setJustificativaAdministrativa(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Centro de Custo</label>
                        <input
                            type="text"
                            value={centroCusto}
                            onChange={e => setCentroCusto(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Elemento de Despesa</label>
                        <input
                            type="text"
                            value={elementoDespesa}
                            onChange={e => setElementoDespesa(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prazo Vigência (meses)</label>
                        <input
                            type="number"
                            value={prazoVigencia}
                            onChange={e => setPrazoVigencia(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Prevista Contratação</label>
                        <input
                            type="date"
                            value={dataPrevista}
                            onChange={e => setDataPrevista(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Contratação</label>
                        <select
                            value={tipoContratacao}
                            onChange={e => setTipoContratacao(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        >
                            <option value="NOVA">Nova</option>
                            <option value="RENOVACAO">Renovação</option>
                            <option value="PRORROGACAO">Prorrogação</option>
                            <option value="ADESAO">Adesão (Carona)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Natureza Despesa</label>
                        <select
                            value={naturezaDespesa}
                            onChange={e => setNaturezaDespesa(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        >
                            <option value="CUSTEIO">Custeio</option>
                            <option value="INVESTIMENTO">Investimento</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-zinc-700">
                    <button
                        type="button"
                        onClick={() => navigate('/demandas')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
