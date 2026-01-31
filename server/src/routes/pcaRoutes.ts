import { Router } from 'express';
import { PcaController } from '../controllers/pcaController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const pcaRoutes = Router();
const pcaController = new PcaController();

pcaRoutes.use(authMiddleware);

console.log('[pcaRoutes] Registrando rotas...');

// Listagem e visualização (todos os usuários autenticados)
pcaRoutes.get('/', (req, res) => pcaController.list(req, res));
console.log('[pcaRoutes] Rota GET /statistics registrada');
pcaRoutes.get('/statistics', (req, res) => {
    console.log('[pcaRoutes] >>> ROTA /statistics CHAMADA');
    pcaController.getStatistics(req, res);
});
pcaRoutes.get('/:id', (req, res) => {
    console.log('[pcaRoutes] >>> ROTA /:id CHAMADA com id:', req.params.id);
    pcaController.get(req, res);
});
pcaRoutes.get('/:id/versions', (req, res) => pcaController.getVersionHistory(req, res));

// Criação, edição e exclusão (apenas ADMIN e GESTOR)
pcaRoutes.post('/', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.create);
pcaRoutes.put('/:id', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.update);
pcaRoutes.delete('/:id', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.delete);

// Alteração de status e versionamento (apenas ADMIN e GESTOR)
pcaRoutes.patch('/:id/status', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.changeStatus);
pcaRoutes.post('/:id/version', authorizeRoles(['ADMIN', 'GESTOR']), pcaController.createVersion);

export { pcaRoutes };

