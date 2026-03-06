import { Router } from 'express';
import { ContatoFornecedorController } from '../controllers/contatoFornecedorController';
import { authMiddleware } from '../middlewares/authMiddleware';

const contatoRoutes = Router();
const contatoController = new ContatoFornecedorController();

// A rota mais específica deve vir primeiro
contatoRoutes.get('/relatorio', authMiddleware, contatoController.relatorio);
contatoRoutes.get('/reports/export', authMiddleware, contatoController.export);

contatoRoutes.get('/', authMiddleware, contatoController.list);
contatoRoutes.get('/:id', authMiddleware, contatoController.get);
contatoRoutes.post('/', authMiddleware, contatoController.create);
contatoRoutes.put('/:id', authMiddleware, contatoController.update);
contatoRoutes.delete('/:id', authMiddleware, contatoController.delete);

export { contatoRoutes };
