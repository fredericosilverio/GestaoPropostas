import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingOverlay } from '../../components/LoadingSpinner';

export function FornecedorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    // Form Stats
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');

    // Endereço
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [cep, setCep] = useState('');

    // Contato
    const [responsavelLegal, setResponsavelLegal] = useState('');
    const [emailContato, setEmailContato] = useState('');
    const [telefoneContato, setTelefoneContato] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadFornecedor();
        }
    }, [id]);

    async function loadFornecedor() {
        try {
            const response = await api.get(`/fornecedores/${id}`);
            const data = response.data;

            setRazaoSocial(data.razao_social);
            setNomeFantasia(data.nome_fantasia || '');
            setCnpj(data.cnpj);
            setLogradouro(data.logradouro || '');
            setNumero(data.numero || '');
            setComplemento(data.complemento || '');
            setBairro(data.bairro || '');
            setCidade(data.cidade || '');
            setUf(data.uf || '');
            setCep(data.cep || '');
            setResponsavelLegal(data.responsavel_legal || '');
            setEmailContato(data.email_contato || '');
            setTelefoneContato(data.telefone_contato || '');
        } catch (error) {
            console.error('Erro ao carregar fornecedor', error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar dados do fornecedor' });
            navigate('/fornecedores');
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const data = {
            razao_social: razaoSocial,
            nome_fantasia: nomeFantasia,
            cnpj: cnpj.replace(/[^\d]/g, ''), // Clean CNPJ if mask is used (currently manual)
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep: cep.replace(/[^\d]/g, ''),
            responsavel_legal: responsavelLegal,
            email_contato: emailContato,
            telefone_contato: telefoneContato
        };

        try {
            if (isEditing) {
                await api.put(`/fornecedores/${id}`, data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Fornecedor atualizado com sucesso' });
            } else {
                await api.post('/fornecedores', data);
                addToast({ type: 'success', title: 'Sucesso', description: 'Fornecedor cadastrado com sucesso' });
            }
            navigate('/fornecedores');
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao salvar fornecedor';
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    }

    const formatCNPJ = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    };

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCnpj(formatCNPJ(e.target.value));
    };

    if (initialLoading) return <LoadingOverlay message="Carregando..." />;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 space-y-6">

                {/* Dados Principais */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b dark:border-zinc-700">Dados Principais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Razão Social *</label>
                            <input
                                type="text"
                                value={razaoSocial}
                                onChange={e => setRazaoSocial(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Fantasia</label>
                            <input
                                type="text"
                                value={nomeFantasia}
                                onChange={e => setNomeFantasia(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ *</label>
                            <input
                                type="text"
                                value={cnpj}
                                onChange={handleCnpjChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                                required
                                maxLength={18}
                            />
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b dark:border-zinc-700">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CEP</label>
                            <input
                                type="text"
                                value={cep}
                                onChange={e => setCep(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logradouro</label>
                            <input
                                type="text"
                                value={logradouro}
                                onChange={e => setLogradouro(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                            <input
                                type="text"
                                value={numero}
                                onChange={e => setNumero(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bairro</label>
                            <input
                                type="text"
                                value={bairro}
                                onChange={e => setBairro(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                            <input
                                type="text"
                                value={cidade}
                                onChange={e => setCidade(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">UF</label>
                            <input
                                type="text"
                                value={uf}
                                onChange={e => setUf(e.target.value)}
                                maxLength={2}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 uppercase"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complemento</label>
                            <input
                                type="text"
                                value={complemento}
                                onChange={e => setComplemento(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Contato */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b dark:border-zinc-700">Contato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsável Legal</label>
                            <input
                                type="text"
                                value={responsavelLegal}
                                onChange={e => setResponsavelLegal(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                            <input
                                type="email"
                                value={emailContato}
                                onChange={e => setEmailContato(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                            <input
                                type="text"
                                value={telefoneContato}
                                onChange={e => setTelefoneContato(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-zinc-700">
                    <button
                        type="button"
                        onClick={() => navigate('/fornecedores')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
