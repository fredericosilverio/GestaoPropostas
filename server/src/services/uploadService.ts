import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const storageDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

export const uploadConfig = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export class UploadService {
    async registerUpload(file: Express.Multer.File, userId: number, entityType: string, entityId: number, descricao?: string) {
        return prisma.anexo.create({
            data: {
                entidade_tipo: entityType,
                entidade_id: entityId,
                nome_arquivo: file.originalname,
                nome_arquivo_storage: file.filename,
                extensao: path.extname(file.originalname).substring(1),
                tamanho_bytes: file.size,
                mime_type: file.mimetype,
                hash_md5: '', // Optional: calculate MD5
                path_storage: file.path,
                uploaded_by_id: userId,
                descricao
            }
        });
    }

    async listByEntity(entityType: string, entityId: number) {
        return prisma.anexo.findMany({
            where: { entidade_tipo: entityType, entidade_id: entityId, ativo: true },
            include: { uploaded_by: { select: { nome_completo: true } } },
            orderBy: { created_at: 'desc' }
        });
    }

    async listByDemanda(demandaId: number) {
        // 1. Get direct demand attachments
        const demandaAnexos = await prisma.anexo.findMany({
            where: { entidade_tipo: 'DEMANDA', entidade_id: demandaId, ativo: true },
            include: { uploaded_by: { select: { nome_completo: true } } }
        });

        // 2. Get all items for this demand
        const items = await prisma.item.findMany({
            where: { demanda_id: demandaId },
            select: { id: true }
        });
        const itemIds = items.map(i => i.id);

        // 3. Get all prices for these items
        const precos = await prisma.preco.findMany({
            where: { item_id: { in: itemIds } },
            select: { id: true }
        });
        const precoIds = precos.map(p => p.id);

        // 4. Get all price attachments
        const precoAnexos = precoIds.length > 0 ? await prisma.anexo.findMany({
            where: { entidade_tipo: 'PRECO', entidade_id: { in: precoIds }, ativo: true },
            include: { uploaded_by: { select: { nome_completo: true } } }
        }) : [];

        // 5. Combine and sort by date
        const allAnexos = [...demandaAnexos, ...precoAnexos].map(a => ({
            ...a,
            origem: a.entidade_tipo === 'DEMANDA' ? 'Demanda' : 'Cotação'
        }));

        allAnexos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return allAnexos;
    }

    async delete(id: number) {
        // Soft delete
        return prisma.anexo.update({
            where: { id },
            data: { ativo: false }
        });
    }
}

