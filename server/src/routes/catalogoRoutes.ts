import { Router } from 'express';
import { CatalogoController } from '../controllers/catalogoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const catalogoRoutes = Router();
const catalogoController = new CatalogoController();

catalogoRoutes.use(authMiddleware);

catalogoRoutes.get('/', catalogoController.list);
catalogoRoutes.get('/categorias', catalogoController.listCategorias);
catalogoRoutes.get('/:id', catalogoController.findById);
catalogoRoutes.post('/', catalogoController.create);
catalogoRoutes.put('/:id', catalogoController.update);
catalogoRoutes.delete('/:id', catalogoController.delete);
catalogoRoutes.post('/import', catalogoController.importToItem);

export { catalogoRoutes };
