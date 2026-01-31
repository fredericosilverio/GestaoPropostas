import { Request, Response } from 'express';
import { AuditService } from '../services/AuditService';

const auditService = new AuditService();

export class AuditController {
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const { usuario_id, entidade_tipo, acao } = req.query;

            const filters: any = {};
            if (usuario_id) filters.usuario_id = Number(usuario_id);
            if (entidade_tipo) filters.entidade_tipo = String(entidade_tipo);
            if (acao) filters.acao = { contains: String(acao) };

            const result = await auditService.listLogs(page, limit, filters);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
