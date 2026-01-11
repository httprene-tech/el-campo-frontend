import React from 'react';
import { useProyecto } from '../../../context/ProyectoContext';
import { useAuth } from '../../../context/AuthContext';
import { useGastos, useResumenMensualGastos } from '../../../hooks/queries/finanzas';
import { Card, SkeletonCard, SkeletonRow } from '../../../components/common';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Egg,
} from 'lucide-react';
import { formatCurrency, formatDateShort, formatPercentage } from '../../../utils/formatters';
import { CHART_COLORS } from '../../../utils/constants';

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg">
        {label && <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-sm font-semibold text-gray-900">
              {entry.name}: {prefix}{formatCurrency(entry.value)}{suffix}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { proyectoActivo, loading: proyectoLoading } = useProyecto();
  const { user } = userAuth ? useAuth() : { user: null }; // Guard if useAuth fails
  
  // React Query hooks - Fetching a larger page size for better aggregation if needed
  // However, we'll work with what useGastos provides (infinite query)
  const { data: gastosData, isLoading: gastosLoading } = useGastos(
    proyectoActivo ? { proyecto: proyectoActivo.id, page_size: 100 } : {}
  );
  const { data: resumenMensualData, isLoading: resumenLoading } = useResumenMensualGastos(proyectoActivo?.id);
  
  // Flatten initial pages of gastos for aggregation
  const allExpenses = React.useMemo(() => {
    if (!gastosData) return [];
    return gastosData.pages?.flat() || [];
  }, [gastosData]);

  // Aggregate by category on the frontend
  const datosCategorias = React.useMemo(() => {
    if (allExpenses.length === 0) return [];
    
    const aggregation = allExpenses.reduce((acc, gasto) => {
      const catName = gasto.categoria_nombre || 'Sin categoría';
      if (!acc[catName]) {
        acc[catName] = 0;
      }
      acc[catName] += Number(gasto.monto);
      return acc;
    }, {});

    return Object.entries(aggregation)
      .map(([name, value], i) => ({
        name,
        value,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [allExpenses]);

  // Recent 5 expenses
  const gastosRecientes = React.useMemo(() => {
    return allExpenses.slice(0, 5);
  }, [allExpenses]);

  const resumenMensual = Array.isArray(resumenMensualData) ? resumenMensualData : [];

  // Data for Area Chart
  const datosAreaChart = React.useMemo(() => {
    return [...resumenMensual]
      .sort((a, b) => new Date(a.mes) - new Date(b.mes))
      .map(mes => ({
        mesRepo: new Date(mes.mes).toLocaleDateString('es-BO', { month: 'short', year: '2-digit' }),
        total: Number(mes.total),
      }));
  }, [resumenMensual]);

  // Loading state for project
  if (proyectoLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!proyectoActivo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Egg className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin proyecto activo</h2>
        <p className="text-gray-500 max-w-xs text-center">
          Para ver el resumen, primero debes seleccionar o crear un proyecto en la sección correspondiente.
        </p>
      </div>
    );
  }

  const porcentaje = proyectoActivo.porcentaje_consumido || 0;
  const saldo = Number(proyectoActivo.saldo_restante) || 0;
  const gastado = Number(proyectoActivo.total_gastado) || 0;
  const presupuesto = Number(proyectoActivo.presupuesto_objetivo) || 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Hola, {user?.first_name || user?.username || 'Socio'}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Resumen general del proyecto: <span className="text-gray-900">{proyectoActivo.nombre}</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Presupuesto</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {formatCurrency(presupuesto)}
              </p>
              <p className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                Crédito Disponible
              </p>
            </div>
            <div className="p-3 bg-gray-900 rounded-2xl shadow-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Invertido</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {formatCurrency(gastado)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-bold text-amber-600">{formatPercentage(porcentaje)}</span>
                <span className="text-[10px] text-gray-400 ml-1">consumido</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-2xl shadow-sm">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Disponible</p>
              <p className={`text-2xl font-black mt-1 ${saldo > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className={`w-3 h-3 ${saldo > 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-xs font-bold ${saldo > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(100 - porcentaje)}
                </span>
                <span className="text-[10px] text-gray-400 ml-1">restante</span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl shadow-sm ${saldo > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingDown className={`w-5 h-5 ${saldo > 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Transacciones</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {allExpenses.length}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Registros totales en sistema</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-2xl shadow-sm">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Progress Indicator */}
      <Card className="border-none bg-white shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gray-900" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Progreso de Ejecución</h3>
            <p className="text-xs text-gray-400">Distribución del presupuesto objetivo</p>
          </div>
          <span className={`text-xl font-black ${porcentaje > 90 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatPercentage(porcentaje)}
          </span>
        </div>
        <div className="h-4 bg-gray-50 rounded-full overflow-hidden mb-2 border border-gray-100">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              porcentaje > 90 ? 'bg-red-500' : porcentaje > 75 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Base 0 Bs</span>
          <span className="text-gray-900">Limite: {formatCurrency(presupuesto)}</span>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <Card padding="none" className="lg:col-span-2 border-none bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Tendencia de Gastos Mensuales</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-900" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Inversión Bs</span>
            </div>
          </div>
          <div className="p-6" style={{ height: 320 }}>
            {resumenLoading ? (
               <div className="h-full w-full bg-gray-50 animate-pulse rounded-2xl" />
            ) : datosAreaChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={datosAreaChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="mesRepo" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    name="Inversión"
                    stroke="#111827" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorTotal)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">Sin historial suficiente</p>
              </div>
            )}
          </div>
        </Card>

        {/* Category Distribution Chart */}
        <Card padding="none" className="border-none bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Distribución por Categoría</h3>
          </div>
          <div className="p-6 flex-1" style={{ height: 260 }}>
            {gastosLoading ? (
               <div className="h-full w-full bg-gray-50 animate-pulse rounded-full" />
            ) : datosCategorias.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosCategorias}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {datosCategorias.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        strokeWidth={0}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <Egg className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium text-center">Registrar gastos para<br/>ver categorías</p>
              </div>
            )}
          </div>
          <div className="px-6 pb-6 mt-auto">
             <div className="grid grid-cols-2 gap-3">
                {datosCategorias.slice(0, 4).map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-900 truncate leading-tight uppercase">
                        {cat.name}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold leading-tight">
                        {formatPercentage((cat.value / gastado) * 100)}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </Card>
      </div>

      {/* Recent Purchases List */}
      <Card padding="none" className="border-none bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Últimos Movimientos</h3>
            <p className="text-xs text-gray-400 mt-0.5">Listado de las transacciones más recientes</p>
          </div>
          <Receipt className="w-5 h-5 text-gray-200" />
        </div>
        <div className="divide-y divide-gray-50">
          {gastosLoading ? (
            <div className="p-4 space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : gastosRecientes.length > 0 ? (
            gastosRecientes.map((gasto) => (
              <div key={gasto.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                      <Receipt className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {gasto.descripcion}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">
                          {gasto.categoria_nombre}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {gasto.proveedor_nombre}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">
                      -{formatCurrency(gasto.monto)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {formatDateShort(gasto.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Receipt className="w-12 h-12 text-gray-100 mx-auto mb-3" />
              <p className="text-gray-400 font-medium italic">No se han registrado gastos aún</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

