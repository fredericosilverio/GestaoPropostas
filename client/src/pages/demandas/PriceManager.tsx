import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AttachmentList } from '../../components/AttachmentList';
import { FornecedorSelect } from '../../components/FornecedorSelect';
import { useToast } from '../../contexts/ToastContext';
import { validateCNPJ, formatCNPJ } from '../../utils/validators';
import type { Preco, Anexo, Fornecedor } from '../../types/api';

export function PriceManager() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [prices, setPrices] = useState<Preco[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [fornecedorId, setFornecedorId] = useState<number | null>(null);
    const [valor, setValor] = useState('');
    const [fonte, setFonte] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [cnpjError, setCnpjError] = useState('');

    async function handleFornecedorChange(id: number | null) {
        setFornecedorId(id);
        if (id) {
            try {
                const res = await api.get(`/fornecedores/${id}`);
                const f: Fornecedor = res.data;
                setFonte(f.nome_fantasia || f.razao_social);
                setCnpj(f.cnpj);
            } catch (error) {
                console.error('Error fetching supplier', error);
            }
        } else {
            setFonte('');
            setCnpj('');
        }
    }

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    // File upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [expandedPriceId, setExpandedPriceId] = useState<number | null>(null);
    const [priceAttachments, setPriceAttachments] = useState<Record<number, Anexo[]>>({});

    useEffect(() => {
        loadData();
    }, [itemId]);

    async function loadData() {
        try {
            const pricesRes = await api.get(`/precos?item_id=${itemId}`);
            setPrices(pricesRes.data);
        } catch (err) {
            console.error(err);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar preços' });
        } finally {
            setLoading(false);
        }
    }

    async function refresh() {
        const res = await api.get(`/precos?item_id=${itemId}`);
        setPrices(res.data);
    }

    async function handleAddPrice(e: React.FormEvent) {
        e.preventDefault();

        // Validar anexo obrigatório
        if (selectedFiles.length === 0) {
            addToast({ type: 'error', title: 'Anexo Obrigatório', description: 'É necessário anexar ao menos 1 evidência (orçamento, print, proposta).' });
            return;
        }

        try {
            // 1. Criar o preço
            const precoRes = await api.post('/precos', {
                item_id: Number(itemId),
                valor_unitario: Number(valor),
                fonte,
                cnpj_fornecedor: cnpj,
                fornecedor_id: fornecedorId,
                tipo_fonte: 'COTACAO_FORNECEDOR',
                unidade_medida: 'UN',
                data_coleta: new Date(),
                classificacao: 'ACEITO'
            });

            const precoId = precoRes.data.id;

            // 2. Fazer upload dos anexos vinculados ao preço
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('entityType', 'PRECO');
                formData.append('entityId', precoId.toString());
                formData.append('descricao', file.name);

                await api.post('/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // 3. Limpar formulário
            setValor('');
            setFonte('');
            setCnpj('');
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';

            addToast({ type: 'success', title: 'Sucesso', description: `Cotação adicionada com ${selectedFiles.length} anexo(s)!` });
            refresh();
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
            addToast({ type: 'error', title: 'Erro', description: `Erro ao adicionar preço: ${errorMsg}` });
        }
    }

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
            addToast({ type: 'error', title: 'Limite de arquivos', description: 'Máximo de 5 arquivos por preço.' });
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }

    async function loadAttachments(precoId: number) {
        if (priceAttachments[precoId]) {
            setExpandedPriceId(expandedPriceId === precoId ? null : precoId);
            return;
        }
        try {
            const res = await api.get(`/uploads?entityType=PRECO&entityId=${precoId}`);
            setPriceAttachments(prev => ({ ...prev, [precoId]: res.data }));
            setExpandedPriceId(precoId);
        } catch {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar anexos' });
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await api.delete(`/precos/${deleteId}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Preço removido com sucesso!' });
            refresh();
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao remover preço' });
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    }

    if (loading) return <LoadingOverlay message="Carregando preços..." />;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gerenciar Preços do Item</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:text-primary-light text-sm"
                >
                    ← Voltar para Demanda
                </button>
            </div>

            {/* Prices Table */}
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Cotações Cadastradas</h2>
                {prices.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma cotação cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Variação</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonte</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anexos</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {prices.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.valor_unitario))}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <StatusBadge status={p.classificacao} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                                            {p.percentual_variacao ? `${Number(p.percentual_variacao).toFixed(1)}%` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            {p.fonte}
                                            <span className="block text-xs text-gray-400">{new Date(p.data_coleta).toLocaleDateString('pt-BR')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => loadAttachments(p.id)}
                                                className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                                            >
                                                📎 {expandedPriceId === p.id ? 'Ocultar' : 'Ver'}
                                            </button>
                                            {expandedPriceId === p.id && (
                                                <div className="mt-2">
                                                    <AttachmentList entityType="PRECO" entityId={p.id} refreshTrigger={0} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setDeleteId(p.id)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary" required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fornecedor (Cadastrado)</label>
                        <FornecedorSelect
                            value={fornecedorId}
                            onChange={handleFornecedorChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fonte / Fornecedor (Nome)</label>
                        <input
                            type="text" placeholder="Nome da Fonte"
                            value={fonte} onChange={e => setFonte(e.target.value)}
                            // Readonly if supplier selected? Or allow override? Readonly behaves better for consistency.
                            readOnly={!!fornecedorId}
                            className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary ${fornecedorId ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`} required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">CNPJ</label>
                        <div className="relative">
                            <input
                                type="text" placeholder="00.000.000/0000-00"
                                value={cnpj}
                                onChange={e => {
                                    if (fornecedorId) return; // Prevent edit if supplier selected
                                    const value = e.target.value;
                                    setCnpj(value);
                                    if (cnpjError) setCnpjError('');
                                }}
                                onBlur={() => {
                                    if (!fornecedorId && cnpj && cnpj.replace(/[^\d]/g, '').length > 0) {
                                        if (!validateCNPJ(cnpj)) {
                                            setCnpjError('CNPJ inválido');
                                        } else {
                                            setCnpjError('');
                                            setCnpj(formatCNPJ(cnpj));
                                        }
                                    }
                                }}
                                readOnly={!!fornecedorId}
                                className={`w-full px-3 py-2 border rounded dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary ${cnpjError
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : cnpj && validateCNPJ(cnpj)
                                        ? 'border-green-500'
                                        : 'border-gray-300 dark:border-zinc-600'
                                    } ${fornecedorId ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`}
                            />
                            {cnpj && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                                    {validateCNPJ(cnpj) ? '✅' : cnpj.replace(/[^\d]/g, '').length >= 14 ? '❌' : ''}
                                </span>
                            )}
                        </div>
                        {cnpjError && (
                            <p className="text-red-500 text-xs mt-1">{cnpjError}</p>
                        )}
                    </div>
                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Anexos (Obrigatório) *
                            <span className="text-gray-400 ml-2">PDF, JPG, PNG - Max 10MB cada, até 5 arquivos</span>
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
                                <span className="text-red-500 text-xs">⚠️ Adicione ao menos 1 evidência</span>
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
                    <div className="md:col-span-4 flex justify-end mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                            Adicionar Cotação
                        </button>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteId !== null}
                title="Remover Cotação"
                message="Tem certeza que deseja remover esta cotação? Esta ação não pode ser desfeita."
                confirmText="Remover"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
