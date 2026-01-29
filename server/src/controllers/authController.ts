import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const result = await authService.login(email, senha);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async me(req: Request, res: Response) {
        // O usuário será injetado pelo middleware de auth
        // @ts-ignore
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        // @ts-ignore
        res.json(req.user);
    }
}
