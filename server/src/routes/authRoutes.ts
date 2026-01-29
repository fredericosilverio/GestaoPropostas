import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login);
// Rota de registro protegida ou apenas para setup inicial
// authRoutes.post('/register', authController.register); 

authRoutes.get('/me', authMiddleware, authController.me);

export { authRoutes };
