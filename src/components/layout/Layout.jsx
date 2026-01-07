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
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { proyectoActivo } = useProyecto();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Gastos', href: '/gastos', icon: Receipt },
    { name: 'Proyectos', href: '/proyectos', icon: FolderOpen },
    { name: 'Proveedores', href: '/proveedores', icon: Users },
    { name: 'Galería', href: '/galeria', icon: Image },
    { name: 'Documentos', href: '/documentos', icon: FileText },
    { name: 'Inventario', href: '/inventario', icon: Package },
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
      `}>
        {/* Logo - Branding Avícola */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 relative overflow-hidden">
              {/* Icono de huevo estilizado */}
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
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proyecto activo */}
        {proyectoActivo && (
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <p className="text-xs font-medium text-emerald-600 mb-1">Proyecto Activo</p>
            <p className="font-semibold text-gray-900 truncate">{proyectoActivo.nombre}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(proyectoActivo.porcentaje_consumido || 0, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-emerald-700">
                {proyectoActivo.porcentaje_consumido?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
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
                  transition-all duration-200
                  ${active 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-emerald-600' : ''}`} />
                {item.name}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section - clickeable para ir a perfil */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <NavLink
            to="/perfil"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
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
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex-none" />

            {/* Saldo disponible con icono de huevo */}
            {proyectoActivo && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <Egg className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Saldo: {Number(proyectoActivo.saldo_restante).toLocaleString('es-BO')} Bs
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
