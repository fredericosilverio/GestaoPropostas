import axios from 'axios';

async function testStatistics() {
    const baseURL = 'http://localhost:3333';

    console.log('1. Fazendo login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: 'admin@gestaopropostas.gov.br',
        password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('Token obtido:', token.substring(0, 50) + '...');

    console.log('\n2. Buscando estatísticas...');
    const statsResponse = await axios.get(`${baseURL}/pcas/statistics`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('Resposta da API:');
    console.log(JSON.stringify(statsResponse.data, null, 2));
}

testStatistics().catch(err => {
    console.error('Erro:', err.response?.data || err.message);
});
