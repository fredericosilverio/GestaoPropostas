import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking users...');
    const users = await prisma.usuario.findMany();
    console.log('Users found:', users.length);
    users.forEach(u => {
        console.log(`ID: ${u.id}, Email: ${u.email}, Hash: ${u.senha_hash.substring(0, 10)}...`);
    });
}

check();
