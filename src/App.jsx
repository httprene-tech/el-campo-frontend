import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProyectoProvider } from './context/ProyectoContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProyectosPage from './pages/ProyectosPage';
import GastosPage from './pages/GastosPage';
import ProveedoresPage from './pages/ProveedoresPage';
import GaleriaPage from './pages/GaleriaPage';
import DocumentosPage from './pages/DocumentosPage';
import InventarioPage from './pages/InventarioPage';
import PerfilPage from './pages/PerfilPage';
import { LoadingSpinner } from './components/common';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para redirigir si ya está logueado
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Cargando..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública - Login */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Rutas Protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <ProyectoProvider>
                <Layout />
              </ProyectoProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="proyectos" element={<ProyectosPage />} />
          <Route path="gastos" element={<GastosPage />} />
          <Route path="proveedores" element={<ProveedoresPage />} />
          <Route path="galeria" element={<GaleriaPage />} />
          <Route path="documentos" element={<DocumentosPage />} />
          <Route path="inventario" element={<InventarioPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>

        {/* Ruta por defecto - Redirige a Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;