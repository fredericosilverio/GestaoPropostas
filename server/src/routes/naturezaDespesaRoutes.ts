import { Router } from 'express';
import { NaturezaDespesaController } from '../controllers/naturezaDespesaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const naturezaDespesaRoutes = Router();
const controller = new NaturezaDespesaController();

naturezaDespesaRoutes.use(authMiddleware);

naturezaDespesaRoutes.get('/', controller.list);
naturezaDespesaRoutes.get('/:id', controller.get);
naturezaDespesaRoutes.post('/', controller.create);
naturezaDespesaRoutes.put('/:id', controller.update);
naturezaDespesaRoutes.delete('/:id', controller.delete);

export { naturezaDespesaRoutes };
