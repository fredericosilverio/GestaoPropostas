"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const itemService_1 = require("../services/itemService");
const itemService = new itemService_1.ItemService();
class ItemController {
    async list(req, res) {
        try {
            const demandaId = Number(req.query.demanda_id);
            if (!demandaId)
                return res.status(400).json({ error: 'demanda_id required' });
            const items = await itemService.listByDemanda(demandaId);
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const item = await itemService.create(req.body, userId);
            res.status(201).json(item);
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
            const item = await itemService.update(id, req.body, userId);
            res.json(item);
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
            await itemService.delete(id, userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ItemController = ItemController;
