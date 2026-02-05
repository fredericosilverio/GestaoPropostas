"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret_key';
class AuthService {
    async login(email, senha_plana) {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });
        if (!usuario) {
            fs.appendFileSync('debug.log', `User not found: ${email}\n`);
            throw new Error('Credenciais inválidas');
        }
        if (!usuario.ativo) {
            throw new Error('Usuário inativo');
        }
        // Se senha_hash for nulo (ex: usuário AD), falha no login local
        if (!usuario.senha_hash) {
            throw new Error('Método de autenticação incorreto para este usuário');
        }
        const senhaValida = await bcryptjs_1.default.compare(senha_plana, usuario.senha_hash);
        if (!senhaValida) {
            await this.registerFailedAttempt(usuario.id, usuario.tentativas_falhas);
            throw new Error('Credenciais inválidas');
        }
        await this.resetFailedAttempts(usuario.id);
        const token = this.generateToken(usuario);
        return { usuario: this.sanitizeUser(usuario), token };
    }
    // Apenas para Admin ou Seed inicial
    async register(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.senha, 10);
        const usuario = await prisma.usuario.create({
            data: {
                ...data,
                senha_hash: hashedPassword,
                // Remove senha do objeto data para não tentar salvar campo inexistente
                senha: undefined
            },
        });
        return this.sanitizeUser(usuario);
    }
    generateToken(usuario) {
        return jsonwebtoken_1.default.sign({
            id: usuario.id,
            email: usuario.email,
            perfil: usuario.perfil
        }, JWT_SECRET, { expiresIn: '8h' });
    }
    sanitizeUser(usuario) {
        const { senha_hash, ...userWithoutPassword } = usuario;
        return userWithoutPassword;
    }
    async registerFailedAttempt(userId, currentAttempts) {
        // TODO: Implementar bloqueio após X tentativas
        await prisma.usuario.update({
            where: { id: userId },
            data: { tentativas_falhas: currentAttempts + 1 }
        });
    }
    async resetFailedAttempts(userId) {
        await prisma.usuario.update({
            where: { id: userId },
            data: { tentativas_falhas: 0, ultimo_acesso: new Date() }
        });
    }
}
exports.AuthService = AuthService;
