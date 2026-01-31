import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FornecedorService {

    async list(filters?: { search?: string; ativo?: boolean }) {
        const where: any = {};

        if (filters?.ativo !== undefined) {
            where.ativo = filters.ativo;
        }

        if (filters?.search) {
            where.OR = [
                { razao_social: { contains: filters.search } },
                { nome_fantasia: { contains: filters.search } },
                { cnpj: { contains: filters.search } }
            ];
        }

        return prisma.fornecedor.findMany({
            where,
            orderBy: { razao_social: 'asc' }
        });
    }

    async findById(id: number) {
        return prisma.fornecedor.findUnique({
            where: { id }
        });
    }

    async findByCnpj(cnpj: string) {
        return prisma.fornecedor.findUnique({
            where: { cnpj }
        });
    }

    async create(data: any) {
        // Validação simples de duplicidade
        const existing = await this.findByCnpj(data.cnpj);
        if (existing) {
            throw new Error(`Fornecedor já cadastrado com o CNPJ ${data.cnpj}`);
        }

        return prisma.fornecedor.create({
            data
        });
    }

    async update(id: number, data: any) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new Error('Fornecedor não encontrado');
        }

        // Se estiver alterando CNPJ, verificar duplicidade
        if (data.cnpj && data.cnpj !== existing.cnpj) {
            const cnpjExists = await this.findByCnpj(data.cnpj);
            if (cnpjExists) {
                throw new Error(`Já existe outro fornecedor com o CNPJ ${data.cnpj}`);
            }
        }

        return prisma.fornecedor.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        // Soft delete (desativar) ou delete real?
        // Schema tem campo 'ativo', vamos usar soft delete por padrão ou toggle
        // Mas se o usuário pedir excluir, pode ser delete real se não tiver dependências
        // Por segurança, vamos apenas deletar por enquanto. Se tiver erro de FK (quando tivermos relacionamentos), o prisma avisa.
        // Como 'fornecedor' ainda não tem relações fortes (só Preco tem cnpj string, não FK), podemos deletar.

        // Porém, o requisito falava em "ativo". Vamos implementar o toggleStatus também.
        return prisma.fornecedor.delete({
            where: { id }
        });
    }

    async toggleStatus(id: number) {
        const fornecedor = await this.findById(id);
        if (!fornecedor) throw new Error('Fornecedor não encontrado');

        return prisma.fornecedor.update({
            where: { id },
            data: { ativo: !fornecedor.ativo }
        });
    }
}
