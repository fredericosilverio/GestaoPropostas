import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { pcaRoutes } from './routes/pcaRoutes';
import { demandaRoutes } from './routes/demandaRoutes';

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
