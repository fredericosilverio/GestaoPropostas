import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
    async list(req: Request, res: Response) {
        try {
            const users = await userService.listResult();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const user = await userService.findById(id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            // @ts-ignore
            return res.json(user); // Explicit return to satisfy void check if necessary, though express doesn't require it
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const user = await userService.update(id, req.body);
            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await userService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
