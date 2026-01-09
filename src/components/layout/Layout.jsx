import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProyecto } from '../../context/ProyectoContext';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Users,
  Image,
  FileText,
  Package,
  LogOut,
  Menu,
  X,
  Egg,
  Building2,
  UtensilsCrossed,
  Syringe,
  Calendar,
  Layers,
  ShoppingBasket,
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { proyectoActivo } = useProyecto();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    // Dashboard
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, module: 'dashboard' },
    
    // Finanzas
    { name: 'Proyectos', href: '/proyectos', icon: FolderOpen, module: 'finanzas' },
    { name: 'Gastos', href: '/gastos', icon: Receipt, module: 'finanzas' },
    { name: 'Proveedores', href: '/proveedores', icon: Users, module: 'finanzas' },
    { name: 'Galería', href: '/galeria', icon: Image, module: 'finanzas' },
    { name: 'Documentos', href: '/documentos', icon: FileText, module: 'finanzas' },
    
    // Producción
    { name: 'Galpones', href: '/produccion/galpones', icon: Building2, module: 'produccion' },
    { name: 'Lotes', href: '/produccion/lotes', icon: Layers, module: 'produccion' },
    { name: 'Recolección', href: '/produccion/recoleccion', icon: ShoppingBasket, module: 'produccion' },
    
    // Alimentación
    { name: 'Fórmulas', href: '/alimentacion/formulas', icon: UtensilsCrossed, module: 'alimentacion' },
    
    // Salud
    { name: 'Vacunaciones', href: '/salud/vacunaciones', icon: Syringe, module: 'salud' },
    
    // Inventario
    { name: 'Inventario', href: '/inventario', icon: Package, module: 'inventario' },
    
    // Calendario
    { name: 'Calendario', href: '/calendario', icon: Calendar, module: 'calendario' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        will-change-transform
      `}>
        {/* Logo - Branding Avícola */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 relative overflow-hidden">
              <Egg className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/10 rounded-xl" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">El Campo</h1>
              <p className="text-xs text-emerald-600 font-medium">Granja Avícola</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proyecto activo */}
        {proyectoActivo && (
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex-shrink-0">
            <p className="text-xs font-medium text-emerald-600 mb-1">Proyecto Activo</p>
            <p className="font-semibold text-gray-900 truncate">{proyectoActivo.nombre}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(proyectoActivo.porcentaje_consumido || 0, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-emerald-700">
                {proyectoActivo.porcentaje_consumido?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                  transition-all duration-200 ease-out
                  touch-manipulation
                  ${active 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-all duration-200 ${active ? 'text-emerald-600 scale-110' : 'group-hover:scale-110'}`} />
                <span className="flex-1">{item.name}</span>
                {active && (
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section - Fixed at bottom */}
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <NavLink
            to="/perfil"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 ease-out touch-manipulation active:scale-[0.98]"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.first_name || user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Ver perfil
              </p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-150 ease-out touch-manipulation"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex-none" />

            {/* Saldo disponible con icono de huevo */}
            {proyectoActivo && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm transition-all duration-200 hover:shadow-md">
                <Egg className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Saldo: {Number(proyectoActivo.saldo_restante).toLocaleString('es-BO')} Bs
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
