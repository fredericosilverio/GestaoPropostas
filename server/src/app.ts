import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { pcaRoutes } from './routes/pcaRoutes';
import { demandaRoutes } from './routes/demandaRoutes';
import { itemRoutes, precoRoutes } from './routes/marketRoutes';
import { reportRoutes } from './routes/reportRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Gestão Propostas API Running');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/pcas', pcaRoutes);
app.use('/demandas', demandaRoutes);
app.use('/itens', itemRoutes);
app.use('/precos', precoRoutes);
app.use('/reports', reportRoutes);
app.use('/dashboard', dashboardRoutes);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/debug-info', async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.json({
            cwd: process.cwd(),
            usersCount: users.length,
            users: users.map(u => ({ id: u.id, email: u.email })),
            env: process.env.DATABASE_URL
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
