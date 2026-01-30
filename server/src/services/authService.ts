import { PrismaClient, Usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret_key';

export class AuthService {
    async login(email: string, senha_plana: string) {
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

        const senhaValida = await bcrypt.compare(senha_plana, usuario.senha_hash);

        if (!senhaValida) {
            await this.registerFailedAttempt(usuario.id, usuario.tentativas_falhas);
            throw new Error('Credenciais inválidas');
        }

        await this.resetFailedAttempts(usuario.id);

        const token = this.generateToken(usuario);

        return { usuario: this.sanitizeUser(usuario), token };
    }

    // Apenas para Admin ou Seed inicial
    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.senha, 10);

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

    private generateToken(usuario: Usuario) {
        return jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                perfil: usuario.perfil
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
    }

    private sanitizeUser(usuario: Usuario) {
        const { senha_hash, ...userWithoutPassword } = usuario;
        return userWithoutPassword;
    }

    private async registerFailedAttempt(userId: number, currentAttempts: number) {
        // TODO: Implementar bloqueio após X tentativas
        await prisma.usuario.update({
            where: { id: userId },
            data: { tentativas_falhas: currentAttempts + 1 }
        });
    }

    private async resetFailedAttempts(userId: number) {
        await prisma.usuario.update({
            where: { id: userId },
            data: { tentativas_falhas: 0, ultimo_acesso: new Date() }
        });
    }
}
