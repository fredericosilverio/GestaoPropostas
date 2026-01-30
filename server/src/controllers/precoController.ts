import { Request, Response } from 'express';
import { PrecoService } from '../services/precoService';

const precoService = new PrecoService();

export class PrecoController {
    async list(req: Request, res: Response) {
        try {
            const itemId = Number(req.query.item_id);
            if (!itemId) return res.status(400).json({ error: 'item_id required' });

            const precos = await precoService.listByItem(itemId);
            res.json(precos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const preco = await precoService.create(req.body, userId);
            res.status(201).json(preco);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await precoService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
