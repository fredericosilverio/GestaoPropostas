"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
class UserController {
    async list(req, res) {
        try {
            const users = await userService.listResult();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async get(req, res) {
        try {
            const id = Number(req.params.id);
            const user = await userService.findById(id);
            if (!user)
                return res.status(404).json({ error: 'Usuário não encontrado' });
            // @ts-ignore
            return res.json(user); // Explicit return to satisfy void check if necessary, though express doesn't require it
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const user = await userService.update(id, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await userService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
