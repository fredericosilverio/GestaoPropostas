import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Gestão Propostas API Running');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
