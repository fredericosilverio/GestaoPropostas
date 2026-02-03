import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingOverlay } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface Usuario {
    id: number;
    nome_completo: string;
    email: string;
    matricula: string;
    perfil: string;
    unidade_vinculada?: string;
    ativo: boolean;
}

export function UsuarioList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth(); // To check permissions
    const { addToast } = useToast();

    useEffect(() => {
        loadUsuarios();
    }, []);

    async function loadUsuarios() {
        try {
            const response = await api.get('/users');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários', error);
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar lista de usuários' });
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus(id: number, currentStatus: boolean) {
        if (!window.confirm(`Deseja realmente ${currentStatus ? 'desativar' : 'ativar'} este usuário?`)) return;

        try {
            await api.put(`/users/${id}`, { ativo: !currentStatus });
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !currentStatus } : u));
            addToast({ type: 'success', title: 'Sucesso', description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.` });
        } catch (err) {
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao alterar status do usuário' });
        }
    }

    const filteredUsuarios = usuarios.filter(u =>
        u.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.matricula.includes(searchTerm)
    );

    if (loading) return <LoadingOverlay message="Carregando usuários..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestão de Usuários</h1>
                <button
                    onClick={() => navigate('/usuarios/new')}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
                    <span>+</span> Novo Usuário
                </button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                <div className="flex-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou matrícula..."
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-zinc-700 dark:text-white sm:text-sm py-2"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredUsuarios.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="Nenhum usuário encontrado"
                    description="Não há usuários cadastrados ou correspondentes à busca."
                    action={{
                        label: 'Cadastrar Usuário',
                        onClick: () => navigate('/usuarios/new')
                    }}
                />
            ) : (
                <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-gray-50 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matrícula</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Perfil</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Unidade</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                    {usuario.nome_completo.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{usuario.nome_completo}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{usuario.matricula}</td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.perfil === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                    usuario.perfil === 'GESTOR' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {usuario.perfil}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                                            {usuario.unidade_vinculada || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => toggleStatus(usuario.id, usuario.ativo)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${usuario.ativo ? 'bg-green-600' : 'bg-gray-200'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${usuario.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => navigate(`/usuarios/${usuario.id}`)}
                                                className="text-primary hover:text-primary-light">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
