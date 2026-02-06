import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';

const itemService = new ItemService();

export class ItemController {
    async list(req: Request, res: Response) {
        try {
            const demandaId = Number(req.query.demanda_id);
            if (!demandaId) return res.status(400).json({ error: 'demanda_id required' });

            const items = await itemService.listByDemanda(demandaId);
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const item = await itemService.findById(id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const item = await itemService.create(req.body, userId);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            const item = await itemService.update(id, req.body, userId);
            res.json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            await itemService.delete(id, userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
