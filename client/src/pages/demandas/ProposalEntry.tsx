import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { FornecedorSelect } from '../../components/FornecedorSelect';
import type { Item, TipoFonte } from '../../types/api';

const TIPO_FONTE_OPTIONS: { value: TipoFonte; label: string }[] = [
    { value: 'COTACAO_FORNECEDOR', label: 'Cotação de Fornecedor' },
    { value: 'PAINEL_PRECOS', label: 'Painel de Preços' },
    { value: 'BANCO_PRECOS', label: 'Banco de Preços' },
    { value: 'CONTRATACAO_SIMILAR', label: 'Contratação Similar' },
    { value: 'NOTA_FISCAL', label: 'Nota Fiscal' },
    { value: 'OUTROS', label: 'Outros' },
];

interface ProposalItem {
    item_id: number;
    codigo_item: number;
    descricao: string;
    quantidade: number;
    unidade_medida: string;
    valor_unitario: string;
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
    const [tipoFonte, setTipoFonte] = useState<TipoFonte>('COTACAO_FORNECEDOR');
    const [linkFonte, setLinkFonte] = useState('');

    // File upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        // Validar tamanho (max 10MB cada)
        const validFiles = files.filter(f => {
            if (f.size > 10 * 1024 * 1024) {
                addToast({ type: 'error', title: 'Arquivo muito grande', description: `${f.name} excede 10MB` });
                return false;
            }
            return true;
        });

        // Limitar a 5 arquivos
        if (selectedFiles.length + validFiles.length > 5) {
            addToast({ type: 'error', title: 'Limite de arquivos', description: 'Máximo de 5 arquivos por proposta.' });
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }

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
            }));

        if (itemsToSave.length === 0) {
            addToast({ type: 'error', title: 'Atenção', description: 'Preencha ao menos um valor de item.' });
            return;
        }

        setSubmitting(true);
        try {
            // 1. Criar os preços em lote
            const response = await api.post('/precos/batch-entry', {
                fornecedor_id: fornecedorId,
                data_coleta: dataProposta,
                tipo_fonte: tipoFonte,
                link_fonte: linkFonte || null,
                itens: itemsToSave
            });

            const createdCount = response.data.count || itemsToSave.length;

            // 2. Upload dos anexos vinculados aos preços criados
            // Como o batch cria múltiplos preços, vincularemos o anexo à demanda como um todo
            // Alternativamente, se o backend retornar IDs, poderíamos vincular a cada preço
            // Por ora, vinculamos ao primeiro item como referência
            if (response.data.preco_ids && response.data.preco_ids.length > 0) {
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('entityType', 'PRECO');
                    formData.append('entityId', response.data.preco_ids[0].toString());
                    formData.append('descricao', `Proposta Lote - ${file.name}`);

                    await api.post('/uploads', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            addToast({ type: 'success', title: 'Sucesso', description: `Proposta registrada com ${createdCount} item(s) e ${selectedFiles.length} anexo(s)!` });
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fornecedor *
                        </label>
                        <FornecedorSelect
                            value={fornecedorId}
                            onChange={setFornecedorId}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data da Proposta *
                        </label>
                        <input
                            type="date"
                            value={dataProposta}
                            onChange={e => setDataProposta(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Fonte *
                        </label>
                        <select
                            value={tipoFonte}
                            onChange={e => setTipoFonte(e.target.value as TipoFonte)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md"
                        >
                            {TIPO_FONTE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Link do Edital */}
                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🔗 Link do Edital / Fonte Pública
                    </label>
                    <input
                        type="url"
                        placeholder="https://exemplo.gov.br/edital/123"
                        value={linkFonte}
                        onChange={e => setLinkFonte(e.target.value)}
                        className="w-full md:w-1/2 px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md"
                    />
                </div>

                {/* Evidence Upload */}
                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📎 Anexos de Evidência (Opcional)
                        <span className="text-gray-400 ml-2 font-normal">PDF, JPG, PNG - Max 10MB cada, até 5 arquivos</span>
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded inline-flex items-center text-sm"
                        >
                            📎 Selecionar Arquivos
                        </button>
                        {selectedFiles.length === 0 && (
                            <span className="text-red-500 text-xs">⚠️ Adicione ao menos 1 evidência (proposta/orçamento)</span>
                        )}
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                    📄 {file.name}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                                        disabled
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
