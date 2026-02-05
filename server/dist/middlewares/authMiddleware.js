"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret_key';
const authMiddleware = (req, res, next) => {
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
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        // @ts-ignore
        req.user = decoded;
        return next();
    });
};
exports.authMiddleware = authMiddleware;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        // @ts-ignore
        const userRole = req.user?.perfil;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Acesso negado: Permissão insuficiente' });
        }
        return next();
    };
};
exports.authorizeRoles = authorizeRoles;
