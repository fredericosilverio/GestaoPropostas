import { Request, Response } from 'express';
import { FornecedorService } from '../services/fornecedorService';

const fornecedorService = new FornecedorService();

export class FornecedorController {

    async list(req: Request, res: Response) {
        try {
            const filters = {
                search: req.query.search as string | undefined,
                ativo: req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined
            };
            const fornecedores = await fornecedorService.list(filters);
            res.json(fornecedores);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const fornecedor = await fornecedorService.findById(id);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            res.json(fornecedor);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const fornecedor = await fornecedorService.create(req.body);
            res.status(201).json(fornecedor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const fornecedor = await fornecedorService.update(id, req.body);
            res.json(fornecedor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await fornecedorService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async toggleStatus(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const fornecedor = await fornecedorService.toggleStatus(id);
            res.json(fornecedor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
