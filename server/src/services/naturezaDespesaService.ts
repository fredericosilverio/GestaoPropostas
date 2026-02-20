import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NaturezaDespesaService {
    async list() {
        return prisma.naturezaDespesa.findMany({
            where: { ativo: true },
            orderBy: { codigo: 'asc' }
        });
    }

    async findById(id: number) {
        return prisma.naturezaDespesa.findUnique({
            where: { id }
        });
    }

    async create(data: { codigo: string; descricao: string; tipo: string }) {
        return prisma.naturezaDespesa.create({ data });
    }

    async update(id: number, data: { codigo?: string; descricao?: string; tipo?: string; ativo?: boolean }) {
        return prisma.naturezaDespesa.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        // Soft delete
        return prisma.naturezaDespesa.update({
            where: { id },
            data: { ativo: false }
        });
    }
}
