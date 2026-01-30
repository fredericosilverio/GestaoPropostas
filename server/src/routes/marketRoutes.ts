import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { PrecoController } from '../controllers/precoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const itemRoutes = Router();
const precoRoutes = Router(); // We can separate or nest. 

const itemController = new ItemController();
const precoController = new PrecoController();

// Shared middleware
itemRoutes.use(authMiddleware);
precoRoutes.use(authMiddleware);

// Items
itemRoutes.get('/', itemController.list);
itemRoutes.post('/', itemController.create);
itemRoutes.put('/:id', itemController.update);
itemRoutes.delete('/:id', itemController.delete);

// Prices
precoRoutes.get('/', precoController.list);
precoRoutes.post('/', precoController.create);
precoRoutes.delete('/:id', precoController.delete);

export { itemRoutes, precoRoutes };
