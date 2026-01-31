import axios from 'axios';

async function testPcaExtended() {
    const baseURL = 'http://localhost:3333';

    console.log('1. Fazendo login...');
    try {
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@gestaopropostas.gov.br',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login realizado com sucesso.');

        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n2. Criando PCA com campos estendidos...');
        const newPca = {
            ano: 2026,
            orgao: 'Secretaria de Inovação',
            denominacao: 'Plano de Inovação 2026',
            unidade_demandante: 'Diretoria de Tecnologia',
            area_tecnica: 'Gerência de Sistemas',
            contato_email: 'inovacao@gov.br',
            contato_telefone: '(61) 9999-8888',
            periodo_vigencia_inicio: '2026-01-01',
            periodo_vigencia_fim: '2026-12-31',
            autoridade_aprovadora: 'Secretário João Silva',
            cargo_autoridade: 'Secretário Municipal',
            observacoes: 'Teste de campos estendidos via script'
        };

        const createResponse = await axios.post(`${baseURL}/pcas`, newPca, { headers });
        console.log('✅ PCA criado:', createResponse.data.numero_pca);
        console.log('   Denominação:', createResponse.data.denominacao);
        console.log('   Unidade:', createResponse.data.unidade_demandante);

        const pcaId = createResponse.data.id;

        console.log('\n3. Atualizando PCA com mais informações...');
        const updateData = {
            situacao: 'EM_ANALISE', // Tentando atualizar um campo protegido (não deve funcionar para situacao diretamente no update geral se a lógica estiver certa, mas vamos testar os campos permitidos)
            historico_alteracoes: 'Primeira revisão do plano',
            forma_aprovacao: 'PORTARIA',
            documento_aprovacao: 'PORTARIA-123/2026'
        };

        const updateResponse = await axios.put(`${baseURL}/pcas/${pcaId}`, updateData, { headers });
        console.log('✅ PCA atualizado.');
        console.log('   Histórico:', updateResponse.data.historico_alteracoes);
        console.log('   Forma de Aprovação:', updateResponse.data.forma_aprovacao);

        console.log('\n4. Buscando detalhes do PCA...');
        const detailResponse = await axios.get(`${baseURL}/pcas/${pcaId}`, { headers });
        const pca = detailResponse.data;

        console.log('✅ Detalhes recuperados.');
        console.log('   ID:', pca.id);
        console.log('   Responsável Consolidação:', pca.responsavel_consolidacao ? 'OK' : 'N/A');

        console.log('\n5. Limpando dados de teste (Excluindo PCA)...');
        await axios.delete(`${baseURL}/pcas/${pcaId}`, {
            headers,
            data: { justificativa: 'Teste automatizado finalizado' }
        });
        console.log('✅ PCA excluído com sucesso.');

    } catch (error: any) {
        console.error('❌ Erro no teste:', error.response?.data || error.message);
    }
}

testPcaExtended();
