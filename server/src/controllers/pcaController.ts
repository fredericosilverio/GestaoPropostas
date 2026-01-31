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

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            // @ts-ignore
            const userId = req.user.id;
            const { justificativa } = req.body;

            const pca = await pcaService.delete(id, userId, justificativa);
            res.json({ message: 'PCA excluído com sucesso', pca });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async changeStatus(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { situacao, justificativa } = req.body;

            if (!situacao) {
                return res.status(400).json({ error: 'Situação é obrigatória' });
            }

            const pca = await pcaService.changeStatus(id, situacao, justificativa);
            res.json(pca);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createVersion(req: Request, res: Response) {
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
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getVersionHistory(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const versions = await pcaService.getVersionHistory(id);
            res.json(versions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getStatistics(req: Request, res: Response) {
        try {
            const filters = {
                ano: req.query.ano ? Number(req.query.ano) : undefined,
                situacao: req.query.situacao as string | undefined,
                pcaId: req.query.pcaId ? Number(req.query.pcaId) : undefined
            };
            console.log('[PcaController] getStatistics called with filters:', filters);
            const statistics = await pcaService.getStatistics(filters);
            console.log('[PcaController] getStatistics result:', JSON.stringify(statistics));
            res.json(statistics);
        } catch (error: any) {
            console.error('[PcaController] getStatistics error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

