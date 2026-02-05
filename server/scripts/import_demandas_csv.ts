
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const CSV_PATH = 'c:\\DEV\\GestaoPropostas\\Lista dos PCA.csv';

const MONTH_MAP: Record<string, number> = {
    'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'MARCO': 2, 'ABRIL': 3,
    'MAIO': 4, 'JUNHO': 5, 'JULHO': 6, 'AGOSTO': 7,
    'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
};

function parseCurrency(value: string): number {
    if (!value) return 0;
    // Remove "R$", dots, and replace comma with dot
    const clean = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(clean);
}

function parseDate(monthName: string, year: number): Date {
    const monthIndex = MONTH_MAP[monthName.toUpperCase().trim()];
    if (monthIndex === undefined) {
        console.warn(`Mês desconhecido: ${monthName}, usando Janeiro.`);
        return new Date(year, 0, 1);
    }
    return new Date(year, monthIndex, 1);
}

async function main() {
    console.log('Iniciando importação de demandas...');

    if (!fs.existsSync(CSV_PATH)) {
        console.error(`Arquivo não encontrado: ${CSV_PATH}`);
        process.exit(1);
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);

    // Skip header
    const dataLines = lines.slice(1);

    // Get Admin user for responsavel_id
    const adminUser = await prisma.usuario.findFirst({
        where: { perfil: 'ADMIN' }
    });

    if (!adminUser) {
        console.error('Nenhum usuário ADMIN encontrado para associar as demandas.');
        process.exit(1);
    }

    console.log(`Usando usuário responsável: ${adminUser.nome_completo} (ID: ${adminUser.id})`);

    let importedCount = 0;
    let errorCount = 0;

    for (const line of dataLines) {
        try {
            const cols = line.split(';');
            if (cols.length < 9) {
                console.warn(`Linha inválida (colunas insuficientes): ${line}`);
                continue;
            }

            const pcaId = parseInt(cols[0].trim());
            const codigoDemanda = cols[1].trim();
            const justificativaAdm = cols[2].trim();
            const descricao = cols[3].trim();
            const justificativaTecnica = cols[4].trim();
            const valorEstimadoStr = cols[5].trim();
            const mesPrevisto = cols[6].trim();
            const tipoContratacaoRaw = cols[7].trim();
            const naturezaDespesaRaw = cols[8].trim();

            // Fetch PCA to get year
            const pca = await prisma.pca.findUnique({ where: { id: pcaId } });
            if (!pca) {
                console.error(`PCA ID ${pcaId} não encontrado. Pulando linha.`);
                errorCount++;
                continue;
            }

            // Mappings
            const dataPrevista = parseDate(mesPrevisto, pca.ano);
            const valorEstimado = parseCurrency(valorEstimadoStr);
            
            let tipoContratacao = tipoContratacaoRaw.toUpperCase();
            if (tipoContratacao === 'NOVA CONTRATAÇÃO' || tipoContratacao === 'NOVA CONTRATACAO') {
                tipoContratacao = 'NOVA';
            } else if (tipoContratacao === 'RENOVAÇÃO') {
                tipoContratacao = 'RENOVACAO'; // Assuming simplified enum
            }

            let naturezaDespesa = naturezaDespesaRaw.toUpperCase();
            // Ensure matches existing data patterns if needed

            // Check if exists
            const existing = await prisma.demanda.findUnique({
                where: { codigo_demanda: codigoDemanda }
            });

            if (existing) {
                console.log(`Demanda ${codigoDemanda} já existe. Atualizando...`);
                await prisma.demanda.update({
                    where: { id: existing.id },
                    data: {
                        descricao,
                        justificativa_administrativa: justificativaAdm,
                        justificativa_tecnica: justificativaTecnica,
                        valor_estimado_global: valorEstimado,
                        data_prevista_contratacao: dataPrevista,
                        tipo_contratacao: tipoContratacao,
                        natureza_despesa: naturezaDespesa,
                        // Update defaults just in case
                        unidade_demandante: 'CITEC', // Inferred from CSV descriptions like "CITEC..."
                    }
                });
            } else {
                console.log(`Criando demanda ${codigoDemanda}...`);
                await prisma.demanda.create({
                    data: {
                        pca_id: pcaId,
                        codigo_demanda: codigoDemanda,
                        descricao,
                        justificativa_administrativa: justificativaAdm,
                        justificativa_tecnica: justificativaTecnica,
                        valor_estimado_global: valorEstimado,
                        data_prevista_contratacao: dataPrevista,
                        tipo_contratacao: tipoContratacao,
                        natureza_despesa: naturezaDespesa,
                        
                        // Defaults
                        numero_projeto: 0, 
                        elemento_despesa: '33.90.39', // Default generic service
                        unidade_demandante: 'CITEC',
                        responsavel_id: adminUser.id,
                        centro_custo: '0000',
                        prazo_vigencia_meses: 12,
                        status: 'CADASTRADA',
                        ativo: true
                    }
                });
            }
            importedCount++;

        } catch (err) {
            console.error(`Erro ao processar linha: ${line.substring(0, 50)}...`, err);
            errorCount++;
        }
    }

    console.log(`Importação concluída. Sucesso: ${importedCount}, Erros: ${errorCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
