import axios from 'axios';

const API_URL = 'http://localhost:3333';

async function runVerification() {
    console.log('🚀 Starting Full Flow Verification...');

    try {
        // 1. Auth
        console.log('\n1. Authenticating as Admin...');
        const authRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@gestaopropostas.gov.br',
            password: 'admin123'
        });
        const token = authRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Authenticated. Token received.');

        // 2. PCA
        console.log('\n2. Creating PCA...');
        const pcaRes = await axios.post(`${API_URL}/pcas`, {
            ano: 2026,
            orgao: 'Secretaria de Testes Automatizados',
            numero_pca: `PCA-AUTO-${Date.now()}`,
            observacoes: 'PCA criado via script de verificação'
        }, { headers });
        const pcaId = pcaRes.data.id;
        console.log(`✅ PCA Created: ID ${pcaId}, ${pcaRes.data.numero_pca}`);

        // 3. Demanda
        console.log('\n3. Creating Demanda...');
        const demandaRes = await axios.post(`${API_URL}/demandas`, {
            pca_id: pcaId,
            descricao: 'Aquisição de Equipamentos de Informática',
            justificativa_tecnica: 'Necessário para automação',
            justificativa_administrativa: 'Modernização do parque',
            centro_custo: 'TI-01',
            prazo_vigencia_meses: 12,
            data_prevista_contratacao: new Date().toISOString(),
            tipo_contratacao: 'NOVA',
            natureza_despesa: 'INVESTIMENTO',
            elemento_despesa: '4.4.90.52',
            unidade_demandante: 'Setor de TI'
        }, { headers });
        const demandaId = demandaRes.data.id;
        console.log(`✅ Demanda Created: ID ${demandaId}, Código ${demandaRes.data.codigo_demanda}`);

        // 4. Item
        console.log('\n4. Creating Item...');
        const itemRes = await axios.post(`${API_URL}/itens`, {
            demanda_id: demandaId,
            descricao: 'Notebook i7 16GB SSD 512GB',
            unidade_medida: 'UN',
            quantidade: 10,
            elemento_despesa: '4.4.90.52'
        }, { headers });
        const itemId = itemRes.data.id;
        console.log(`✅ Item Created: ID ${itemId}, Desc: ${itemRes.data.descricao}`);

        // 5. Add Prices (Simulate Market Analysis)
        console.log('\n5. Adding Prices & Triggering Stats...');

        // Price 1: 5000
        await axios.post(`${API_URL}/precos`, {
            item_id: itemId,
            valor_unitario: 5000.00,
            fonte: 'Dell Store',
            tipo_fonte: 'SITE',
            data_coleta: new Date(),
            unidade_medida: 'UN'
        }, { headers });
        console.log('   -> Added Price: R$ 5.000,00');

        // Price 2: 6000
        await axios.post(`${API_URL}/precos`, {
            item_id: itemId,
            valor_unitario: 6000.00,
            fonte: 'HP Store',
            tipo_fonte: 'SITE',
            data_coleta: new Date(),
            unidade_medida: 'UN'
        }, { headers });
        console.log('   -> Added Price: R$ 6.000,00');

        // Price 3: 5500
        await axios.post(`${API_URL}/precos`, {
            item_id: itemId,
            valor_unitario: 5500.00,
            fonte: 'Lenovo Store',
            tipo_fonte: 'SITE',
            data_coleta: new Date(),
            unidade_medida: 'UN'
        }, { headers });
        console.log('   -> Added Price: R$ 5.500,00');

        // 6. Verify Calculation (Median should be 5500, Mean 5500)
        console.log('\n6. Verifying Item Stats...');
        // Using the specific endpoint that gets item details (which should now have updated values)
        // Since listByDemanda returns items with precos, we can use that logic or we'd ideally have a GET /itens/:id
        // But our Controller list uses query params. Let's list by Demanda and find our item.
        const itemListRes = await axios.get(`${API_URL}/itens?demanda_id=${demandaId}`, { headers });
        const updatedItem = itemListRes.data.find((i: any) => i.id === itemId);

        console.log('   -> Item Updated Info:', {
            valor_estimado_unitario: updatedItem.valor_estimado_unitario,
            valor_estimado_total: updatedItem.valor_estimado_total
        });

        if (Number(updatedItem.valor_estimado_unitario) === 5500) {
            console.log('✅ SUCCESS: Median (5500) correctly applied as Unit Value.');
        } else {
            console.error('❌ FAILURE: Unexpected Unit Value.');
        }

        if (Number(updatedItem.valor_estimado_total) === 55000) {
            console.log('✅ SUCCESS: Total Value (5500 * 10 = 55000) correctly calculated.');
        } else {
            console.error('❌ FAILURE: Unexpected Total Value.');
        }

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
            console.error('Status:', error.response.status);
        } else if (error.code) {
            console.error('Code:', error.code);
        }
    }
}

runVerification();
