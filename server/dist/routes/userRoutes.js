"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userController = new userController_1.UserController();
// Todas as rotas de usuários requerem autenticação
userRoutes.use(authMiddleware_1.authMiddleware);
// Apenas ADMIN e GESTOR podem listar/criar/editar usuários
userRoutes.get('/', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), userController.list);
userRoutes.get('/:id', (0, authMiddleware_1.authorizeRoles)(['ADMIN', 'GESTOR']), userController.get);
userRoutes.post('/', (0, authMiddleware_1.authorizeRoles)(['ADMIN']), userController.create); // Criação restrita a ADMIN
userRoutes.put('/:id', (0, authMiddleware_1.authorizeRoles)(['ADMIN']), userController.update);
userRoutes.delete('/:id', (0, authMiddleware_1.authorizeRoles)(['ADMIN']), userController.delete);
