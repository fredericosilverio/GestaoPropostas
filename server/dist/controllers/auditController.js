"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const AuditService_1 = require("../services/AuditService");
const auditService = new AuditService_1.AuditService();
class AuditController {
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const { usuario_id, entidade_tipo, acao } = req.query;
            const filters = {};
            if (usuario_id)
                filters.usuario_id = Number(usuario_id);
            if (entidade_tipo)
                filters.entidade_tipo = String(entidade_tipo);
            if (acao)
                filters.acao = { contains: String(acao) };
            const result = await auditService.listLogs(page, limit, filters);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AuditController = AuditController;
