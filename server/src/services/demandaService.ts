import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DemandaService {
    async list(filters?: any) {
        return prisma.demanda.findMany({
            where: filters,
            include: {
                pca: {
                    select: { ano: true, numero_pca: true, orgao: true }
                },
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                _count: {
                    select: { itens: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    async findById(id: number) {
        return prisma.demanda.findUnique({
            where: { id },
            include: {
                pca: true,
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                itens: true
            }
        });
    }

    async create(data: any, userId: number) {
        // Generate unique code: D-{YEAR}-{RANDOM}
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const codigo_demanda = `D-${year}-${random}`;

        // Ensure PCA exists
        const pca = await prisma.pca.findUnique({ where: { id: data.pca_id } });
        if (!pca) throw new Error('PCA não encontrado');

        return prisma.demanda.create({
            data: {
                ...data,
                codigo_demanda,
                numero_projeto: Math.floor(Math.random() * 1000), // Should be sequential but random for now
                responsavel_id: userId,
                status: 'CADASTRADA'
            }
        });
    }

    async update(id: number, data: any) {
        return prisma.demanda.update({
            where: { id },
            data
        });
    }

    async changeStatus(id: number, newStatus: string, userId: number, justificativa?: string) {
        const demanda = await prisma.demanda.findUnique({ where: { id } });
        if (!demanda) throw new Error('Demanda não encontrada');

        const validTransitions: Record<string, string[]> = {
            'CADASTRADA': ['EM_ANALISE', 'CANCELADA'],
            'EM_ANALISE': ['ESTIMADA', 'CADASTRADA', 'CANCELADA'], // Back to Cadastrada for corrections
            'ESTIMADA': ['EM_CONTRATACAO', 'EM_ANALISE', 'CANCELADA'],
            'EM_CONTRATACAO': ['CONTRATADA', 'SUSPENSA', 'CANCELADA'],
            'CONTRATADA': [],
            'SUSPENSA': ['EM_CONTRATACAO', 'CANCELADA'],
            'CANCELADA': []
        };

        if (!validTransitions[demanda.status].includes(newStatus)) {
            throw new Error(`Transição de status inválida: ${demanda.status} -> ${newStatus}`);
        }

        const updateData: any = { status: newStatus };

        if (newStatus === 'CANCELADA') {
            updateData.data_cancelamento = new Date();
            updateData.justificativa_cancelamento = justificativa;
        }

        // Log transition could be added here (HistoricoLog) in future

        return prisma.demanda.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: number) {
        // Check if no items or restricted deletion
        // For MVP, allow delete if CADASTRADA
        const demanda = await prisma.demanda.findUnique({
            where: { id },
            include: { _count: { select: { itens: true } } }
        });

        if (!demanda) throw new Error('Demanda não encontrada');

        if (demanda.status !== 'CADASTRADA') {
            throw new Error('Apenas demandas cadastradas podem ser excluídas');
        }

        return prisma.demanda.delete({ where: { id } });
    }
}
