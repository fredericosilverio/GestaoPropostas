import { Request, Response } from 'express';
import { ComentarioService } from '../services/comentarioService';

const comentarioService = new ComentarioService();

export class ComentarioController {
    async list(req: Request, res: Response) {
        try {
            const demandaId = Number(req.query.demanda_id);
            if (!demandaId) {
                return res.status(400).json({ error: 'demanda_id é obrigatório' });
            }
            const comentarios = await comentarioService.listByDemanda(demandaId);
            res.json(comentarios);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const { demanda_id, texto } = req.body;

            if (!demanda_id || !texto) {
                return res.status(400).json({ error: 'demanda_id e texto são obrigatórios' });
            }

            const comentario = await comentarioService.create({
                demanda_id: Number(demanda_id),
                usuario_id: userId,
                texto
            });

            res.status(201).json(comentario);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const id = Number(req.params.id);
            const { texto } = req.body;

            const comentario = await comentarioService.update(id, userId, texto);
            res.json(comentario);
        } catch (error: any) {
            if (error.message.includes('autor')) {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            // @ts-ignore
            const isAdmin = req.user.perfil === 'ADMIN';
            const id = Number(req.params.id);

            await comentarioService.delete(id, userId, isAdmin);
            res.status(204).send();
        } catch (error: any) {
            if (error.message.includes('permissão')) {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}
