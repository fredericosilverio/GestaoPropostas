import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
    const { currentTheme, toggleTheme, theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            {/* Botão simples de toggle */}
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                title={currentTheme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
                {currentTheme === 'dark' ? (
                    <span className="text-lg">☀️</span>
                ) : (
                    <span className="text-lg">🌙</span>
                )}
            </button>

            {/* Dropdown para seleção completa */}
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="hidden sm:block text-sm bg-gray-100 dark:bg-zinc-700 border-none rounded px-2 py-1 cursor-pointer"
            >
                <option value="light">☀️ Claro</option>
                <option value="dark">🌙 Escuro</option>
                <option value="system">💻 Sistema</option>
            </select>
        </div>
    );
}
