import { useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface InitiateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    demandaId: number;
}

export function InitiateContractingModal({ isOpen, onClose, onSuccess, demandaId }: InitiateModalProps) {
    const [processo, setProcesso] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/initiate-contracting`, { numero_processo: processo });
            addToast({ type: 'success', title: 'Sucesso', description: 'Contratação iniciada com sucesso!' });
            onSuccess();
            onClose();
            setProcesso('');
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao iniciar contratação' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Iniciar Contratação</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Número do Processo Licitatório
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                            value={processo}
                            onChange={e => setProcesso(e.target.value)}
                            placeholder="Ex: 2024001234"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Salvando...' : 'Iniciar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface FinalizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    demandaId: number;
}

export function FinalizeContractModal({ isOpen, onClose, onSuccess, demandaId }: FinalizeModalProps) {
    const [formData, setFormData] = useState({
        numero_contrato: '',
        data_contrato: new Date().toISOString().split('T')[0],
        valor_contratado: '',
        cnpj_fornecedor: '',
        razao_social: ''
    });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/finalize-contract`, {
                ...formData,
                valor_contratado: Number(formData.valor_contratado)
            });
            addToast({ type: 'success', title: 'Sucesso', description: 'Contrato registrado com sucesso!' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao finalizar contrato' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-lg shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Registrar Contrato</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Número do Contrato</label>
                        <input
                            type="text" required
                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                            value={formData.numero_contrato}
                            onChange={e => setFormData({ ...formData, numero_contrato: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Data de Assinatura</label>
                        <input
                            type="date" required
                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                            value={formData.data_contrato}
                            onChange={e => setFormData({ ...formData, data_contrato: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Valor Contratado (R$)</label>
                        <input
                            type="number" step="0.01" required
                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                            value={formData.valor_contratado}
                            onChange={e => setFormData({ ...formData, valor_contratado: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">CNPJ Fornecedor</label>
                            <input
                                type="text" required
                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                                value={formData.cnpj_fornecedor}
                                onChange={e => setFormData({ ...formData, cnpj_fornecedor: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Razão Social</label>
                            <input
                                type="text" required
                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700 dark:text-white focus:ring-primary focus:border-primary"
                                value={formData.razao_social}
                                onChange={e => setFormData({ ...formData, razao_social: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Salvando...' : 'Confirmar Contratação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
