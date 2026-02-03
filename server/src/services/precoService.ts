import { PrismaClient } from '@prisma/client';
import { ItemService } from './itemService';
import { AuditService } from './AuditService';

const prisma = new PrismaClient();
const auditService = new AuditService();

export class PrecoService {
    async create(data: any, userId: number) {
        // Find supplier info if provided
        let fornecedorInfo = {};
        if (data.fornecedor_id) {
            const fornecedor = await prisma.fornecedor.findUnique({ where: { id: data.fornecedor_id } });
            if (fornecedor) {
                fornecedorInfo = {
                    fornecedor_id: fornecedor.id,
                    cnpj_fornecedor: fornecedor.cnpj,
                    razao_social: fornecedor.razao_social,
                    fonte: fornecedor.nome_fantasia || fornecedor.razao_social
                };
            }
        }

        // Explicitly pick fields to avoid spreading unknown properties
        const safeData: any = {
            item_id: Number(data.item_id),
            valor_unitario: Number(data.valor_unitario),
            fonte: data.fonte,
            cnpj_fornecedor: data.cnpj_fornecedor,
            tipo_fonte: data.tipo_fonte || 'COTACAO_FORNECEDOR',
            unidade_medida: data.unidade_medida,
            data_coleta: data.data_coleta ? new Date(data.data_coleta) : new Date(),
            classificacao: 'ACEITO',
            ...fornecedorInfo,
            cadastrado_por_id: userId,
        };

        // Only add fornecedor_id if it's a valid number
        if (data.fornecedor_id) {
            safeData.fornecedor_id = Number(data.fornecedor_id);
        } else {
            safeData.fornecedor_id = null;
        }

        console.log('[PrecoService] safeData:', JSON.stringify(safeData, null, 2));

        try {
            const preco = await prisma.preco.create({
                data: safeData
            });

            await auditService.log({
                usuario_id: userId,
                acao: 'CRIACAO',
                entidade_tipo: 'PRECO',
                entidade_id: preco.id,
                descricao: `Preço R$ ${preco.valor_unitario} adicionado ao Item ${data.item_id}`
            });

            await this.recalculateItemStats(data.item_id);

            return preco;
        } catch (error: any) {
            console.error('[PrecoService] Error creating price:', error);
            throw new Error(`Erro ao criar preço: ${error.message}`);
        }
    }

    async update(id: number, data: any, userId: number) {
        const existing = await prisma.preco.findUnique({ where: { id } });
        if (!existing) throw new Error('Preço não encontrado');

        const updateData: any = {};

        if (data.valor_unitario !== undefined) updateData.valor_unitario = Number(data.valor_unitario);
        if (data.fonte !== undefined) updateData.fonte = data.fonte;
        if (data.tipo_fonte !== undefined) updateData.tipo_fonte = data.tipo_fonte;
        if (data.data_coleta !== undefined) updateData.data_coleta = new Date(data.data_coleta);
        if (data.cnpj_fornecedor !== undefined) updateData.cnpj_fornecedor = data.cnpj_fornecedor;

        const preco = await prisma.preco.update({
            where: { id },
            data: updateData
        });

        await auditService.log({
            usuario_id: userId,
            acao: 'ATUALIZACAO',
            entidade_tipo: 'PRECO',
            entidade_id: preco.id,
            descricao: `Preço ID ${id} atualizado para R$ ${preco.valor_unitario}`
        });

        await this.recalculateItemStats(existing.item_id);

        return preco;
    }

    async createBatch(data: {
        fornecedor_id: number,
        data_coleta: Date,
        tipo_fonte?: string,
        itens: { item_id: number, valor_unitario: number }[]
    }, userId: number) {
        const fornecedor = await prisma.fornecedor.findUnique({ where: { id: data.fornecedor_id } });
        if (!fornecedor) throw new Error('Fornecedor não encontrado');

        const createdIds: number[] = [];
        const affectedItemIds: Set<number> = new Set();
        const tipoFonte = data.tipo_fonte || 'COTACAO_FORNECEDOR';

        await prisma.$transaction(async (tx) => {
            for (const item of data.itens) {
                // Ignore zero or invalid values
                if (!item.valor_unitario || Number(item.valor_unitario) <= 0) continue;

                const preco = await tx.preco.create({
                    data: {
                        item_id: item.item_id,
                        valor_unitario: item.valor_unitario,
                        fornecedor_id: fornecedor.id,
                        cnpj_fornecedor: fornecedor.cnpj,
                        razao_social: fornecedor.razao_social,
                        fonte: fornecedor.nome_fantasia || fornecedor.razao_social,
                        data_coleta: new Date(data.data_coleta),
                        tipo_fonte: tipoFonte,
                        unidade_medida: 'UN',
                        classificacao: 'ACEITO',
                        cadastrado_por_id: userId,
                        ativo: true
                    }
                });
                createdIds.push(preco.id);
                affectedItemIds.add(item.item_id);
            }
        });

        // Audit Log (Batch)
        await auditService.log({
            usuario_id: userId,
            acao: 'CRIACAO',
            entidade_tipo: 'PRECO',
            entidade_id: 0,
            descricao: `Lote de ${createdIds.length} preços adicionados para fornecedor ${fornecedor.razao_social}`
        });

        // Recalculate stats for all affected items
        for (const itemId of affectedItemIds) {
            await this.recalculateItemStats(itemId);
        }

        return { count: createdIds.length, preco_ids: createdIds };
    }

    async delete(id: number, userId: number) {
        const preco = await prisma.preco.findUnique({ where: { id } });
        if (!preco) throw new Error('Preço não encontrado');

        await prisma.preco.delete({ where: { id } });

        await auditService.log({
            usuario_id: userId,
            acao: 'EXCLUSAO',
            entidade_tipo: 'PRECO',
            entidade_id: id,
            descricao: `Preço ${preco.valor_unitario} excluído do Item ${preco.item_id}`
        });

        await this.recalculateItemStats(preco.item_id);
    }

    async listByItem(itemId: number) {
        return prisma.preco.findMany({
            where: { item_id: itemId },
            include: { fornecedor: true },
            orderBy: { valor_unitario: 'asc' }
        });
    }

    private async recalculateItemStats(itemId: number) {
        const { ItemService } = await import('./itemService');
        const itemService = new ItemService();
        await itemService.calculateStats(itemId);
    }
}
