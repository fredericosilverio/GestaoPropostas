"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecoController = void 0;
const precoService_1 = require("../services/precoService");
const precoService = new precoService_1.PrecoService();
class PrecoController {
    async list(req, res) {
        try {
            const itemId = Number(req.query.item_id);
            if (!itemId)
                return res.status(400).json({ error: 'item_id required' });
            const precos = await precoService.listByItem(itemId);
            res.json(precos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            console.log('[PrecoController] Create Body:', JSON.stringify(req.body, null, 2));
            // @ts-ignore
            const userId = req.user.id;
            const preco = await precoService.create(req.body, userId);
            res.status(201).json(preco);
        }
        catch (error) {
            console.error('[PrecoController] Error:', error);
            res.status(400).json({ error: error.message });
        }
    }
    async createBatch(req, res) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const result = await precoService.createBatch(req.body, userId);
            res.status(201).json(result);
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
            await precoService.delete(id, userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            const preco = await precoService.update(id, req.body, userId);
            res.json(preco);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.PrecoController = PrecoController;
