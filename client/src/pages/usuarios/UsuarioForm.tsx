import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface UsuarioFormData {
    nome_completo: string;
    email: string;
    cpf: string;
    matricula: string;
    telefone: string;
    perfil: string;
    unidade_vinculada: string;
    senha?: string;
    ativo: boolean;
}

export function UsuarioForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<UsuarioFormData>({
        nome_completo: '',
        email: '',
        cpf: '',
        matricula: '',
        telefone: '',
        perfil: 'OPERADOR',
        unidade_vinculada: '',
        ativo: true
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (id) {
            loadUsuario(Number(id));
        }
    }, [id]);

    async function loadUsuario(userId: number) {
        setLoading(true);
        try {
            const response = await api.get(`/users/${userId}`);
            const u = response.data;
            setFormData({
                nome_completo: u.nome_completo,
                email: u.email,
                cpf: u.cpf,
                matricula: u.matricula,
                telefone: u.telefone || '',
                perfil: u.perfil,
                unidade_vinculada: u.unidade_vinculada || '',
                ativo: u.ativo
            });
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao carregar usuário' });
            navigate('/usuarios');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setFormData(prev => ({ ...prev, cpf: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.nome_completo || !formData.email || !formData.cpf || !formData.matricula) {
            addToast({ type: 'error', title: 'Atenção', description: 'Preencha todos os campos obrigatórios' });
            return;
        }

        if (!id && !password) {
            addToast({ type: 'error', title: 'Atenção', description: 'Senha é obrigatória para novos usuários' });
            return;
        }

        if (password && password !== confirmPassword) {
            addToast({ type: 'error', title: 'Erro', description: 'As senhas não conferem' });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, ...(password ? { senha: password } : {}) };

            if (id) {
                await api.put(`/users/${id}`, payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Usuário atualizado com sucesso' });
            } else {
                await api.post('/users', payload);
                addToast({ type: 'success', title: 'Sucesso', description: 'Usuário criado com sucesso' });
            }
            navigate('/usuarios');
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao salvar usuário';
            addToast({ type: 'error', title: 'Erro', description: msg });
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{id ? 'Editar Usuário' : 'Novo Usuário'}</h1>
                <button onClick={() => navigate('/usuarios')} className="text-gray-500 hover:text-gray-700">Voltar</button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo *</label>
                        <input
                            type="text"
                            name="nome_completo"
                            value={formData.nome_completo}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Institucional *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                        />
                    </div>

                    {/* CPF */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF *</label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleCpfChange}
                            maxLength={14}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Matrícula */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Matrícula *</label>
                        <input
                            type="text"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Perfil */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perfil de Acesso *</label>
                        <select
                            name="perfil"
                            value={formData.perfil}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                        >
                            <option value="OPERADOR">Operador</option>
                            <option value="GESTOR">Gestor</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    {/* Unidade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade Vinculada</label>
                        <input
                            type="text"
                            name="unidade_vinculada"
                            value={formData.unidade_vinculada}
                            onChange={handleChange}
                            placeholder="Ex: DITI, GAC..."
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                        />
                    </div>

                    {/* Senha */}
                    <div className="col-span-2 pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Segurança</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {id ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                                    required={!id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmação de Senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white"
                                    required={!!password}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-zinc-700 gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/usuarios')}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Usuário'}
                    </button>
                </div>
            </form>
        </div>
    );
}
