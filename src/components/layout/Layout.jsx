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
  Menu,
  X,
  Egg,
  Building2,
  UtensilsCrossed,
  Syringe,
  Calendar,
  Layers,
  ShoppingBasket,
  ChevronDown,
  Wallet,
  Factory,
  Settings,
  LogOut,
} from 'lucide-react';
import { PWAInstallBanner } from '../common';

const Layout = () => {
  const { user, logout } = useAuth();
  const { proyectoActivo } = useProyecto();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    finanzas: true,
    produccion: true,
    general: true,
  });
  const location = useLocation();

  // Navegación organizada por secciones
  const navigationSections = [
    {
      id: 'dashboard',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      ]
    },
    {
      id: 'finanzas',
      label: 'Finanzas',
      icon: Wallet,
      color: 'emerald',
      items: [
        { name: 'Proyectos', href: '/proyectos', icon: FolderOpen },
        { name: 'Gastos', href: '/gastos', icon: Receipt },
        { name: 'Proveedores', href: '/proveedores', icon: Users },
        { name: 'Galería', href: '/galeria', icon: Image },
        { name: 'Documentos', href: '/documentos', icon: FileText },
      ]
    },
    {
      id: 'produccion',
      label: 'Producción',
      icon: Factory,
      color: 'amber',
      items: [
        { name: 'Galpones', href: '/produccion/galpones', icon: Building2 },
        { name: 'Lotes', href: '/produccion/lotes', icon: Layers },
        { name: 'Recolección', href: '/produccion/recoleccion', icon: ShoppingBasket },
        { name: 'Fórmulas', href: '/alimentacion/formulas', icon: UtensilsCrossed },
        { name: 'Vacunaciones', href: '/salud/vacunaciones', icon: Syringe },
      ]
    },
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      color: 'slate',
      items: [
        { name: 'Inventario', href: '/inventario', icon: Package },
        { name: 'Calendario', href: '/calendario', icon: Calendar },
      ]
    },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getSectionColors = (color) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        hover: 'hover:bg-emerald-50',
        active: 'bg-emerald-100 text-emerald-700',
        dot: 'bg-emerald-500',
      },
      amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        hover: 'hover:bg-amber-50',
        active: 'bg-amber-100 text-amber-700',
        dot: 'bg-amber-500',
      },
      slate: {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        hover: 'hover:bg-slate-50',
        active: 'bg-slate-100 text-slate-700',
        dot: 'bg-slate-500',
      },
    };
    return colors[color] || colors.emerald;
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
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-40
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-xl lg:shadow-none
        will-change-transform
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <Egg className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">El Campo</h1>
              <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Granja Avícola</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Proyecto activo - Más compacto */}
        {proyectoActivo && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Proyecto Activo</p>
              <span className="text-xs font-bold text-emerald-700">
                {proyectoActivo.porcentaje_consumido?.toFixed(0) || 0}%
              </span>
            </div>
            <p className="font-semibold text-gray-900 text-sm truncate mb-2">{proyectoActivo.nombre}</p>
            <div className="h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(proyectoActivo.porcentaje_consumido || 0, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin scrollbar-thumb-gray-200">
          {navigationSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            const colors = getSectionColors(section.color);
            const isExpanded = expandedSections[section.id] !== false;
            const hasActiveItem = section.items.some(item => isActive(item.href));

            // Dashboard sin header de sección
            if (section.id === 'dashboard') {
              return (
                <div key={section.id} className="px-3 mb-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                          ${active 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : ''}`} />
                        <span>{item.name}</span>
                        {active && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                      </NavLink>
                    );
                  })}
                </div>
              );
            }

            return (
              <div key={section.id} className="mb-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors
                    ${hasActiveItem ? colors.text : 'text-gray-500'}
                    hover:bg-gray-50
                  `}
                >
                  <SectionIcon className="w-4 h-4" />
                  <span className="flex-1 text-xs font-bold uppercase tracking-wider">
                    {section.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                </button>

                {/* Section Items */}
                <div className={`
                  overflow-hidden transition-all duration-200 ease-out
                  ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-3 pb-2 space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                            ${active 
                              ? colors.active 
                              : `text-gray-600 ${colors.hover}`
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 ${active ? '' : 'text-gray-600'}`} />
                          <span className="flex-1">{item.name}</span>
                          {active && <div className={`w-1 h-1 ${colors.dot} rounded-full`} />}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>

                {/* Divider between sections */}
                {sectionIndex < navigationSections.length - 1 && section.id !== 'dashboard' && (
                  <div className="mx-5 my-2 border-t border-gray-100" />
                )}
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <NavLink
            to="/perfil"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-100 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.first_name || user?.username}
              </p>
              <p className="text-xs text-gray-500">Ver perfil</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1" />

            {/* Saldo disponible */}
            {proyectoActivo && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100/50">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  {Number(proyectoActivo.saldo_restante).toLocaleString('es-BO')} Bs
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-3.5rem)]">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <PWAInstallBanner />
    </div>
  );
};

export default Layout;

