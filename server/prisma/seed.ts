import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = [
        {
            nome_completo: 'Administrador do Sistema',
            cpf: '00000000000',
            matricula: 'ADMIN01',
            email: 'admin@gestaopropostas.gov.br',
            senha_hash: hashedPassword,
            perfil: 'ADMIN',
            ativo: true,
        },
        {
            nome_completo: 'Frederico Silvério Duarte',
            cpf: '94340650110',
            matricula: '5132541',
            email: 'fsduarte@tjgo.jus.br',
            senha_hash: hashedPassword,
            perfil: 'ADMIN',
            ativo: true,
        },
    ];

    for (const userData of users) {
        const existingUser = await prisma.usuario.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            console.log(`User already exists: ${userData.email}`);
        } else {
            const user = await prisma.usuario.create({
                data: userData,
            });
            console.log(`User created: ${user.email}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
