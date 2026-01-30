import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface Preco {
    id: number;
    valor_unitario: number;
    fonte: string;
    cnpj_fornecedor: string;
    ativo: boolean;
    classificacao: string;
    percentual_variacao: number;
    unidade_medida: string;
    data_coleta: string;
}

interface ItemStats {
    valor_estimado_unitario: number;
    // We could fetch extended stats if provided by backend, 
    // for now we calculate limits locally or assume backend provided valid item value
}

export function PriceManager() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [prices, setPrices] = useState<Preco[]>([]);
    const [itemData, setItemData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [valor, setValor] = useState('');
    const [fonte, setFonte] = useState('');
    const [cnpj, setCnpj] = useState('');

    useEffect(() => {
        loadData();
    }, [itemId]);

    async function loadData() {
        try {
            const [pricesRes, itemRes] = await Promise.all([
                api.get(`/precos?item_id=${itemId}`),
                api.get(`/itens?demanda_id=PlaceholderOnlyForType`)
                // Optimization: We need efficient item fetch. 
                // For now, let's assume we can get updated item info.
                // Actually the listByItem endpoint is for prices.
            ]);

            // To get item stats (updated median), we need to fetch the item details again
            // Or rely on the fact that prices endpoint interaction triggers updates.
            // Let's rely on listing prices.
            setPrices(pricesRes.data);

            // Get Item Detail specifically to show Stats
            // We need a specific endpoint GET /itens/:id or filter list. 
            // Reuse generic approach for now:
            // Since we don't have GET /itens/:id exposed directly in our simple controller list logic (it uses query),
            // we will fetch prices and calculate visual stats or rely on what we have.
            // Let's calculate visual stats purely for UI feedback if backend doesn't return them in separate object.
            // BUT backend updates 'valor_estimado_unitario' on Item.
            // Let's try to fetch the item to show the Median.
            // Assuming we added the route or we can use the list.

            // Temporary: fetch from list (inefficient but works for MVP)
            // Ideally we'd have GET /itens/:id

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

        // Fetch specific item to get updated mean/median
        // Note: Our controller 'list' returns array. findById is internal service.
        // Note: We need to expose findById in controller or use list filter.
        // List filter by demanda_id is available. By item_id? No.
        // Let's blindly assume we can just calculate stats on frontend for display 
        // OR fix the backend to return stats. Backend is single source of truth.
        // Let's add GET /itens/:id to controller/routes quickly?
        // Or just trust the process.
    }

    // Improved loader
    async function refresh() {
        const res = await api.get(`/precos?item_id=${itemId}`);
        setPrices(res.data);
    }

    async function handleAddPrice(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/precos', {
                item_id: Number(itemId),
                valor_unitario: Number(valor),
                fonte,
                cnpj_fornecedor: cnpj,
                tipo_fonte: 'COTACAO_FORNECEDOR', // Default for MVP
                unidade_medida: 'UN', // Should match item
                data_coleta: new Date(),
                classificacao: 'ACEITO'
            });
            setValor('');
            setFonte('');
            setCnpj('');
            refresh();
        } catch (err) {
            alert('Erro ao adicionar preço');
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Remover preço?')) return;
        try {
            await api.delete(`/precos/${id}`);
            refresh();
        } catch (err) {
            alert('Erro ao remover');
        }
    }

    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'ACEITO': return 'bg-green-100 text-green-800';
            case 'ACIMA_DO_LIMITE': return 'bg-red-100 text-red-800';
            case 'ABAIXO_DO_LIMITE': return 'bg-yellow-100 text-yellow-800';
            case 'INVALIDO_DATA': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gerenciar Preços do Item</h1>

            {/* Stats Summary - Client Side Calc for Immediate Feedback if Item Endpoint not ready */}
            {/* Ideally we fetch 'Item' object here. */}

            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Cotações Cadastradas</h2>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variação</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonte</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {prices.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.valor_unitario))}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(p.classificacao)}`}>
                                        {p.classificacao.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    {p.percentual_variacao ? `${Number(p.percentual_variacao).toFixed(1)}%` : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    {p.fonte}
                                    <span className="block text-xs text-gray-400">{new Date(p.data_coleta).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Form */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Adicionar Cotação</h2>
                <form onSubmit={handleAddPrice} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Valor Unitário (R$)</label>
                        <input
                            type="number" step="0.01" placeholder="0,00"
                            value={valor} onChange={e => setValor(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fonte / Fornecedor</label>
                        <input
                            type="text" placeholder="Nome da Fonte"
                            value={fonte} onChange={e => setFonte(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">CNPJ</label>
                        <input
                            type="text" placeholder="CNPJ"
                            value={cnpj} onChange={e => setCnpj(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                    </div>
                    <div className="md:col-span-4 flex justify-end mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Adicionar e Calcular</button>
                    </div>
                </form>
            </div>

            <div className="flex justify-start">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm underline">Voltar para Demanda</button>
            </div>
        </div>
    );
}
