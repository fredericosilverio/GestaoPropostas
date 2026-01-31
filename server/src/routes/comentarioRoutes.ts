import { Router } from 'express';
import { ComentarioController } from '../controllers/comentarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const comentarioRoutes = Router();
const comentarioController = new ComentarioController();

comentarioRoutes.use(authMiddleware);

comentarioRoutes.get('/', comentarioController.list);
comentarioRoutes.post('/', comentarioController.create);
comentarioRoutes.put('/:id', comentarioController.update);
comentarioRoutes.delete('/:id', comentarioController.delete);

export { comentarioRoutes };
