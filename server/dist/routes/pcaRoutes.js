"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pcaRoutes = void 0;
const express_1 = require("express");
const pcaController_1 = require("../controllers/pcaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const pcaRoutes = (0, express_1.Router)();
exports.pcaRoutes = pcaRoutes;
const pcaController = new pcaController_1.PcaController();
pcaRoutes.use(authMiddleware_1.authMiddleware);
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
pcaRoutes.post('/', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), pcaController.create);
pcaRoutes.put('/:id', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), pcaController.update);
pcaRoutes.delete('/:id', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), pcaController.delete);
// Alteração de status e versionamento (apenas ADMIN e GESTOR)
pcaRoutes.patch('/:id/status', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), pcaController.changeStatus);
pcaRoutes.post('/:id/version', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), pcaController.createVersion);
