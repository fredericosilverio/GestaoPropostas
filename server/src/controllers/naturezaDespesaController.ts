import { Request, Response } from 'express';
import { NaturezaDespesaService } from '../services/naturezaDespesaService';

const service = new NaturezaDespesaService();

export class NaturezaDespesaController {
    async list(req: Request, res: Response) {
        try {
            const items = await service.list();
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const item = await service.findById(id);
            if (!item) return res.status(404).json({ error: 'Natureza de Despesa não encontrada' });
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const item = await service.create(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const item = await service.update(id, req.body);
            res.json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await service.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
