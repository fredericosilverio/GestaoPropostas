"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecoService = void 0;
const client_1 = require("@prisma/client");
const AuditService_1 = require("./AuditService");
const prisma = new client_1.PrismaClient();
const auditService = new AuditService_1.AuditService();
class PrecoService {
    async create(data, userId) {
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
        const safeData = {
            item_id: Number(data.item_id),
            valor_unitario: Number(data.valor_unitario),
            fonte: data.fonte,
            cnpj_fornecedor: data.cnpj_fornecedor,
            tipo_fonte: data.tipo_fonte || 'COTACAO_FORNECEDOR',
            link_fonte: data.link_fonte || null,
            unidade_medida: data.unidade_medida,
            data_coleta: data.data_coleta ? new Date(data.data_coleta) : new Date(),
            classificacao: 'ACEITO',
            ...fornecedorInfo,
            cadastrado_por_id: userId,
        };
        // Only add fornecedor_id if it's a valid number
        if (data.fornecedor_id) {
            safeData.fornecedor_id = Number(data.fornecedor_id);
        }
        else {
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
        }
        catch (error) {
            console.error('[PrecoService] Error creating price:', error);
            throw new Error(`Erro ao criar preço: ${error.message}`);
        }
    }
    async update(id, data, userId) {
        const existing = await prisma.preco.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Preço não encontrado');
        const updateData = {};
        if (data.valor_unitario !== undefined)
            updateData.valor_unitario = Number(data.valor_unitario);
        if (data.fonte !== undefined)
            updateData.fonte = data.fonte;
        if (data.tipo_fonte !== undefined)
            updateData.tipo_fonte = data.tipo_fonte;
        if (data.link_fonte !== undefined)
            updateData.link_fonte = data.link_fonte;
        if (data.data_coleta !== undefined)
            updateData.data_coleta = new Date(data.data_coleta);
        if (data.cnpj_fornecedor !== undefined)
            updateData.cnpj_fornecedor = data.cnpj_fornecedor;
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
    async createBatch(data, userId) {
        const fornecedor = await prisma.fornecedor.findUnique({ where: { id: data.fornecedor_id } });
        if (!fornecedor)
            throw new Error('Fornecedor não encontrado');
        const createdIds = [];
        const affectedItemIds = new Set();
        const tipoFonte = data.tipo_fonte || 'COTACAO_FORNECEDOR';
        await prisma.$transaction(async (tx) => {
            for (const item of data.itens) {
                // Ignore zero or invalid values
                if (!item.valor_unitario || Number(item.valor_unitario) <= 0)
                    continue;
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
                        link_fonte: data.link_fonte || null,
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
    async delete(id, userId) {
        const preco = await prisma.preco.findUnique({ where: { id } });
        if (!preco)
            throw new Error('Preço não encontrado');
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
    async listByItem(itemId) {
        return prisma.preco.findMany({
            where: { item_id: itemId },
            include: { fornecedor: true },
            orderBy: { valor_unitario: 'asc' }
        });
    }
    async recalculateItemStats(itemId) {
        const { ItemService } = await Promise.resolve().then(() => __importStar(require('./itemService')));
        const itemService = new ItemService();
        await itemService.calculateStats(itemId);
    }
}
exports.PrecoService = PrecoService;
