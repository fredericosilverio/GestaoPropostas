import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

export function ItemForm() {
    const { demandaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [unidade, setUnidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [elementoDespesa, setElementoDespesa] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/itens', {
                demanda_id: Number(demandaId),
                descricao,
                unidade_medida: unidade,
                quantidade: Number(quantidade),
                elemento_despesa: elementoDespesa
                // Other fields optional or calculated
            });
            navigate(`/demandas/${demandaId}`);
        } catch (error) {
            console.error(error);
            alert('Erro ao criar item');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow p-8">
            <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Novo Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                    <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                        <input type="text" value={unidade} onChange={e => setUnidade(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
                        <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Elemento Despesa</label>
                    <input type="text" value={elementoDespesa} onChange={e => setElementoDespesa(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100" required />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md transition-colors">Salvar</button>
                </div>
            </form>
        </div>
    );
}
