import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debug() {
    console.log('=== DEBUG STATISTICS ===\n');

    // 1. Verificar PCAs
    const pcas = await prisma.pca.findMany({
        where: { ativo: true },
        select: { id: true, ano: true, orgao: true, situacao: true }
    });
    console.log('PCAs ativos:', pcas);
    console.log('IDs de PCAs:', pcas.map(p => p.id));

    // 2. Verificar demandas
    const demandas = await prisma.demanda.findMany({
        select: {
            id: true,
            pca_id: true,
            ativo: true,
            status: true,
            tipo_contratacao: true,
            natureza_despesa: true,
            valor_estimado_global: true
        }
    });
    console.log('\nTodas as demandas:', demandas);

    // 3. Verificar demandas com filtro correto
    const pcaIds = pcas.map(p => p.id);
    const demandasFiltradas = await prisma.demanda.findMany({
        where: {
            pca_id: { in: pcaIds },
            ativo: true,
            status: { not: 'CANCELADA' }
        },
        select: {
            tipo_contratacao: true,
            natureza_despesa: true,
            valor_estimado_global: true
        }
    });
    console.log('\nDemandas filtradas para estatísticas:', demandasFiltradas);
    console.log('Total:', demandasFiltradas.length);

    await prisma.$disconnect();
}

debug().catch(console.error);
