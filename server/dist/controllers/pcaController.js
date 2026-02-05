"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PcaController = void 0;
const pcaService_1 = require("../services/pcaService");
const pcaService = new pcaService_1.PcaService();
class PcaController {
    async list(req, res) {
        try {
            const filters = req.query;
            const pcas = await pcaService.list(filters);
            res.json(pcas);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async get(req, res) {
        try {
            const id = Number(req.params.id);
            const pca = await pcaService.findById(id);
            if (!pca)
                return res.status(404).json({ error: 'PCA não encontrado' });
            res.json(pca);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const pca = await pcaService.create(req.body, userId);
            res.status(201).json(pca);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const pca = await pcaService.update(id, req.body);
            res.json(pca);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            const { justificativa } = req.body;
            const pca = await pcaService.delete(id, userId, justificativa);
            res.json({ message: 'PCA excluído com sucesso', pca });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async changeStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const { situacao, justificativa } = req.body;
            if (!situacao) {
                return res.status(400).json({ error: 'Situação é obrigatória' });
            }
            const pca = await pcaService.changeStatus(id, situacao, justificativa);
            res.json(pca);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createVersion(req, res) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            const { motivo } = req.body;
            if (!motivo) {
                return res.status(400).json({ error: 'Motivo da nova versão é obrigatório' });
            }
            const newPca = await pcaService.createNewVersion(id, motivo, userId);
            res.status(201).json({
                message: 'Nova versão criada com sucesso',
                pca: newPca
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getVersionHistory(req, res) {
        try {
            const id = Number(req.params.id);
            const versions = await pcaService.getVersionHistory(id);
            res.json(versions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getStatistics(req, res) {
        try {
            const filters = {
                ano: req.query.ano ? Number(req.query.ano) : undefined,
                situacao: req.query.situacao,
                pcaId: req.query.pcaId ? Number(req.query.pcaId) : undefined
            };
            console.log('[PcaController] getStatistics called with filters:', filters);
            const statistics = await pcaService.getStatistics(filters);
            console.log('[PcaController] getStatistics result:', JSON.stringify(statistics));
            res.json(statistics);
        }
        catch (error) {
            console.error('[PcaController] getStatistics error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PcaController = PcaController;
