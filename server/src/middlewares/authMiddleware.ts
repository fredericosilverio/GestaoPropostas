import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret_key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no Token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // @ts-ignore
        req.user = decoded;
        return next();
    });
};

export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        const userRole = req.user?.perfil;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Acesso negado: Permissão insuficiente' });
        }

        return next();
    };
};
