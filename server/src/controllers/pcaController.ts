import { Request, Response } from 'express';
import { PcaService } from '../services/pcaService';

const pcaService = new PcaService();

export class PcaController {
    async list(req: Request, res: Response) {
        try {
            const filters = req.query;
            const pcas = await pcaService.list(filters);
            res.json(pcas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const pca = await pcaService.findById(id);
            if (!pca) return res.status(404).json({ error: 'PCA não encontrado' });
            res.json(pca);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const pca = await pcaService.create(req.body, userId);
            res.status(201).json(pca);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const pca = await pcaService.update(id, req.body);
            res.json(pca);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async changeStatus(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { situacao } = req.body;
            const pca = await pcaService.changeStatus(id, situacao);
            res.json(pca);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
