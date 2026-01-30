import { Request, Response } from 'express';
import { DemandaService } from '../services/demandaService';

const demandaService = new DemandaService();

export class DemandaController {
    async list(req: Request, res: Response) {
        try {
            const filters: any = { ...req.query }; // Create a new object by spreading req.query
            // Filter by PCA if pca_id is provided
            if (req.query.pca_id) {
                filters.pca_id = Number(req.query.pca_id);
            }

            const demandas = await demandaService.list(filters);
            res.json(demandas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const demanda = await demandaService.findById(id);
            if (!demanda) return res.status(404).json({ error: 'Demanda não encontrada' });
            res.json(demanda);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const demanda = await demandaService.create(req.body, userId);
            res.status(201).json(demanda);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const demanda = await demandaService.update(id, req.body);
            res.json(demanda);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async changeStatus(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { status, justificativa } = req.body;
            // @ts-ignore
            const userId = req.user.id;

            const demanda = await demandaService.changeStatus(id, status, userId, justificativa);
            res.json(demanda);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async initiateContracting(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { numero_processo } = req.body;
            // @ts-ignore
            const userId = req.user.id;

            const demanda = await demandaService.initiateContracting(id, numero_processo, userId);
            res.json(demanda);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async finalizeContract(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;

            const demanda = await demandaService.finalizeContract(id, req.body, userId);
            res.json(demanda);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await demandaService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
