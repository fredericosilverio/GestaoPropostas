import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

// Todas as rotas de usuários requerem autenticação
userRoutes.use(authMiddleware);

// Rota pública para usuários autenticados (lista simplificada para seleção)
userRoutes.get('/active', userController.listActive);

// Apenas ADMIN e GESTOR podem listar/criar/editar usuários
userRoutes.get('/', authorizeRoles(['ADMIN', 'GESTOR']), userController.list);
userRoutes.get('/:id', authorizeRoles(['ADMIN', 'GESTOR']), userController.get);
userRoutes.post('/', authorizeRoles(['ADMIN']), userController.create); // Criação restrita a ADMIN
userRoutes.put('/:id', authorizeRoles(['ADMIN']), userController.update);
userRoutes.delete('/:id', authorizeRoles(['ADMIN']), userController.delete);

export { userRoutes };
