import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { ReportOptionsModal } from '../../components/ReportOptionsModal';
import type { MarketAnalysisReport } from '../../types/api';

export function ReportPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<MarketAnalysisReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.get(`/reports/market-analysis/${id}`)
            .then(res => setReport(res.data))
            .catch(err => {
                console.error(err);
                setError('Erro ao carregar relatório');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = async (filterType: 'all' | 'median25') => {
        try {
            setIsPdfLoading(true);
            const response = await api.get(`/reports/market-analysis/${id}/pdf?filterType=${filterType}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            const now = new Date();
            const timestamp = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') + "_" +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');

            link.setAttribute('download', `relatorio_analise_${report?.demanda?.codigo || id}_${timestamp}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsOptionsModalOpen(false);
        } catch (error) {
            console.error('Erro ao baixar PDF', error);
            alert('Erro ao gerar PDF. Verifique se o servidor está rodando.');
        } finally {
            setIsPdfLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await api.get(`/reports/market-analysis/${id}/export`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_analise_mercado_${report?.demanda?.codigo}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao baixar Excel', error);
            alert('Erro ao baixar Excel');
        }
    };

    if (loading) {
        return <LoadingOverlay message="Carregando relatório..." />;
    }

    if (error || !report) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-500 dark:text-gray-400">{error || 'Relatório não encontrado.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-primary hover:text-primary-light"
                >
                    ← Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-8">
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    &larr; Voltar
                </button>
                <div className="space-x-4">
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Imprimir
                    </button>
                    <button onClick={() => setIsOptionsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        PDF (Gerado)
                    </button>
                    <button onClick={handleExportExcel} className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 border border-green-700">
                        Excel
                    </button>
                </div>
            </div>

            {/* A4 Page Container */}
            <div ref={printRef} className="bg-white text-black p-[20mm] shadow-lg mx-auto max-w-[210mm] min-h-[297mm] print:shadow-none print:m-0 print:w-full">

                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-8 text-center">
                    <h1 className="text-2xl font-bold uppercase">Estado de Goiás</h1>
                    <h2 className="text-xl font-bold uppercase">{report.demanda.unidade_demandante}</h2>
                    <h3 className="text-lg mt-2">Relatório de Análise de Mercado</h3>
                </div>

                {/* Info Block */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                    <div>
                        <p><strong>Demanda:</strong> {report.demanda.codigo}</p>
                        <p><strong>PCA:</strong> {report.demanda.pca}</p>
                        <p><strong>Responsável:</strong> {report.demanda.responsavel}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>Data Emissão:</strong> {new Date(report.data_emissao).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> Estimada</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="font-bold mb-1">Objeto:</p>
                    <p className="text-justify text-sm bg-gray-50 p-2 border rounded">{report.demanda.descricao}</p>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <h4 className="font-bold text-lg mb-2 border-b border-gray-300 pb-1">Resumo dos Itens</h4>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="text-left p-2">Item</th>
                                <th className="text-left p-2">Descrição</th>
                                <th className="text-center p-2">Unid.</th>
                                <th className="text-right p-2">Qtd.</th>
                                <th className="text-right p-2">Valor Unit. (Est.)</th>
                                <th className="text-right p-2">Total (Est.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.itens.map((item: any) => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="p-2">{item.codigo_item}</td>
                                    <td className="p-2 line-clamp-2">{item.descricao_detalhada}</td>
                                    <td className="text-center p-2">{item.unidade_medida}</td>
                                    <td className="text-right p-2">{item.quantidade}</td>
                                    <td className="text-right p-2">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_estimado_unitario || 0)}
                                    </td>
                                    <td className="text-right p-2 font-bold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_estimado_final || 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                                <td colSpan={5} className="p-2 text-right">VALOR TOTAL ESTIMADO:</td>
                                <td className="p-2 text-right">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(report.resumo.valor_total_estimado)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Detailed Analysis */}
                <div className="mb-8">
                    <h4 className="font-bold text-lg mb-4 border-b border-gray-300 pb-1">Detalhamento da Composição de Preços</h4>
                    {report.itens.map((item: any) => (
                        <div key={item.id} className="mb-6 break-inside-avoid">
                            <div className="bg-gray-100 p-2 font-bold text-sm mb-2 border rounded">
                                Item {item.codigo_item}: {item.descricao_detalhada} (Quant: {item.quantidade} {item.unidade_medida})
                            </div>

                            <table className="w-full text-xs border border-gray-300 mb-2">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-1 border border-gray-300 text-left">Fonte</th>
                                        <th className="p-1 border border-gray-300 text-center">Data</th>
                                        <th className="p-1 border border-gray-300 text-right">Valor Unit.</th>
                                        <th className="p-1 border border-gray-300 text-center">Situação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.precos.map((preco: any) => (
                                        <tr key={preco.id}>
                                            <td className="p-1 border border-gray-300">{preco.fonte}</td>
                                            <td className="p-1 border border-gray-300 text-center">{new Date(preco.data_coleta).toLocaleDateString()}</td>
                                            <td className="p-1 border border-gray-300 text-right">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco.valor_unitario)}
                                            </td>
                                            <td className="p-1 border border-gray-300 text-center">
                                                {preco.classificacao === 'ACEITO' ? '✅ Aceito' :
                                                    preco.classificacao === 'ACIMA_DO_LIMITE' ? '🔴 Acima (+25%)' :
                                                        preco.classificacao === 'ABAIXO_DO_LIMITE' ? '🟡 Abaixo (-25%)' : '⚪ Inválido'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="bg-gray-50 p-2 text-xs border border-gray-200 rounded grid grid-cols-4 gap-4">
                                <div><strong>Média:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.media)}</div>
                                <div><strong>Mediana:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.mediana)}</div>
                                <div><strong>Desvio Padrão:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estatisticas.desvioPadrao)}</div>
                                <div><strong>CV:</strong> {(item.estatisticas?.cv ?? 0).toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Signature Area */}
                <div className="mt-16 text-center text-sm pt-8 break-inside-avoid">
                    <div className="grid grid-cols-2 gap-16">
                        <div className="border-t border-black pt-2">
                            <p>{report.demanda.responsavel}</p>
                            <p className="text-xs text-gray-500">Responsável pela Cotação</p>
                        </div>
                        <div className="border-t border-black pt-2">
                            <p>Gestor Responsável</p>
                            <p className="text-xs text-gray-500">Aprovação</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #report-content, #report-content * {
                            visibility: visible;
                        }
                        .print\\:hidden {
                            display: none;
                        }
                        .bg-gray-100 {
                            background-color: white !important; 
                        }
                    }
                `}
            </style>

            <ReportOptionsModal
                isOpen={isOptionsModalOpen}
                onClose={() => setIsOptionsModalOpen(false)}
                onGenerate={handleExportPDF}
                isLoading={isPdfLoading}
            />
        </div>
    );
}
