"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    async login(req, res) {
        try {
            require('fs').appendFileSync('controller.log', `Login Request: ${JSON.stringify(req.body)}\n`);
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            require('fs').appendFileSync('controller.log', `Login Error: ${error.message}\nStack: ${error.stack}\n`);
            res.status(401).json({ error: error.message });
        }
    }
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async me(req, res) {
        // O usuário será injetado pelo middleware de auth
        // @ts-ignore
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        // @ts-ignore
        res.json(req.user);
    }
}
exports.AuthController = AuthController;
