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

    async listActive() {
        return prisma.usuario.findMany({
            where: { ativo: true },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                perfil: true
            },
            orderBy: { nome_completo: 'asc' }
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
        // Validate Uniqueness
        const existingEmail = await prisma.usuario.findUnique({ where: { email: data.email } });
        if (existingEmail) throw new Error('Email já cadastrado');

        const existingCpf = await prisma.usuario.findUnique({ where: { cpf: data.cpf } });
        if (existingCpf) throw new Error('CPF já cadastrado');

        const existingMatricula = await prisma.usuario.findUnique({ where: { matricula: data.matricula } });
        if (existingMatricula) throw new Error('Matrícula já cadastrada');

        const hashedPassword = await bcrypt.hash(data.senha || 'mudar123', 10);

        const user = await prisma.usuario.create({
            data: {
                ...data,
                senha_hash: hashedPassword,
                senha: undefined,
            },
        });

        const { senha_hash, ...rest } = user;
        return rest;
    }

    async update(id: number, data: any) {
        // Validation Checks for Update
        if (data.email) {
            const existing = await prisma.usuario.findFirst({
                where: { email: data.email, NOT: { id } }
            });
            if (existing) throw new Error('Email já está em uso por outro usuário');
        }

        if (data.cpf) {
            const existing = await prisma.usuario.findFirst({
                where: { cpf: data.cpf, NOT: { id } }
            });
            if (existing) throw new Error('CPF já cadastrado para outro usuário');
        }

        if (data.matricula) {
            const existing = await prisma.usuario.findFirst({
                where: { matricula: data.matricula, NOT: { id } }
            });
            if (existing) throw new Error('Matrícula já cadastrada para outro usuário');
        }

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
