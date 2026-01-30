import { PrismaClient } from '@prisma/client';
import { ItemService } from './itemService';

const prisma = new PrismaClient();
// Circular dependency injection or instantiate? Use lazy or just separate logic.
// Simpler to instantiate or pass if needed.
// To avoid circular dep, we won't import ItemService here directly in constructor if not needed.
// But we need to recalc stats after price change.

export class PrecoService {
    async create(data: any, userId: number) {
        const preco = await prisma.preco.create({
            data: {
                ...data,
                cadastrado_por_id: userId,
                classificacao: 'ACEITO' // Default, will be recalculated
            }
        });

        // Trigger stats recalculation
        // We can just call a specialized method in a shared service or instantiate ItemService here (careful of loop)
        // Doing a quick manual implementation of recalc call
        await this.recalculateItemStats(data.item_id);

        return preco;
    }

    async delete(id: number) {
        const preco = await prisma.preco.findUnique({ where: { id } });
        if (!preco) throw new Error('Preço não encontrado');

        await prisma.preco.delete({ where: { id } });
        await this.recalculateItemStats(preco.item_id);
    }

    async listByItem(itemId: number) {
        return prisma.preco.findMany({
            where: { item_id: itemId },
            orderBy: { valor_unitario: 'asc' }
        });
    }

    private async recalculateItemStats(itemId: number) {
        const { ItemService } = await import('./itemService');
        const itemService = new ItemService();
        await itemService.calculateStats(itemId);
    }
}
