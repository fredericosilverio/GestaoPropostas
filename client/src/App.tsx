import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { PcaList } from './pages/pcas/PcaList';
import { PcaForm } from './pages/pcas/PcaForm';
import { DemandaList } from './pages/demandas/DemandaList';
import { DemandaForm } from './pages/demandas/DemandaForm';

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
              <DashboardLayout>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-gray-500">Bem vindo</h3>
                    {/* Stats placeholder */}
                  </div>
                </div>
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/pcas" element={
            <PrivateRoute>
              <DashboardLayout>
                <PcaList />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/pcas/new" element={
            <PrivateRoute>
              <DashboardLayout>
                <PcaForm />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/demandas" element={
            <PrivateRoute>
              <DashboardLayout>
                <DemandaList />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/demandas/new" element={
            <PrivateRoute>
              <DashboardLayout>
                <DemandaForm />
              </DashboardLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 font-sans text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-center">
          <h1 className="text-xl font-bold text-primary">Gestão Propostas</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Dashboard
          </Link>
          <Link to="/pcas" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Meus PCAs
          </Link>
          <Link to="/demandas" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Demandas
          </Link>
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">Menu</button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
