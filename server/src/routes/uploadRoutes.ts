import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { uploadConfig } from '../services/uploadService';
import { authMiddleware } from '../middlewares/authMiddleware';

const uploadRoutes = Router();
const uploadController = new UploadController();

// Rota de teste sem autenticação
uploadRoutes.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Upload route is working' });
});

uploadRoutes.use(authMiddleware);

uploadRoutes.post('/', uploadConfig.single('file'), uploadController.upload);
uploadRoutes.get('/', uploadController.list);
uploadRoutes.get('/demanda/:demandaId', uploadController.listByDemanda);
uploadRoutes.delete('/:id', uploadController.delete);

export { uploadRoutes };

