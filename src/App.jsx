import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProyectoProvider } from './context/ProyectoContext';
import Layout from './components/layout/Layout';
import { LoadingSpinner } from './components/common';

// Páginas públicas
import LoginPage from './modules/auth/pages/LoginPage';

// Lazy loading de módulos
// Finanzas
const DashboardPage = lazy(() => import('./modules/finanzas/pages/DashboardPage'));
const ProyectosPage = lazy(() => import('./modules/finanzas/pages/ProyectosPage'));
const GastosPage = lazy(() => import('./modules/finanzas/pages/GastosPage'));
const ProveedoresPage = lazy(() => import('./modules/finanzas/pages/ProveedoresPage'));
const GaleriaPage = lazy(() => import('./modules/finanzas/pages/GaleriaPage'));
const DocumentosPage = lazy(() => import('./modules/finanzas/pages/DocumentosPage'));
const PerfilPage = lazy(() => import('./modules/auth/pages/PerfilPage'));

// Producción
const GalponesPage = lazy(() => import('./modules/produccion/pages/GalponesPage'));
const LotesPage = lazy(() => import('./modules/produccion/pages/LotesPage'));
const RecoleccionPage = lazy(() => import('./modules/produccion/pages/RecoleccionPage'));

// Alimentación
const FormulasPage = lazy(() => import('./modules/alimentacion/pages/FormulasPage'));

// Salud
const VacunacionesPage = lazy(() => import('./modules/salud/pages/VacunacionesPage'));

// Inventario
const InventarioPage = lazy(() => import('./modules/inventario/pages/InventarioPage'));

// Calendario
const CalendarioPage = lazy(() => import('./modules/calendario/pages/CalendarioPage'));

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
          {/* Dashboard */}
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          } />
          
          {/* Finanzas */}
          <Route path="proyectos" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProyectosPage />
            </Suspense>
          } />
          <Route path="gastos" element={
            <Suspense fallback={<LoadingSpinner />}>
              <GastosPage />
            </Suspense>
          } />
          <Route path="proveedores" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProveedoresPage />
            </Suspense>
          } />
          <Route path="galeria" element={
            <Suspense fallback={<LoadingSpinner />}>
              <GaleriaPage />
            </Suspense>
          } />
          <Route path="documentos" element={
            <Suspense fallback={<LoadingSpinner />}>
              <DocumentosPage />
            </Suspense>
          } />
          
          {/* Producción */}
          <Route path="produccion/galpones" element={
            <Suspense fallback={<LoadingSpinner />}>
              <GalponesPage />
            </Suspense>
          } />
          <Route path="produccion/lotes" element={
            <Suspense fallback={<LoadingSpinner />}>
              <LotesPage />
            </Suspense>
          } />
          <Route path="produccion/recoleccion" element={
            <Suspense fallback={<LoadingSpinner />}>
              <RecoleccionPage />
            </Suspense>
          } />
          
          {/* Alimentación */}
          <Route path="alimentacion/formulas" element={
            <Suspense fallback={<LoadingSpinner />}>
              <FormulasPage />
            </Suspense>
          } />
          
          {/* Salud */}
          <Route path="salud/vacunaciones" element={
            <Suspense fallback={<LoadingSpinner />}>
              <VacunacionesPage />
            </Suspense>
          } />
          
          {/* Inventario */}
          <Route path="inventario" element={
            <Suspense fallback={<LoadingSpinner />}>
              <InventarioPage />
            </Suspense>
          } />
          
          {/* Calendario */}
          <Route path="calendario" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CalendarioPage />
            </Suspense>
          } />
          
          {/* Perfil */}
          <Route path="perfil" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PerfilPage />
            </Suspense>
          } />
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