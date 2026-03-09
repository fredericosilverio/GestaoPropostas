import { Router } from 'express';
import { FornecedorController } from '../controllers/fornecedorController';
import { authMiddleware } from '../middlewares/authMiddleware';

const fornecedorRoutes = Router();
const fornecedorController = new FornecedorController();

fornecedorRoutes.get('/', authMiddleware, fornecedorController.list);
fornecedorRoutes.get('/:id', authMiddleware, fornecedorController.get);
fornecedorRoutes.post('/', authMiddleware, fornecedorController.create);
fornecedorRoutes.put('/:id', authMiddleware, fornecedorController.update);
fornecedorRoutes.delete('/:id', authMiddleware, fornecedorController.delete);
fornecedorRoutes.patch('/:id/toggle-status', authMiddleware, fornecedorController.toggleStatus);

// Representantes
fornecedorRoutes.post('/:id/representantes', authMiddleware, fornecedorController.addRepresentante);
fornecedorRoutes.put('/:id/representantes/:repId', authMiddleware, fornecedorController.updateRepresentante);
fornecedorRoutes.delete('/:id/representantes/:repId', authMiddleware, fornecedorController.removeRepresentante);

export { fornecedorRoutes };
