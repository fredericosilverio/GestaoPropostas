import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/pcas', label: 'Meus PCAs', icon: '📋' },
    { path: '/demandas', label: 'Demandas', icon: '📝' },
    { path: '/fornecedores', label: 'Fornecedores', icon: '🏢' },
    { path: '/audit', label: 'Auditoria', icon: '🔍' },
    { path: '/usuarios', label: 'Usuários', icon: '👥' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    // Get current page title
    const currentPage = navItems.find(item => isActive(item.path))?.label || 'Dashboard';

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 transform transition-transform duration-200 ease-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">Gestão Propostas</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700"
                        aria-label="Fechar menu"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive(item.path)
                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                }`}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.nome_completo}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.perfil}</p>
                        </div>
                        <button
                            onClick={signOut}
                            className="ml-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Sair do sistema"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between px-4 md:px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700"
                            aria-label="Abrir menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {currentPage}
                        </h2>
                    </div>

                    {/* Desktop user info + Theme Toggle */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                            {user?.nome_completo}
                        </span>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
