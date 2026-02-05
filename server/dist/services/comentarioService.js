"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComentarioService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ComentarioService {
    // Listar comentários de uma demanda
    async listByDemanda(demandaId) {
        return prisma.comentario.findMany({
            where: { demanda_id: demandaId },
            orderBy: { created_at: 'desc' }
        });
    }
    // Criar comentário
    async create(data) {
        return prisma.comentario.create({
            data: {
                demanda_id: data.demanda_id,
                usuario_id: data.usuario_id,
                texto: data.texto
            }
        });
    }
    // Atualizar comentário (apenas autor)
    async update(id, userId, texto) {
        const comentario = await prisma.comentario.findUnique({ where: { id } });
        if (!comentario) {
            throw new Error('Comentário não encontrado');
        }
        if (comentario.usuario_id !== userId) {
            throw new Error('Apenas o autor pode editar o comentário');
        }
        return prisma.comentario.update({
            where: { id },
            data: { texto }
        });
    }
    // Excluir comentário (apenas autor ou admin)
    async delete(id, userId, isAdmin = false) {
        const comentario = await prisma.comentario.findUnique({ where: { id } });
        if (!comentario) {
            throw new Error('Comentário não encontrado');
        }
        if (comentario.usuario_id !== userId && !isAdmin) {
            throw new Error('Sem permissão para excluir');
        }
        return prisma.comentario.delete({ where: { id } });
    }
}
exports.ComentarioService = ComentarioService;
