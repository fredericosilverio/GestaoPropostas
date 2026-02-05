"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = exports.uploadConfig = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const storageDir = path_1.default.resolve(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(storageDir)) {
    fs_1.default.mkdirSync(storageDir, { recursive: true });
}
// Configure Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
exports.uploadConfig = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
class UploadService {
    async registerUpload(file, userId, entityType, entityId, descricao) {
        return prisma.anexo.create({
            data: {
                entidade_tipo: entityType,
                entidade_id: entityId,
                nome_arquivo: file.originalname,
                nome_arquivo_storage: file.filename,
                extensao: path_1.default.extname(file.originalname).substring(1),
                tamanho_bytes: file.size,
                mime_type: file.mimetype,
                hash_md5: '', // Optional: calculate MD5
                path_storage: file.path,
                uploaded_by_id: userId,
                descricao
            }
        });
    }
    async listByEntity(entityType, entityId) {
        return prisma.anexo.findMany({
            where: { entidade_tipo: entityType, entidade_id: entityId, ativo: true },
            include: { uploaded_by: { select: { nome_completo: true } } },
            orderBy: { created_at: 'desc' }
        });
    }
    async listByDemanda(demandaId) {
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
    async delete(id) {
        // Soft delete
        return prisma.anexo.update({
            where: { id },
            data: { ativo: false }
        });
    }
}
exports.UploadService = UploadService;
