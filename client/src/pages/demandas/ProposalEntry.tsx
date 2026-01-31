import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { FornecedorSelect } from '../../components/FornecedorSelect';
import type { Item } from '../../types/api';

interface ProposalItem {
    item_id: number;
    codigo_item: number;
    descricao: string;
    quantidade: number;
    unidade_medida: string;
    valor_unitario: string; // String for input handling
    marca: string;
}

export function ProposalEntry() {
    const { id } = useParams(); // Demanda ID
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Header Data
    const [fornecedorId, setFornecedorId] = useState<number | null>(null);
    const [dataProposta, setDataProposta] = useState(new Date().toISOString().split('T')[0]);

    // Items Data
    const [items, setItems] = useState<ProposalItem[]>([]);

    useEffect(() => {
        loadDemandaItems();
    }, [id]);

    async function loadDemandaItems() {
        try {
            const response = await api.get(`/demandas/${id}`);
            const demandaItems: Item[] = response.data.itens;

            // Map to local state
            setItems(demandaItems.map(item => ({
                item_id: item.id,
                codigo_item: item.codigo_item,
                descricao: item.descricao,
                quantidade: item.quantidade,
                unidade_medida: item.unidade_medida,
                valor_unitario: '',
                marca: ''
            })));
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar itens da demanda' });
            navigate(`/demandas/${id}`);
        } finally {
            setLoading(false);
        }
    }

    const handleItemChange = (index: number, field: keyof ProposalItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!fornecedorId) {
            addToast({ type: 'error', title: 'Atenção', description: 'Selecione um fornecedor' });
            return;
        }

        const itemsToSave = items
            .filter(item => item.valor_unitario && parseFloat(item.valor_unitario) > 0)
            .map(item => ({
                item_id: item.item_id,
                valor_unitario: parseFloat(item.valor_unitario),
                // Using 'fonte' or 'numero_referencia' to store brand (optional hack if schema doesn't support marca)
                // Actually, backend creates Preco but we didn't add 'marca' field.
                // We'll ignore 'marca' for now or assume backend ignores it implicitly if not in body
                // BUT we updated Controller to accept body. Frontend sends standard fields?
                // Backend 'createBatch' expects { fornecedor_id, data_coleta, itens: [{ item_id, valor_unitario }] }
                // So 'marca' is not saved yet. 
                // Suggestion: Save 'marca' in 'numero_referencia' or 'observacoes' if critical.
                // I will skip 'marca' persistence for this MVP step to avoid schema complexity mid-flight.
            }));

        if (itemsToSave.length === 0) {
            addToast({ type: 'error', title: 'Atenção', description: 'Preencha ao menos um valor de item.' });
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/precos/batch-entry', {
                fornecedor_id: fornecedorId,
                data_coleta: dataProposta,
                itens: itemsToSave
            });

            addToast({ type: 'success', title: 'Sucesso', description: 'Proposta registrada com sucesso!' });
            navigate(`/demandas/${id}`);
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', description: error.response?.data?.error || 'Erro ao salvar proposta' });
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando itens..." />;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate(`/demandas/${id}`)}
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
                    >
                        <span className="mr-1">←</span>
                        Voltar para Demanda
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Lançamento de Proposta em Lote
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-50"
                >
                    <span className="mr-2">💾</span>
                    {submitting ? 'Salvando...' : 'Salvar Proposta'}
                </button>
            </div>

            {/* Config Panel */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fornecedor
                        </label>
                        <FornecedorSelect
                            value={fornecedorId}
                            onChange={setFornecedorId}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data da Proposta
                        </label>
                        <input
                            type="date"
                            value={dataProposta}
                            onChange={e => setDataProposta(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="bg-gray-50 dark:bg-zinc-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Qtd.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Valor Unit. (R$)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Modelo (Opcional)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                        {items.map((item, index) => (
                            <tr key={item.item_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {item.codigo_item}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {item.descricao}
                                    <span className="block text-xs text-gray-500">{item.unidade_medida}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {item.quantidade}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0,00"
                                        value={item.valor_unitario}
                                        onChange={e => handleItemChange(index, 'valor_unitario', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-primary focus:border-primary dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        placeholder="Marca ofertada"
                                        value={item.marca}
                                        onChange={e => handleItemChange(index, 'marca', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-primary focus:border-primary dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        disabled // Disabled for now as backend support isn't ready
                                        title="Recurso de marca em breve"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md shadow-lg text-lg font-medium disabled:opacity-50"
                >
                    <span className="mr-2">💾</span>
                    Salvar Proposta
                </button>
            </div>
        </div>
    );
}
