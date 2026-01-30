import { Router } from 'express';
import { DemandaController } from '../controllers/demandaController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const demandaRoutes = Router();
const demandaController = new DemandaController();

demandaRoutes.use(authMiddleware);

demandaRoutes.get('/', demandaController.list);
demandaRoutes.get('/:id', demandaController.get);
demandaRoutes.post('/', demandaController.create); // Any authenticated user can create? Or just Unit Demandante?
// For now, allow logged in users (mostly Operadores/Demandantes) to create.
// Specific roles can be locked down if needed.

demandaRoutes.put('/:id', demandaController.update);
demandaRoutes.patch('/:id/status', demandaController.changeStatus);
demandaRoutes.post('/:id/initiate-contracting', demandaController.initiateContracting);
demandaRoutes.post('/:id/finalize-contract', demandaController.finalizeContract);
demandaRoutes.delete('/:id', demandaController.delete);

export { demandaRoutes };
