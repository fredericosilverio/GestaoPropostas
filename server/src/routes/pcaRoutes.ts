import { Router } from 'express';
import { PcaController } from '../controllers/pcaController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const pcaRoutes = Router();
const pcaController = new PcaController();

pcaRoutes.use(authMiddleware);

pcaRoutes.get('/', pcaController.list);
pcaRoutes.get('/:id', pcaController.get);

// Only ADMIN and GESTOR can create/edit PCAs
pcaRoutes.post('/', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.create);
pcaRoutes.put('/:id', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.update);
pcaRoutes.patch('/:id/status', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.changeStatus);

export { pcaRoutes };
