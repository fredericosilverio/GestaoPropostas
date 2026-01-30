import React, { useState } from 'react';
import { api } from '../../services/api';

interface InitiateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    demandaId: number;
}

export function InitiateContractingModal({ isOpen, onClose, onSuccess, demandaId }: InitiateModalProps) {
    const [processo, setProcesso] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/initiate-contracting`, { numero_processo: processo });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao iniciar contratação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Iniciar Contratação</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Número do Processo Licitatório</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded p-2 dark:bg-zinc-700 dark:border-zinc-600"
                            value={processo}
                            onChange={e => setProcesso(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
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

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/finalize-contract`, {
                ...formData,
                valor_contratado: Number(formData.valor_contratado)
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao finalizar contrato');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">Registrar Contrato</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Número do Contrato</label>
                        <input
                            type="text" required
                            className="w-full border rounded p-2 dark:bg-zinc-700"
                            value={formData.numero_contrato}
                            onChange={e => setFormData({ ...formData, numero_contrato: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Data de Assinatura</label>
                        <input
                            type="date" required
                            className="w-full border rounded p-2 dark:bg-zinc-700"
                            value={formData.data_contrato}
                            onChange={e => setFormData({ ...formData, data_contrato: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor Contratado (R$)</label>
                        <input
                            type="number" step="0.01" required
                            className="w-full border rounded p-2 dark:bg-zinc-700"
                            value={formData.valor_contratado}
                            onChange={e => setFormData({ ...formData, valor_contratado: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">CNPJ Fornecedor</label>
                            <input
                                type="text" required
                                className="w-full border rounded p-2 dark:bg-zinc-700"
                                value={formData.cnpj_fornecedor}
                                onChange={e => setFormData({ ...formData, cnpj_fornecedor: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Razão Social</label>
                            <input
                                type="text" required
                                className="w-full border rounded p-2 dark:bg-zinc-700"
                                value={formData.razao_social}
                                onChange={e => setFormData({ ...formData, razao_social: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                            {loading ? 'Salvando...' : 'Confirmar Contratação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
