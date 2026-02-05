"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authRoutes_1 = require("./routes/authRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const pcaRoutes_1 = require("./routes/pcaRoutes");
const demandaRoutes_1 = require("./routes/demandaRoutes");
const marketRoutes_1 = require("./routes/marketRoutes");
const reportRoutes_1 = require("./routes/reportRoutes");
const dashboardRoutes_1 = require("./routes/dashboardRoutes");
const auditRoutes_1 = require("./routes/auditRoutes");
// Import com tratamento de erro
let uploadRoutes;
let catalogoRoutes;
let comentarioRoutes;
try {
    uploadRoutes = require('./routes/uploadRoutes').uploadRoutes;
    console.log('✅ uploadRoutes loaded');
}
catch (err) {
    console.error('❌ Error loading uploadRoutes:', err.message);
    uploadRoutes = express_1.default.Router();
}
try {
    catalogoRoutes = require('./routes/catalogoRoutes').catalogoRoutes;
    console.log('✅ catalogoRoutes loaded');
}
catch (err) {
    console.error('❌ Error loading catalogoRoutes:', err.message);
    catalogoRoutes = express_1.default.Router();
}
try {
    comentarioRoutes = require('./routes/comentarioRoutes').comentarioRoutes;
    console.log('✅ comentarioRoutes loaded');
}
catch (err) {
    console.error('❌ Error loading comentarioRoutes:', err.message);
    comentarioRoutes = express_1.default.Router();
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Gestão Propostas API Running');
});
app.use('/auth', authRoutes_1.authRoutes);
app.use('/users', userRoutes_1.userRoutes);
app.use('/pcas', pcaRoutes_1.pcaRoutes);
app.use('/demandas', demandaRoutes_1.demandaRoutes);
app.use('/itens', marketRoutes_1.itemRoutes);
app.use('/precos', marketRoutes_1.precoRoutes);
app.use('/reports', reportRoutes_1.reportRoutes);
app.use('/dashboard', dashboardRoutes_1.dashboardRoutes);
app.use('/audit', auditRoutes_1.auditRoutes);
app.use('/uploads', uploadRoutes);
app.use('/catalogo', catalogoRoutes);
app.use('/comentarios', comentarioRoutes);
const fornecedorRoutes_1 = require("./routes/fornecedorRoutes");
app.use('/fornecedores', fornecedorRoutes_1.fornecedorRoutes);
// Serve static files
const path_1 = __importDefault(require("path"));
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
app.get('/debug-info', async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.json({
            cwd: process.cwd(),
            usersCount: users.length,
            users: users.map(u => ({ id: u.id, email: u.email })),
            env: process.env.DATABASE_URL
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(port, () => {
    console.log(`!!! VERIFICACAO DE VERSAO - V2 !!!`);
    console.log(`Server is running at http://localhost:${port}`);
    console.log('Registered routes:');
    console.log('  - /auth, /users, /pcas, /demandas, /itens, /precos');
    console.log('  - /reports, /dashboard, /audit, /uploads, /catalogo, /comentarios');
});
