import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { PcaList } from './pages/pcas/PcaList';
import { PcaForm } from './pages/pcas/PcaForm';
import { PcaDetail } from './pages/pcas/PcaDetail';
import { DemandaList } from './pages/demandas/DemandaList';
import { DemandaForm } from './pages/demandas/DemandaForm';
import { DemandaDetail } from './pages/demandas/DemandaDetail';
import { ProposalEntry } from './pages/demandas/ProposalEntry';
import { ItemForm } from './pages/demandas/ItemForm';
import { PriceManager } from './pages/demandas/PriceManager';
import { ReportPage } from './pages/reports/ReportPage';
import { UsuarioList } from './pages/usuarios/UsuarioList';
import { UsuarioForm } from './pages/usuarios/UsuarioForm';
import { FornecedorList } from './pages/fornecedores/FornecedorList';
import { FornecedorForm } from './pages/fornecedores/FornecedorForm';
import { AuditPage } from './pages/admin/AuditPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { LoadingOverlay } from './components/LoadingSpinner';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <LoadingOverlay message="Verificando autenticação..." />
      </div>
    );
  }

  return signed ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <LoadingOverlay message="Carregando..." />
      </div>
    );
  }

  return signed ? <Navigate to="/dashboard" /> : <>{children}</>;
};

// Wrapper component for private routes with layout
const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateRoute>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </PrivateRoute>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />

              {/* PCAs */}
              <Route path="/pcas" element={<PrivateLayout><PcaList /></PrivateLayout>} />
              <Route path="/pcas/new" element={<PrivateLayout><PcaForm /></PrivateLayout>} />
              <Route path="/pcas/:id" element={<PrivateLayout><PcaDetail /></PrivateLayout>} />
              <Route path="/pcas/:id/edit" element={<PrivateLayout><PcaForm /></PrivateLayout>} />

              {/* Demandas */}
              <Route path="/demandas" element={<PrivateLayout><DemandaList /></PrivateLayout>} />
              <Route path="/demandas/new" element={<PrivateLayout><DemandaForm /></PrivateLayout>} />
              <Route path="/demandas/:id" element={<PrivateLayout><DemandaDetail /></PrivateLayout>} />
              <Route path="/demandas/:id/proposta-lote" element={<PrivateLayout><ProposalEntry /></PrivateLayout>} />
              <Route path="/demandas/:demandaId/itens/novo" element={<PrivateLayout><ItemForm /></PrivateLayout>} />

              {/* Items & Prices */}
              <Route path="/itens/:itemId/precos" element={<PrivateLayout><PriceManager /></PrivateLayout>} />

              {/* Reports */}
              <Route path="/reports/market-analysis/:id" element={<PrivateLayout><ReportPage /></PrivateLayout>} />

              {/* Usuarios */}
              <Route path="/usuarios" element={<PrivateLayout><UsuarioList /></PrivateLayout>} />
              <Route path="/usuarios/new" element={<PrivateLayout><UsuarioForm /></PrivateLayout>} />
              <Route path="/usuarios/:id" element={<PrivateLayout><UsuarioForm /></PrivateLayout>} />

              {/* Fornecedores */}
              <Route path="/fornecedores" element={<PrivateLayout><FornecedorList /></PrivateLayout>} />
              <Route path="/fornecedores/novo" element={<PrivateLayout><FornecedorForm /></PrivateLayout>} />
              <Route path="/fornecedores/:id" element={<PrivateLayout><FornecedorForm /></PrivateLayout>} />

              {/* Admin */}
              <Route path="/audit" element={<PrivateLayout><AuditPage /></PrivateLayout>} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
