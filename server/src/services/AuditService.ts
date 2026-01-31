import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogData {
    usuario_id?: number;
    acao: string;
    entidade_tipo: string;
    entidade_id?: number;
    campo_alterado?: string;
    valor_anterior?: any;
    valor_novo?: any;
    descricao?: string;
    ip_origem?: string;
    user_agent?: string;
    resultado?: 'SUCESSO' | 'ERRO';
    mensagem_erro?: string;
}

export class AuditService {
    async log(data: AuditLogData) {
        try {
            await prisma.historicoLog.create({
                data: {
                    usuario_id: data.usuario_id,
                    acao: data.acao,
                    entidade_tipo: data.entidade_tipo,
                    entidade_id: data.entidade_id,
                    campo_alterado: data.campo_alterado,
                    valor_anterior: data.valor_anterior ? JSON.stringify(data.valor_anterior) : null,
                    valor_novo: data.valor_novo ? JSON.stringify(data.valor_novo) : null,
                    descricao: data.descricao,
                    ip_origem: data.ip_origem,
                    user_agent: data.user_agent,
                    resultado: data.resultado || 'SUCESSO',
                    mensagem_erro: data.mensagem_erro
                }
            });
        } catch (error) {
            console.error('Falha ao registrar log de auditoria:', error);
            // Non-blocking: don't throw error to avoid disrupting the main flow
        }
    }

    async listLogs(page = 1, limit = 50, filters?: any) {
        const skip = (page - 1) * limit;

        const logs = await prisma.historicoLog.findMany({
            skip,
            take: limit,
            orderBy: { data_hora: 'desc' },
            include: {
                usuario: {
                    select: { nome_completo: true, email: true }
                }
            },
            where: filters
        });

        const total = await prisma.historicoLog.count({ where: filters });

        return {
            data: logs.map(log => ({
                ...log,
                id: log.id.toString(), // Convert BigInt to string
                valor_anterior: log.valor_anterior ? JSON.parse(log.valor_anterior) : null,
                valor_novo: log.valor_novo ? JSON.parse(log.valor_novo) : null
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
