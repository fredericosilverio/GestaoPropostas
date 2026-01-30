import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
    async getSummary(pcaId?: number) {
        // Filter by PCA if provided, otherwise all or current year
        const whereClause = pcaId ? { pca_id: pcaId } : {};

        // 1. Counts by Status
        const statusGroups = await prisma.demanda.groupBy({
            by: ['status'],
            where: whereClause,
            _count: { status: true },
            _sum: { valor_estimado_global: true } // Assuming global value is updated
        });

        // 2. Count Total
        const totalDemandas = await prisma.demanda.count({ where: whereClause });

        // 3. Format Counts
        const stats = {
            total: totalDemandas,
            byStatus: {} as any,
            totalValorEstimado: 0
        };

        statusGroups.forEach(g => {
            stats.byStatus[g.status] = g._count.status;
            // Note: valor_estimado_global in Demanda might be null if not using sum of items
            // If we rely on Demanda.valor_estimado_global being updated. 
            // Currently ItemService updates Item.valor_estimado_total, 
            // but does it update Demanda.valor_estimado_global? 
            // Answer: No, I haven't implemented aggregating Item totals to Demanda total yet.
            // I should do that or calc here potentially slow.
        });

        // 4. Calculate Total Value (Dynamic)
        // If Demanda.valor_estimado_global is not maintained, we sum Items.
        const itensSum = await prisma.item.aggregate({
            _sum: { valor_estimado_total: true },
            where: { demanda: whereClause }
        });
        stats.totalValorEstimado = Number(itensSum._sum.valor_estimado_total || 0);

        // 5. Alerts (Deadlines in next 30 days)
        const next30Days = new Date();
        next30Days.setDate(next30Days.getDate() + 30);

        const alertasPrazo = await prisma.demanda.findMany({
            where: {
                ...whereClause,
                status: { notIn: ['CONTRATADA', 'CANCELADA', 'SUSPENSA'] },
                data_prevista_contratacao: {
                    lte: next30Days,
                    gte: new Date()
                }
            },
            take: 5,
            select: { id: true, codigo_demanda: true, descricao: true, data_prevista_contratacao: true }
        });

        return {
            stats,
            alertas: alertasPrazo
        };
    }
}
