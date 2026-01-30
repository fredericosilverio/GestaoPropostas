import { PrismaClient } from '@prisma/client';
import { MarketAnalysisService } from './marketAnalysisService';

const prisma = new PrismaClient();
const marketAnalysisService = new MarketAnalysisService();

export class ItemService {
    async listByDemanda(demandaId: number) {
        return prisma.item.findMany({
            where: { demanda_id: demandaId },
            include: {
                precos: true,
                _count: { select: { precos: true } }
            },
            orderBy: { codigo_item: 'asc' }
        });
    }

    async findById(id: number) {
        return prisma.item.findUnique({
            where: { id },
            include: { precos: true }
        });
    }

    async create(data: any) {
        // Determine next item number for the demanda
        const lastItem = await prisma.item.findFirst({
            where: { demanda_id: data.demanda_id },
            orderBy: { codigo_item: 'desc' }
        });

        const codigo_item = lastItem ? lastItem.codigo_item + 1 : 1;

        const item = await prisma.item.create({
            data: {
                ...data,
                codigo_item
            }
        });

        // Trigger 1: Cadastrada -> Em Análise (First item)
        const count = await prisma.item.count({ where: { demanda_id: data.demanda_id } });
        if (count === 1) {
            const demanda = await prisma.demanda.findUnique({ where: { id: data.demanda_id } });
            if (demanda && demanda.status === 'CADASTRADA') {
                await prisma.demanda.update({
                    where: { id: data.demanda_id },
                    data: { status: 'EM_ANALISE' }
                });
            }
        }

        return item;
    }

    async update(id: number, data: any) {
        return prisma.item.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return prisma.item.delete({ where: { id } });
    }

    async calculateStats(itemId: number) {
        // 1. Fetch ALL active prices to calculate 
        const precos = await prisma.preco.findMany({
            where: { item_id: itemId, ativo: true },
        });

        if (precos.length === 0) return null;

        // 2. Calculate Stats
        const stats = marketAnalysisService.calculateStatistics(precos);

        // 3. Classify Prices based on new Median
        const classifiedPrices = marketAnalysisService.classifyPrices(precos, stats.mediana);

        // 4. Update Prices in DB with new Classification
        for (const p of classifiedPrices) {
            await prisma.preco.update({
                where: { id: p.id },
                data: {
                    classificacao: p.classificacao,
                    percentual_variacao: p.percentual_variacao
                }
            });
        }

        // 5. Update Item with new estimated value
        await prisma.item.update({
            where: { id: itemId },
            data: {
                valor_estimado_unitario: stats.mediana || stats.media,
            }
        });

        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (item && item.valor_estimado_unitario) {
            await prisma.item.update({
                where: { id: itemId },
                data: {
                    valor_estimado_total: Number(item.valor_estimado_unitario) * Number(item.quantidade)
                }
            });

            // Check Auto-transition to ESTIMADA
            await this.checkDemandaCompletion(item.demanda_id);
        }

        return stats;
    }

    private async checkDemandaCompletion(demandaId: number) {
        const demanda = await prisma.demanda.findUnique({
            where: { id: demandaId },
            include: { itens: { include: { _count: { select: { precos: true } } } } }
        });

        if (!demanda || demanda.status !== 'EM_ANALISE') return;

        // Check if ALL items have >= 3 prices
        // (Simplified check. Ideally we also check if they have valid estimated value > 0)
        const allItemsReady = demanda.itens.every(it => it._count.precos >= 3);

        if (allItemsReady && demanda.itens.length > 0) {
            await prisma.demanda.update({
                where: { id: demandaId },
                data: { status: 'ESTIMADA' }
            });
        }
    }
}
