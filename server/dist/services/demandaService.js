"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandaService = void 0;
const client_1 = require("@prisma/client");
const AuditService_1 = require("./AuditService");
const emailService_1 = require("./emailService");
const prisma = new client_1.PrismaClient();
const auditService = new AuditService_1.AuditService();
class DemandaService {
    async list(filters) {
        const { q, ...otherFilters } = filters || {};
        const where = { ...otherFilters };
        if (q) {
            where.OR = [
                { codigo_demanda: { contains: q } },
                { descricao: { contains: q } }
            ];
        }
        return prisma.demanda.findMany({
            where,
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
    async findById(id) {
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
    async create(data, userId) {
        // Ensure PCA exists
        const pca = await prisma.pca.findUnique({ where: { id: data.pca_id } });
        if (!pca)
            throw new Error('PCA não encontrado');
        // Get next sequential project number for this PCA
        const lastDemanda = await prisma.demanda.findFirst({
            where: { pca_id: data.pca_id },
            orderBy: { numero_projeto: 'desc' }
        });
        const numero_projeto = lastDemanda ? lastDemanda.numero_projeto + 1 : 1;
        // Generate sequential code: PCA{ANO}-{NUM_PCA}-{NUM_PROJETO}
        const numPca = pca.numero_pca.padStart(3, '0');
        const numProjeto = String(numero_projeto).padStart(3, '0');
        const codigo_demanda = `PCA${pca.ano}-${numPca}-${numProjeto}`;
        const createdDemanda = await prisma.demanda.create({
            data: {
                ...data,
                codigo_demanda,
                numero_projeto,
                responsavel_id: userId,
                status: 'CADASTRADA'
            }
        });
        await auditService.log({
            usuario_id: userId,
            acao: 'CRIACAO',
            entidade_tipo: 'DEMANDA',
            entidade_id: createdDemanda.id,
            descricao: `Demanda ${codigo_demanda} criada.`
        });
        return createdDemanda;
    }
    async update(id, data) {
        return prisma.demanda.update({
            where: { id },
            data
        });
    }
    async initiateContracting(id, numeroProcesso, userId) {
        const demanda = await prisma.demanda.findUnique({ where: { id } });
        if (!demanda)
            throw new Error('Demanda não encontrada');
        if (demanda.status !== 'ESTIMADA') {
            throw new Error('A apenas demandas ESTIMADAS podem ir para contratação.');
        }
        const updated = await prisma.demanda.update({
            where: { id },
            data: {
                status: 'EM_CONTRATACAO',
                numero_processo_licitatorio: numeroProcesso,
                ajustado_por_id: userId, // Tracking who initiated
                ajustado_em: new Date()
            }
        });
        await auditService.log({
            usuario_id: userId,
            acao: 'TRANSICAO_STATUS',
            entidade_tipo: 'DEMANDA',
            entidade_id: id,
            valor_anterior: 'ESTIMADA',
            valor_novo: 'EM_CONTRATACAO',
            descricao: `Início de contratação. Processo: ${numeroProcesso}`
        });
        return updated;
    }
    async finalizeContract(id, contractData, userId) {
        const demanda = await prisma.demanda.findUnique({ where: { id } });
        if (!demanda)
            throw new Error('Demanda não encontrada');
        if (demanda.status !== 'EM_CONTRATACAO') {
            throw new Error('A demanda deve estar EM_CONTRATACAO para ser finalizada.');
        }
        const updated = await prisma.demanda.update({
            where: { id },
            data: {
                status: 'CONTRATADA',
                numero_contrato: contractData.numero_contrato,
                data_contrato: new Date(contractData.data_contrato),
                valor_contratado: contractData.valor_contratado,
                cnpj_fornecedor_contratado: contractData.cnpj_fornecedor,
                razao_social_contratado: contractData.razao_social,
                ajustado_por_id: userId,
                ajustado_em: new Date()
            }
        });
        await auditService.log({
            usuario_id: userId,
            acao: 'TRANSICAO_STATUS',
            entidade_tipo: 'DEMANDA',
            entidade_id: id,
            valor_anterior: 'EM_CONTRATACAO',
            valor_novo: 'CONTRATADA',
            descricao: `Contrato finalizado. Nº ${contractData.numero_contrato}`
        });
        return updated;
    }
    async changeStatus(id, newStatus, userId, justificativa) {
        const demanda = await prisma.demanda.findUnique({ where: { id } });
        if (!demanda)
            throw new Error('Demanda não encontrada');
        const validTransitions = {
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
        const updateData = { status: newStatus };
        if (newStatus === 'CANCELADA') {
            updateData.data_cancelamento = new Date();
            updateData.justificativa_cancelamento = justificativa;
        }
        // Log transition could be added here (HistoricoLog) in future
        await auditService.log({
            usuario_id: userId,
            acao: 'TRANSICAO_STATUS',
            entidade_tipo: 'DEMANDA',
            entidade_id: id,
            valor_anterior: demanda.status,
            valor_novo: newStatus,
            descricao: justificativa
        });
        // Enviar notificação por e-mail
        emailService_1.emailService.notifyStatusChange(id, demanda.status, newStatus);
        return prisma.demanda.update({
            where: { id },
            data: updateData
        });
    }
    async delete(id) {
        // Check if no items or restricted deletion
        // For MVP, allow delete if CADASTRADA
        const demanda = await prisma.demanda.findUnique({
            where: { id },
            include: { _count: { select: { itens: true } } }
        });
        if (!demanda)
            throw new Error('Demanda não encontrada');
        if (demanda.status !== 'CADASTRADA') {
            throw new Error('Apenas demandas cadastradas podem ser excluídas');
        }
        return prisma.demanda.delete({ where: { id } });
    }
}
exports.DemandaService = DemandaService;
