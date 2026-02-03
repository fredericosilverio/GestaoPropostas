import { Request, Response } from 'express';
import { UploadService } from '../services/uploadService';

const uploadService = new UploadService();

export class UploadController {
    async upload(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            // @ts-ignore
            const userId = req.user.id;
            const { entityType, entityId, descricao } = req.body;

            if (!entityType || !entityId) {
                return res.status(400).json({ error: 'entityType e entityId são obrigatórios.' });
            }

            const anexo = await uploadService.registerUpload(
                req.file,
                userId,
                String(entityType),
                Number(entityId),
                descricao
            );

            res.status(201).json(anexo);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao processar upload.' });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { entityType, entityId } = req.query;
            const anexos = await uploadService.listByEntity(String(entityType), Number(entityId));
            res.json(anexos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async listByDemanda(req: Request, res: Response) {
        try {
            const demandaId = Number(req.params.demandaId);
            const anexos = await uploadService.listByDemanda(demandaId);
            res.json(anexos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await uploadService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

