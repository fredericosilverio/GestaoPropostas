import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Fornecedor } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';

export function FornecedorList() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        loadFornecedores();
    }, [searchTerm, showOnlyActive]);

    async function loadFornecedores() {
        setLoading(true);
        try {
            const params: any = { search: searchTerm };
            if (showOnlyActive) {
                params.ativo = true;
            } else {
                params.ativo = 'all'; // Adjusted backend logic to handle this if needed, or backend ignores if undefined.
                // Re-checking controller: if 'ativo' is present it filters. If we want all, we should probably not send it or send undefined.
                // My controller logic: `req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined`
                // So if I want ALL, I should send nothing.
            }

            // Correction for ALL:
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (showOnlyActive) queryParams.append('ativo', 'true');

            const response = await api.get(`/fornecedores?${queryParams.toString()}`);
            setFornecedores(response.data);
        } catch (error) {
            console.error('Erro ao carregar fornecedores', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar lista de fornecedores' });
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(id: number) {
        try {
            await api.patch(`/fornecedores/${id}/toggle-status`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Status atualizado com sucesso' });
            loadFornecedores();
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao atualizar status' });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fornecedores</h1>
                <button
                    onClick={() => navigate('/fornecedores/novo')}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md transition-colors"
                >
                    + Novo Fornecedor
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por Razão Social, CNPJ ou Nome Fantasia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showOnlyActive"
                        checked={showOnlyActive}
                        onChange={(e) => setShowOnlyActive(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="showOnlyActive" className="text-sm text-gray-700 dark:text-gray-300">
                        Apenas Ativos
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingOverlay message="Carregando..." />
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social / Fantasia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                            {fornecedores.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Nenhum fornecedor encontrado.
                                    </td>
                                </tr>
                            ) : (
                                fornecedores.map((fornecedor) => (
                                    <tr key={fornecedor.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{fornecedor.razao_social}</div>
                                            {fornecedor.nome_fantasia && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{fornecedor.nome_fantasia}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {fornecedor.cnpj}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div>{fornecedor.responsavel_legal}</div>
                                            <div className="text-xs">{fornecedor.email_contato}</div>
                                            <div className="text-xs">{fornecedor.telefone_contato}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${fornecedor.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => navigate(`/fornecedores/${fornecedor.id}`)}
                                                    className="text-primary hover:text-primary-dark"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(fornecedor.id)}
                                                    className={`${fornecedor.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                    title={fornecedor.ativo ? 'Desativar' : 'Ativar'}
                                                >
                                                    {fornecedor.ativo ? '🚫' : '✅'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
