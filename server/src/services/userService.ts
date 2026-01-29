import { PrismaClient, Usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
    async listResult() {
        return prisma.usuario.findMany({
            select: {
                id: true,
                nome_completo: true,
                email: true,
                matricula: true,
                perfil: true,
                unidade_vinculada: true,
                ativo: true,
            },
        });
    }

    async findById(id: number) {
        const user = await prisma.usuario.findUnique({
            where: { id },
        });
        if (!user) return null;
        const { senha_hash, ...rest } = user;
        return rest;
    }

    async create(data: any) {
        const existing = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(data.senha || 'mudar123', 10);

        const user = await prisma.usuario.create({
            data: {
                ...data,
                senha_hash: hashedPassword,
                senha: undefined, // remove raw password
            },
        });

        const { senha_hash, ...rest } = user;
        return rest;
    }

    async update(id: number, data: any) {
        // Se houver senha para atualizar
        if (data.senha) {
            data.senha_hash = await bcrypt.hash(data.senha, 10);
            delete data.senha;
        }

        const user = await prisma.usuario.update({
            where: { id },
            data,
        });

        const { senha_hash, ...rest } = user;
        return rest;
    }

    async delete(id: number) {
        // Soft delete (inativação) preferred usually, but PRD mentions Maintainability and soft delete.
        // Let's implement soft delete by default or hard delete if requested.
        // PRD Parte 5 mentions "Soft delete para dados".

        return prisma.usuario.update({
            where: { id },
            data: { ativo: false },
        });
    }
}
