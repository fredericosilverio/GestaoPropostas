"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new authController_1.AuthController();
authRoutes.post('/login', authController.login);
// Rota de registro protegida ou apenas para setup inicial
// authRoutes.post('/register', authController.register); 
authRoutes.get('/me', authMiddleware_1.authMiddleware, authController.me);
