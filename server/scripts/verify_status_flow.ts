import { PrismaClient } from '@prisma/client';
import { ItemService } from '../src/services/itemService';
import { DemandaService } from '../src/services/demandaService';

const prisma = new PrismaClient();
const itemService = new ItemService();
const demandaService = new DemandaService();

async function run() {
    console.log('🚀 Starting Status Flow Verification...');

    // Clean up (Reverse order of dependencies)
    await prisma.preco.deleteMany();
    await prisma.item.deleteMany();
    await prisma.demanda.deleteMany();

    // Get PCA & User
    const pca = await prisma.pca.findFirst();
    const user = await prisma.usuario.findFirst(); // Just get any user

    if (!pca || !user) {
        console.error('Missing prerequisites (PCA/User). Run seed.');
        return;
    }

    console.log(`Using User: ${user.email} (ID: ${user.id})`);

    // 1. Create Demanda
    const demanda = await demandaService.create({
        pca_id: pca.id,
        descricao: 'Demanda Teste Status',
        justificativa_tecnica: 'Teste',
        justificativa_administrativa: 'Teste',
        unidade_demandante: 'TI',
        centro_custo: 'CC-01',
        prazo_vigencia_meses: 12,
        tipo_contratacao: 'NOVA',
        natureza_despesa: 'CUSTEIO',
        elemento_despesa: '33.90.30',
        data_prevista_contratacao: new Date()
    }, user.id);

    console.log(`1. Demanda Created. Status: ${demanda.status} (Expected: CADASTRADA)`);

    // 2. Add Item
    const item = await itemService.create({
        demanda_id: demanda.id,
        descricao: 'Item 1 - Papel',
        unidade_medida: 'UN',
        quantidade: 10,
        elemento_despesa: '3.3.90.30'
    });

    const demandaAfterItem = await prisma.demanda.findUnique({ where: { id: demanda.id } });
    console.log(`2. Item Added. Status: ${demandaAfterItem?.status} (Expected: EM_ANALISE)`);

    // 3. Add Prices (3 prices)
    await prisma.preco.create({ data: { item_id: item.id, valor_unitario: 100, fonte: 'F1', cnpj_fornecedor: '111', ativo: true, classificacao: 'PENDENTE', tipo_fonte: 'COTACAO', data_coleta: new Date(), unidade_medida: 'UN', cadastrado_por_id: user.id } });
    await prisma.preco.create({ data: { item_id: item.id, valor_unitario: 110, fonte: 'F2', cnpj_fornecedor: '222', ativo: true, classificacao: 'PENDENTE', tipo_fonte: 'COTACAO', data_coleta: new Date(), unidade_medida: 'UN', cadastrado_por_id: user.id } });
    await prisma.preco.create({ data: { item_id: item.id, valor_unitario: 105, fonte: 'F3', cnpj_fornecedor: '333', ativo: true, classificacao: 'PENDENTE', tipo_fonte: 'COTACAO', data_coleta: new Date(), unidade_medida: 'UN', cadastrado_por_id: user.id } });

    // Trigger calc manually (simulate PrecoService)
    await itemService.calculateStats(item.id);

    const demandaFinal = await prisma.demanda.findUnique({ where: { id: demanda.id } });
    console.log(`3. 3 Prices Added. Status: ${demandaFinal?.status} (Expected: ESTIMADA)`);
}

run()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
