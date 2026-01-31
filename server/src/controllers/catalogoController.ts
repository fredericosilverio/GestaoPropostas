import { Request, Response } from 'express';
import { CatalogoService } from '../services/catalogoService';

const catalogoService = new CatalogoService();

export class CatalogoController {
    async list(req: Request, res: Response) {
        try {
            const { categoria, search, ativo } = req.query;
            const items = await catalogoService.list({
                categoria: categoria as string,
                search: search as string,
                ativo: ativo === 'false' ? false : ativo === 'true' ? true : undefined
            });
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const item = await catalogoService.findById(Number(req.params.id));
            if (!item) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const item = await catalogoService.create(req.body);
            res.status(201).json(item);
        } catch (error: any) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Código já existe no catálogo' });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const item = await catalogoService.update(Number(req.params.id), req.body);
            res.json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await catalogoService.deactivate(Number(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async importToItem(req: Request, res: Response) {
        try {
            const { catalogoId, demandaId, quantidade, codigoItem } = req.body;
            const item = await catalogoService.importToItem(
                Number(catalogoId),
                Number(demandaId),
                Number(quantidade),
                Number(codigoItem)
            );
            res.status(201).json(item);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async listCategorias(req: Request, res: Response) {
        try {
            const categorias = await catalogoService.listCategorias();
            res.json(categorias);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
