import { PrismaClient } from '@prisma/client';
import { MarketAnalysisService } from './marketAnalysisService';

const prisma = new PrismaClient();
const marketAnalysisService = new MarketAnalysisService();

export class ReportService {
    async generateMarketAnalysis(demandaId: number) {
        // Fetch Demanda with relations
        const demanda = await prisma.demanda.findUnique({
            where: { id: demandaId },
            include: {
                usuario: { // Responsável
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

        // Calculate/Format data for report
        const itensReport = demanda.itens.map(item => {
            const stats = marketAnalysisService.calculateStatistics(item.precos);

            return {
                ...item,
                precos: item.precos, // Already sorted
                estatisticas: stats,
                // Ensure latest classification is used or re-calculate if needed
                // (Assuming ItemService updates DB, we just use what's there or re-calc stats)
                valor_estimado_final: item.valor_estimado_total
            };
        });

        const valorTotalDemanda = itensReport.reduce((acc, item) => acc + Number(item.valor_estimado_final || 0), 0);

        return {
            titulo: 'Relatório de Análise de Mercado',
            data_emissao: new Date(),
            demanda: {
                id: demanda.id,
                codigo: demanda.codigo_demanda,
                descricao: demanda.descricao,
                justificativa: demanda.justificativa_tecnica,
                responsavel: demanda.usuario.nome_completo,
                pca: demanda.pca.ano,
                unidade_demandante: demanda.unidade_demandante,
                data_criacao: demanda.data_criacao
            },
            itens: itensReport,
            resumo: {
                total_itens: itensReport.length,
                valor_total_estimado: valorTotalDemanda
            }
        };
    }
}
