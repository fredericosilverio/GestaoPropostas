import { useState } from 'react';
import { Modal } from './Modal';

interface ReportOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (filterType: 'all' | 'median25') => void;
    isLoading?: boolean;
}

export function ReportOptionsModal({ isOpen, onClose, onGenerate, isLoading }: ReportOptionsModalProps) {
    const [filterType, setFilterType] = useState<'all' | 'median25'>('all');

    const handleGenerate = () => {
        onGenerate(filterType);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Opções do Relatório">
            <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecione como os valores devem ser considerados na análise:
                </p>

                <div className="space-y-4">
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <input
                            type="radio"
                            name="filterType"
                            value="all"
                            checked={filterType === 'all'}
                            onChange={() => setFilterType('all')}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Considerar todos os valores
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Todos os preços coletados serão utilizados no cálculo das estatísticas
                                (média, mediana, desvio padrão).
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <input
                            type="radio"
                            name="filterType"
                            value="median25"
                            checked={filterType === 'median25'}
                            onChange={() => setFilterType('median25')}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Considerar apenas valores no intervalo de ±25% da mediana
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Apenas preços classificados como "Aceito" (dentro do intervalo de ±25%
                                da mediana) serão utilizados nos cálculos.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Gerando...
                            </>
                        ) : (
                            'Gerar PDF'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
