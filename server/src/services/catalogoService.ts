import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CatalogoService {
    // Listar todos os itens do catálogo
    async list(filters?: { categoria?: string; search?: string; ativo?: boolean }) {
        const where: any = {};

        if (filters?.ativo !== undefined) {
            where.ativo = filters.ativo;
        } else {
            where.ativo = true; // Por padrão, só ativos
        }

        if (filters?.categoria) {
            where.categoria = filters.categoria;
        }

        if (filters?.search) {
            where.OR = [
                { descricao: { contains: filters.search } },
                { codigo: { contains: filters.search } },
                { codigo_catmat: { contains: filters.search } }
            ];
        }

        return prisma.itemCatalogo.findMany({
            where,
            orderBy: { descricao: 'asc' }
        });
    }

    // Buscar por ID
    async findById(id: number) {
        return prisma.itemCatalogo.findUnique({
            where: { id }
        });
    }

    // Criar item no catálogo
    async create(data: {
        codigo: string;
        descricao: string;
        especificacoes_tecnicas?: string;
        unidade_medida: string;
        codigo_catmat?: string;
        categoria?: string;
        preco_referencia?: number;
    }) {
        return prisma.itemCatalogo.create({
            data: {
                ...data,
                preco_referencia: data.preco_referencia,
                data_atualizacao_preco: data.preco_referencia ? new Date() : undefined
            }
        });
    }

    // Atualizar item
    async update(id: number, data: any) {
        if (data.preco_referencia !== undefined) {
            data.data_atualizacao_preco = new Date();
        }

        return prisma.itemCatalogo.update({
            where: { id },
            data
        });
    }

    // Desativar item (soft delete)
    async deactivate(id: number) {
        return prisma.itemCatalogo.update({
            where: { id },
            data: { ativo: false }
        });
    }

    // Importar item do catálogo para uma demanda
    async importToItem(catalogoId: number, demandaId: number, quantidade: number, codigoItem: number) {
        const catalogoItem = await prisma.itemCatalogo.findUnique({
            where: { id: catalogoId }
        });

        if (!catalogoItem) {
            throw new Error('Item do catálogo não encontrado');
        }

        // Criar item na demanda baseado no catálogo
        return prisma.item.create({
            data: {
                demanda_id: demandaId,
                codigo_item: codigoItem,
                descricao: catalogoItem.descricao,
                especificacoes_tecnicas: catalogoItem.especificacoes_tecnicas,
                unidade_medida: catalogoItem.unidade_medida,
                codigo_catmat: catalogoItem.codigo_catmat,
                quantidade,
                elemento_despesa: '339040', // Padrão, pode ser modificado depois
                valor_estimado_unitario: catalogoItem.preco_referencia
            }
        });
    }

    // Listar categorias existentes
    async listCategorias() {
        const items = await prisma.itemCatalogo.findMany({
            select: { categoria: true },
            where: { ativo: true, categoria: { not: null } },
            distinct: ['categoria']
        });

        return items.map(i => i.categoria).filter(Boolean);
    }
}
