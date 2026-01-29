import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  return signed ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  return signed ? <Navigate to="/dashboard" /> : <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Temporary Dashboard Component integrated for verification
function DashboardLayout() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 font-sans text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-center">
          <h1 className="text-xl font-bold text-primary">Gestão Propostas</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Meus PCAs
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Demandas
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="max-w-[100px]">
                <p className="text-sm font-medium truncate">{user?.nome_completo}</p>
                <p className="text-xs text-gray-500 truncate">{user?.perfil}</p>
              </div>
            </div>
            <button onClick={signOut} className="text-xs text-red-500 hover:text-red-700">Sair</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">Menu</button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-gray-500">Bem vindo</h3>
              <p className="text-lg font-bold mt-2">{user?.email}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
