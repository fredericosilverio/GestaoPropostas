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

    async delete(id: number) {
        // Soft delete
        return prisma.anexo.update({
            where: { id },
            data: { ativo: false }
        });
    }
}
