import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@gestaopropostas.gov.br';
    const existingAdmin = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.usuario.create({
        data: {
            nome_completo: 'Administrador do Sistema',
            cpf: '00000000000',
            matricula: 'ADMIN01',
            email: adminEmail,
            senha_hash: hashedPassword,
            perfil: 'ADMIN',
            ativo: true,
        },
    });

    console.log(`Admin user created: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
