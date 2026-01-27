import React, { useState } from 'react';
import { useMateriales, useMovimientos } from '../../../hooks/queries/inventario';
import { useCreateMaterial, useCreateMovimiento } from '../../../hooks/mutations/inventario';
import { 
  Card, 
  Button, 
  BottomSheet, 
  Input, 
  Select, 
  LoadingSpinner, 
  Toast,
  FAB,
  EmptyState,
  PageHeader 
} from '../../../components/common';
import { Plus, Package, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Boxes } from 'lucide-react';
import { UNIDADES_MEDIDA, TIPOS_INVENTARIO } from '../../../utils/constants';
import { formatNumber } from '../../../utils/formatters';

const InventarioPage = () => {
  const { data: materiales = [], isLoading: materialesLoading } = useMateriales();
  const { data: movimientosData, isLoading: movimientosLoading } = useMovimientos({ page_size: 10 });
  
  const createMaterial = useCreateMaterial();
  const createMovimiento = useCreateMovimiento();
  
  const [modalMaterial, setModalMaterial] = useState(false);
  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre: '',
    tipo_inventario: 'CONSTRUCCION',
    unidad_medida: 'BOLSA',
    stock_minimo_alerta: 5,
    codigo: '',
  });

  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    material: '',
    tipo: 'ENTRADA',
    cantidad: '',
    nota: '',
  });

  const movimientos = React.useMemo(() => {
    if (!movimientosData) return [];
    return movimientosData.pages?.flat() || movimientosData || [];
  }, [movimientosData]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCrearMaterial = async (e) => {
    e.preventDefault();
    try {
      await createMaterial.mutateAsync(nuevoMaterial);
      showToast('Material creado', 'success');
      setModalMaterial(false);
      setNuevoMaterial({ 
        nombre: '', 
        tipo_inventario: 'CONSTRUCCION', 
        unidad_medida: 'BOLSA', 
        stock_minimo_alerta: 5,
        codigo: '',
      });
    } catch (error) {
      showToast('Error al crear material', 'error');
    }
  };

  const handleCrearMovimiento = async (e) => {
    e.preventDefault();
    
    // Validación de stock para SALIDA
    if (nuevoMovimiento.tipo === 'SALIDA') {
      const material = materiales.find(m => m.id === parseInt(nuevoMovimiento.material));
      if (material && Number(nuevoMovimiento.cantidad) > Number(material.stock_actual)) {
        showToast(`Stock insuficiente. Disponible: ${material.stock_actual}`, 'error');
        return;
      }
    }

    try {
      await createMovimiento.mutateAsync({
        ...nuevoMovimiento,
        material: parseInt(nuevoMovimiento.material),
        cantidad: parseFloat(nuevoMovimiento.cantidad)
      });
      showToast('Movimiento registrado', 'success');
      setModalMovimiento(false);
      setNuevoMovimiento({ material: '', tipo: 'ENTRADA', cantidad: '', nota: '' });
    } catch (error) {
      const msg = error.response?.data?.non_field_errors?.[0] || 'Error al registrar';
      showToast(msg, 'error');
    }
  };

  const getUnidadLabel = (unidad) => {
    const found = UNIDADES_MEDIDA.find(u => u.value === unidad);
    return found ? found.label : unidad;
  };

  if (materialesLoading) return <LoadingSpinner text="Cargando inventario..." />;

  const materialesConAlerta = materiales.filter(m => 
    Number(m.stock_actual) <= Number(m.stock_minimo_alerta)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Inventario"
        subtitle="Control de materiales de construcción"
        action={{
          label: 'Movimiento',
          icon: ArrowUpCircle,
          onClick: () => setModalMovimiento(true),
        }}
      />

      {/* Alert for low stock */}
      {materialesConAlerta.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Stock Bajo</p>
              <p className="text-sm text-amber-600">
                {materialesConAlerta.map(m => m.nombre).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Materials List */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Materiales</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={Plus} 
                onClick={() => setModalMaterial(true)}
                className="hidden sm:flex"
              >
                Nuevo
              </Button>
            </div>
            <div className="divide-y divide-gray-50">
              {materiales.length > 0 ? (
                materiales.map((material) => {
                  const stockBajo = Number(material.stock_actual) <= Number(material.stock_minimo_alerta);
                  return (
                    <div key={material.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                      <div className={`p-3 rounded-xl ${stockBajo ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <Package className={`w-6 h-6 ${stockBajo ? 'text-red-500' : 'text-emerald-500'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{material.nombre}</h4>
                        <p className="text-sm text-gray-500">{getUnidadLabel(material.unidad_medida)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${stockBajo ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatNumber(material.stock_actual, 0)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Mín: {formatNumber(material.stock_minimo_alerta, 0)}
                        </p>
                      </div>
                      {stockBajo && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          ¡Bajo!
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={Boxes}
                  title="Sin materiales"
                  description="Agrega tu primer material al inventario"
                  action={{
                    label: 'Nuevo Material',
                    icon: Plus,
                    onClick: () => setModalMaterial(true),
                  }}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Recent Movements */}
        <div>
          <Card padding="none">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Movimientos Recientes</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {movimientosLoading ? (
                <div className="p-6 text-center">
                  <LoadingSpinner />
                </div>
              ) : movimientos.length > 0 ? (
                movimientos.slice(0, 10).map((mov) => (
                  <div key={mov.id} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {mov.tipo === 'ENTRADA' ? (
                        <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                      ) : mov.tipo === 'SALIDA' ? (
                        <ArrowDownCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Package className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        mov.tipo === 'ENTRADA' ? 'text-emerald-600' : 
                        mov.tipo === 'SALIDA' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {mov.tipo === 'ENTRADA' ? '+' : mov.tipo === 'SALIDA' ? '-' : ''}{mov.cantidad}
                      </span>
                      <span className="text-sm text-gray-600">{mov.material_nombre}</span>
                    </div>
                    <div className="flex items-center justify-between pl-6">
                      <p className="text-xs text-gray-400">{mov.tipo_display}</p>
                      {mov.nota && (
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{mov.nota}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-sm">Sin movimientos</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* FAB - Mobile only */}
      <FAB
        onClick={() => setModalMovimiento(true)}
        icon={ArrowUpCircle}
        label="Movimiento"
        color="emerald"
      />

      {/* BottomSheet: New Material */}
      <BottomSheet
        isOpen={modalMaterial}
        onClose={() => setModalMaterial(false)}
        title="Nuevo Material"
        height="auto"
      >
        <form onSubmit={handleCrearMaterial} className="space-y-5">
          <Input
            label="Nombre"
            value={nuevoMaterial.nombre}
            onChange={(e) => setNuevoMaterial({...nuevoMaterial, nombre: e.target.value})}
            placeholder="Ej: Cemento, Arena, Fierro"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo"
              value={nuevoMaterial.tipo_inventario}
              onChange={(e) => setNuevoMaterial({...nuevoMaterial, tipo_inventario: e.target.value})}
              options={TIPOS_INVENTARIO}
              required
            />
            <Input
              label="Código (opcional)"
              value={nuevoMaterial.codigo}
              onChange={(e) => setNuevoMaterial({...nuevoMaterial, codigo: e.target.value})}
              placeholder="Ej: CEM-001"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Unidad"
              value={nuevoMaterial.unidad_medida}
              onChange={(e) => setNuevoMaterial({...nuevoMaterial, unidad_medida: e.target.value})}
              options={UNIDADES_MEDIDA}
              required
            />
            <Input
              label="Stock Mínimo"
              type="number"
              value={nuevoMaterial.stock_minimo_alerta}
              onChange={(e) => setNuevoMaterial({...nuevoMaterial, stock_minimo_alerta: e.target.value})}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalMaterial(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createMaterial.isPending} className="flex-1">
              Crear
            </Button>
          </div>
        </form>
      </BottomSheet>

      {/* BottomSheet: New Movement */}
      <BottomSheet
        isOpen={modalMovimiento}
        onClose={() => setModalMovimiento(false)}
        title="Registrar Movimiento"
        height="auto"
      >
        <form onSubmit={handleCrearMovimiento} className="space-y-5">
          <Select
            label="Material"
            value={nuevoMovimiento.material}
            onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, material: e.target.value})}
            options={materiales.map(m => ({ value: m.id, label: m.nombre }))}
            placeholder="Seleccionar material"
            required
          />
          <Select
            label="Tipo de Movimiento"
            value={nuevoMovimiento.tipo}
            onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, tipo: e.target.value})}
            options={[
              { value: 'ENTRADA', label: 'Entrada (Compra/Ingreso)' },
              { value: 'SALIDA', label: 'Salida (Uso/Consumo)' },
              { value: 'AJUSTE', label: 'Ajuste (Corrección)' },
            ]}
            required
          />
          <Input
            label="Cantidad"
            type="number"
            step="0.01"
            value={nuevoMovimiento.cantidad}
            onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, cantidad: e.target.value})}
            required
          />
          <Input
            label="Nota (opcional)"
            value={nuevoMovimiento.nota}
            onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, nota: e.target.value})}
            placeholder="Ej: Para cimientos del galpón"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalMovimiento(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createMovimiento.isPending} className="flex-1">
              Registrar
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default InventarioPage;
