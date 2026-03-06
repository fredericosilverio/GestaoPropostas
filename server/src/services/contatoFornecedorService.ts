import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ContatoFornecedorService {

    async list(filters?: { pca_id?: number, demanda_id?: number, fornecedor_id?: number, q?: string }) {
        const where: any = {};

        if (filters?.pca_id) {
            where.pca_id = filters.pca_id;
        }
        if (filters?.demanda_id) {
            where.demanda_id = filters.demanda_id;
        }
        if (filters?.fornecedor_id) {
            where.fornecedor_id = filters.fornecedor_id;
        }

        if (filters?.q) {
            where.OR = [
                { pauta: { contains: filters.q } },
                { fornecedor: { razao_social: { contains: filters.q } } },
                { fornecedor: { cnpj: { contains: filters.q } } },
                { demanda: { codigo_demanda: { contains: filters.q } } },
                { demanda: { descricao: { contains: filters.q } } }
            ];
        }

        return prisma.contatoFornecedor.findMany({
            where,
            include: {
                fornecedor: true,
                representante: true,
                pca: true,
                demanda: true,
                servidores_envolvidos: {
                    include: {
                        usuario: true
                    }
                }
            },
            orderBy: { data_hora: 'desc' }
        });
    }

    async findById(id: number) {
        return prisma.contatoFornecedor.findUnique({
            where: { id },
            include: {
                fornecedor: true,
                representante: true,
                servidores_envolvidos: {
                    include: {
                        usuario: true
                    }
                }
            }
        });
    }

    async create(data: any) {
        // Data format received: { ...fields, servidores_ids: [1, 2] }
        const { servidores_ids, ...contactData } = data;

        const newContato = await prisma.contatoFornecedor.create({
            data: {
                ...contactData,
                servidores_envolvidos: {
                    create: servidores_ids?.map((userId: number) => ({
                        usuario: { connect: { id: userId } }
                    })) || []
                }
            },
            include: {
                servidores_envolvidos: true
            }
        });

        return newContato;
    }

    async update(id: number, data: any) {
        const { servidores_ids, ...contactData } = data;

        // Use transaction if updating relations
        return prisma.$transaction(async (tx) => {
            // Se foi enviado um novo array de servidores, reseta e recria a relação
            if (servidores_ids !== undefined) {
                await tx.usuarioContato.deleteMany({
                    where: { contato_id: id }
                });

                await tx.contatoFornecedor.update({
                    where: { id },
                    data: {
                        ...contactData,
                        servidores_envolvidos: {
                            create: servidores_ids.map((userId: number) => ({
                                usuario: { connect: { id: userId } }
                            }))
                        }
                    }
                });
            } else {
                // Se array não foi enviado, apenas atualiza dados simples
                await tx.contatoFornecedor.update({
                    where: { id },
                    data: contactData
                });
            }

            return tx.contatoFornecedor.findUnique({
                where: { id },
                include: {
                    servidores_envolvidos: {
                        include: { usuario: true }
                    }
                }
            });
        });
    }

    async delete(id: number) {
        return prisma.contatoFornecedor.delete({
            where: { id }
        });
    }

    async relatorioContatos(filters: { pca_id?: number, demanda_id?: number, fornecedor_id?: number }) {
        // Aproveita o list, já que trás tudo ordenado por data descendente e tem os included necessários
        const contatos = await this.list(filters);

        // Prepara objeto mais simplificado, ou envia "raw" pro front-end cuidar de excel/pdf
        return contatos;
    }
}
