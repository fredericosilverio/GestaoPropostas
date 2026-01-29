import { PrismaClient, Pca } from '@prisma/client';

const prisma = new PrismaClient();

export class PcaService {
    async list(filters?: any) {
        return prisma.pca.findMany({
            where: filters,
            include: {
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                _count: {
                    select: { demandas: true }
                }
            },
            orderBy: { ano: 'desc' }
        });
    }

    async findById(id: number) {
        return prisma.pca.findUnique({
            where: { id },
            include: {
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                demandas: true // Include demands if needed for detail view
            }
        });
    }

    async create(data: any, userId: number) {
        // Check if PCA already exists for that Year/Organ/Version
        const existing = await prisma.pca.findFirst({
            where: {
                ano: data.ano,
                orgao: data.orgao,
                versao: 1
            }
        });

        if (existing) {
            throw new Error(`Já existe um PCA para o ano ${data.ano} e órgão ${data.orgao}`);
        }

        return prisma.pca.create({
            data: {
                ...data,
                responsavel_id: userId,
                situacao: 'EM_ELABORACAO', // Default start status
                versao: 1
            }
        });
    }

    async update(id: number, data: any) {
        // Prevent updating critical fields directly if needed, or handle versioning here
        return prisma.pca.update({
            where: { id },
            data
        });
    }

    async changeStatus(id: number, newStatus: string) {
        // Validate transitions (Simple state machine)
        const currentPca = await prisma.pca.findUnique({ where: { id } });
        if (!currentPca) throw new Error('PCA não encontrado');

        const validTransitions: Record<string, string[]> = {
            'EM_ELABORACAO': ['APROVADO', 'ENCERRADO'],
            'APROVADO': ['EM_EXECUCAO', 'ENCERRADO', 'EM_ELABORACAO'], // Back to Draft allowed? Maybe for correction.
            'EM_EXECUCAO': ['ENCERRADO'],
            'ENCERRADO': []
        };

        if (!validTransitions[currentPca.situacao].includes(newStatus)) {
            throw new Error(`Transição de status inválida: ${currentPca.situacao} -> ${newStatus}`);
        }

        const updateData: any = { situacao: newStatus };

        if (newStatus === 'APROVADO') {
            updateData.data_aprovacao = new Date();
        }

        return prisma.pca.update({
            where: { id },
            data: updateData
        });
    }

    async createNewVersion(id: number, motivo: string, userId: number) {
        // Logic to clone PCA and increment version
        // This is complex, will implement basic versioning logic
        const originalPca = await prisma.pca.findUnique({
            where: { id },
            include: { demandas: true }
        });

        if (!originalPca) throw new Error('PCA não encontrado');

        const newVersion = originalPca.versao + 1;

        // Transaction to ensure atomicity
        return prisma.$transaction(async (tx: any) => {
            // 1. Create new PCA
            const pcas = await tx.pca.create({
                data: {
                    ano: originalPca.ano,
                    numero_pca: originalPca.numero_pca,
                    orgao: originalPca.orgao,
                    situacao: 'EM_ELABORACAO',
                    versao: newVersion,
                    versao_anterior_id: originalPca.id,
                    motivo_versao: motivo,
                    responsavel_id: userId,
                    observacoes: originalPca.observacoes
                }
            });

            // 2. Clone Demands (Optional: depends on business rule. Usually we clone demands too)
            // For now, let's just create the PCA header.

            return pcas;
        });
    }
}
