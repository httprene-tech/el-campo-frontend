import React from 'react';
import { useProyecto } from '../../../context/ProyectoContext';
import { useAuth } from '../../../context/AuthContext';
import { useGastos, useCategorias, useResumenMensualGastos } from '../../../hooks/queries/finanzas';
import { Card, LoadingSpinner } from '../../../components/common';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Egg,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDateShort } from '../../../utils/formatters';
import { CHART_COLORS } from '../../../utils/constants';

const DashboardPage = () => {
  const { proyectoActivo, loading: proyectoLoading } = useProyecto();
  const { user } = useAuth();
  
  // React Query hooks
  const { data: gastosData, isLoading: gastosLoading } = useGastos(
    proyectoActivo ? { proyecto: proyectoActivo.id, page_size: 5 } : {}
  );
  const { data: categoriasData } = useCategorias();
  const { data: resumenMensualData } = useResumenMensualGastos(proyectoActivo?.id);
  
  // Ensure arrays
  const categorias = Array.isArray(categoriasData) ? categoriasData : [];
  const resumenMensual = Array.isArray(resumenMensualData) ? resumenMensualData : [];

  // Extraer datos de gastos (puede ser array o paginado)
  const gastosRecientes = React.useMemo(() => {
    if (!gastosData) return [];
    const allGastos = gastosData.pages?.flat() || gastosData || [];
    return Array.isArray(allGastos) ? allGastos.slice(0, 5) : [];
  }, [gastosData]);

  // Sin proyecto activo
  if (proyectoLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!proyectoActivo) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Egg className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin proyecto activo</h2>
        <p className="text-gray-500">Ve a Proyectos para crear o seleccionar uno</p>
      </div>
    );
  }

  const porcentaje = proyectoActivo.porcentaje_consumido || 0;
  const saldo = Number(proyectoActivo.saldo_restante) || 0;
  const gastado = Number(proyectoActivo.total_gastado) || 0;
  const presupuesto = Number(proyectoActivo.presupuesto_objetivo) || 0;

  // Datos para gráficos
  const datosCategorias = categorias.slice(0, 6).map((cat, i) => ({
    name: cat.nombre,
    value: cat.gastos?.length || 1,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const datosAreaChart = (resumenMensual || []).slice(0, 6).map(mes => ({
    mes: new Date(mes.mes).toLocaleDateString('es-BO', { month: 'short' }),
    total: Number(mes.total),
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {user?.first_name || user?.username}
        </h1>
        <p className="text-gray-500 mt-1">
          Aquí está el resumen del proyecto
        </p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Presupuesto</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(presupuesto)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Crédito bancario</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Gastado</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(gastado)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500">{porcentaje.toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Disponible</p>
              <p className={`text-xl font-bold mt-1 ${saldo > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500">{(100 - porcentaje).toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Registros</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {gastosRecientes.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">transacciones</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Receipt className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de progreso */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Progreso del Presupuesto</h3>
          <span className={`text-sm font-medium ${porcentaje > 80 ? 'text-red-600' : 'text-gray-600'}`}>
            {porcentaje.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              porcentaje > 80 ? 'bg-red-500' : porcentaje > 60 ? 'bg-amber-500' : 'bg-gray-800'
            }`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>0 Bs</span>
          <span>{formatCurrency(presupuesto)}</span>
        </div>
      </Card>

      {/* Gráficos */}
      {(datosAreaChart.length > 0 || datosCategorias.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="none" className="lg:col-span-2">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Tendencia de Gastos</h3>
            </div>
            <div className="p-4" style={{ height: 250 }}>
              {datosAreaChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={datosAreaChart}>
                    <defs>
                      <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#374151" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#374151" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [formatCurrency(value), 'Total']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#374151" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorGasto)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Sin datos
                </div>
              )}
            </div>
          </Card>

          <Card padding="none">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Por Categoría</h3>
            </div>
            <div className="p-4" style={{ height: 200 }}>
              {datosCategorias.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosCategorias}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {datosCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Sin datos
                </div>
              )}
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-1">
              {datosCategorias.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <span className="text-xs text-gray-500 truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Gastos Recientes */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Gastos Recientes</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {gastosLoading ? (
            <div className="p-6 text-center">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
            </div>
          ) : gastosRecientes.length > 0 ? (
            gastosRecientes.map((gasto) => (
              <div key={gasto.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{gasto.descripcion}</p>
                    <p className="text-sm text-gray-500">{gasto.categoria_nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      -{formatCurrency(gasto.monto)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateShort(gasto.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Sin gastos registrados</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
