import { PrismaClient } from '@prisma/client';
import { MarketAnalysisService } from './marketAnalysisService';
import moment from 'moment';

const prisma = new PrismaClient();
const marketAnalysisService = new MarketAnalysisService();

export class ReportService {
    async generateMarketAnalysis(demandaId: number) {
        // Fetch Demanda with relations
        const demanda = await prisma.demanda.findUnique({
            where: { id: demandaId },
            include: {
                responsavel: {
                    select: { nome_completo: true, email: true }
                },
                pca: true,
                itens: {
                    include: {
                        precos: {
                            where: { ativo: true },
                            orderBy: { valor_unitario: 'asc' }
                        }
                    },
                    orderBy: { codigo_item: 'asc' }
                }
            }
        });

        if (!demanda) {
            throw new Error('Demanda não encontrada');
        }

        // Calculate/Format data for report using ±25% median fallback (same as PDF)
        const itensReport = demanda.itens.map(item => {
            // Step 1: Calculate base statistics from ALL prices (for median reference)
            const baseStats = marketAnalysisService.calculateStatistics(item.precos);

            // Step 2: Classify prices using the base median
            const classifiedPrices = marketAnalysisService.classifyPrices(item.precos, baseStats.mediana);

            // Step 3: Filter to accepted prices only (±25% of median)
            let precosParaCalculo = classifiedPrices;
            const precosAceitos = classifiedPrices.filter((p: any) => p.classificacao === 'ACEITO');

            let usouFallback = false;
            if (precosAceitos.length > 0) {
                precosParaCalculo = precosAceitos;
            } else {
                // Fallback: use all prices when no accepted prices exist
                precosParaCalculo = classifiedPrices;
                usouFallback = true;
            }

            // Step 4: Recalculate statistics from filtered prices
            const filteredStats = marketAnalysisService.calculateStatistics(precosParaCalculo);

            // Step 5: Use filtered mean as estimated unit value
            const valorUnitario = filteredStats.media ? Number(filteredStats.media.toFixed(2)) : 0;
            const valorTotal = Number((valorUnitario * Number(item.quantidade)).toFixed(2));

            return {
                ...item,
                precos: classifiedPrices, // Include classification info for display
                estatisticas: {
                    ...filteredStats,
                    // Also include base median for reference
                    medianaBase: baseStats.mediana,
                    limiteInferior: baseStats.mediana * 0.75,
                    limiteSuperior: baseStats.mediana * 1.25,
                    usouFallback
                },
                valor_estimado_unitario: valorUnitario,
                valor_estimado_final: valorTotal,
                valor_estimado_total: valorTotal,
                descricao_detalhada: `${item.descricao}${item.especificacoes_tecnicas ? ' - ' + item.especificacoes_tecnicas : ''}`
            };
        });

        const valorTotalDemanda = itensReport.reduce((acc, item) => acc + Number(item.valor_estimado_final || 0), 0);

        return {
            titulo: 'Relatório de Análise de Mercado',
            data_emissao: moment().utcOffset(-3).toDate(),
            demanda: {
                id: demanda.id,
                codigo: demanda.codigo_demanda,
                descricao: demanda.descricao,
                justificativa: demanda.justificativa_tecnica,
                responsavel: demanda.responsavel.nome_completo,
                pca: demanda.pca.numero_pca ? `${demanda.pca.numero_pca}/${demanda.pca.ano}` : demanda.pca.ano,
                unidade_demandante: demanda.unidade_demandante,
                data_criacao: demanda.created_at
            },
            itens: itensReport,
            resumo: {
                total_itens: itensReport.length,
                valor_total_estimado: valorTotalDemanda
            }
        };
    }
}
