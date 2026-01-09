import React, { useState, useEffect, useRef } from 'react';
import { useProyecto } from '../../../context/ProyectoContext';
import { useAuth } from '../../../context/AuthContext';
import { gastosAPI, categoriasAPI, proveedoresAPI } from '../../../api';
import { Card, Button, Modal, Input, Select, LoadingSpinner, Toast } from '../../../components/common';
import { extractApiData } from '../../../utils/formatters';
import {
  Plus,
  Search,
  Receipt,
  Calendar,
  Tag,
  Trash2,
  Camera,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const GastosPage = () => {
  const { proyectoActivo, actualizarProyecto } = useProyecto();
  const { canRegister } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  
  // Form
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: '',
    proveedor_rel: '',
    metodo_pago: 'EFECTIVO',
    nro_referencia: '',
    es_retroactivo: false,
    notas_contexto: '',
    imagen_comprobante: null,
  });

  useEffect(() => {
    cargarDatos();
  }, [proyectoActivo]);

  const cargarDatos = async () => {
    if (!proyectoActivo) return;
    
    try {
      setLoading(true);
      const [gastosRes, categoriasRes, proveedoresRes] = await Promise.all([
        gastosAPI.getAll({ proyecto: proyectoActivo.id }),
        categoriasAPI.getAll(),
        proveedoresAPI.getAll(),
      ]);
      
      setGastos(extractApiData(gastosRes.data));
      setCategorias(extractApiData(categoriasRes.data));
      setProveedores(extractApiData(proveedoresRes.data));
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, imagen_comprobante: file});
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setImagenPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const quitarImagen = () => {
    setFormData({...formData, imagen_comprobante: null});
    setImagenPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await gastosAPI.create({
        ...formData,
        proyecto: proyectoActivo.id,
        proveedor_rel: formData.proveedor_rel || null,
      });
      
      showToast('Gasto registrado correctamente', 'success');
      setModalOpen(false);
      resetForm();
      cargarDatos();
      actualizarProyecto();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al registrar el gasto';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este gasto?')) return;
    
    try {
      await gastosAPI.delete(id);
      showToast('Gasto eliminado', 'success');
      cargarDatos();
      actualizarProyecto();
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      monto: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      categoria: '',
      proveedor_rel: '',
      metodo_pago: 'EFECTIVO',
      nro_referencia: '',
      es_retroactivo: false,
      notas_contexto: '',
      imagen_comprobante: null,
    });
    setImagenPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtrar gastos
  const gastosFiltrados = gastos.filter(gasto => {
    const matchCategoria = !filtroCategoria || gasto.categoria === parseInt(filtroCategoria);
    const matchBusqueda = !filtroBusqueda || 
      gasto.descripcion.toLowerCase().includes(filtroBusqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  if (loading) return <LoadingSpinner text="Cargando gastos..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
          <p className="text-gray-500">Registro de gastos del proyecto</p>
        </div>
        {canRegister() && (
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            Nuevo Gasto
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por descripción..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              icon={Search}
            />
          </div>
          <Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            options={categorias.map(c => ({ value: c.id, label: c.nombre }))}
            placeholder="Todas las categorías"
          />
        </div>
      </Card>

      {/* Lista de gastos */}
      <Card padding="none">
        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {gastosFiltrados.length > 0 ? (
            gastosFiltrados.map((gasto) => (
              <div key={gasto.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      {new Date(gasto.fecha).toLocaleDateString('es-BO', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    <p className="font-semibold text-gray-900">{gasto.descripcion}</p>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {Number(gasto.monto).toLocaleString('es-BO')} Bs
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-medium">
                    <Tag className="w-3 h-3" />
                    {gasto.categoria_nombre}
                  </span>
                  
                  {gasto.es_retroactivo && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md font-medium">
                      Retroactivo
                    </span>
                  )}
                  
                  {gasto.imagen_comprobante && (
                    <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Foto
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {gasto.metodo_pago}
                  </span>
                  
                  {canRegister() && (
                    <button
                      onClick={() => handleDelete(gasto.id)}
                      className="p-2 -mr-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay gastos registrados</p>
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">Descripción</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">Categoría</th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">Método</th>
                <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">Monto</th>
                <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gastosFiltrados.length > 0 ? (
                gastosFiltrados.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(gasto.fecha).toLocaleDateString('es-BO')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{gasto.descripcion}</p>
                          <div className="flex items-center gap-2">
                            {gasto.es_retroactivo && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                Retroactivo
                              </span>
                            )}
                            {gasto.imagen_comprobante && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                Foto
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Tag className="w-3 h-3" />
                        {gasto.categoria_nombre}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{gasto.metodo_pago}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-semibold text-gray-900">
                        {Number(gasto.monto).toLocaleString('es-BO')} Bs
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canRegister() && (
                        <button
                          onClick={() => handleDelete(gasto.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay gastos registrados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Nuevo Gasto */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Gasto"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monto (Bs)"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({...formData, monto: e.target.value})}
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              required
            />
          </div>
          
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Ej: Compra de cemento para cimientos"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              options={categorias.map(c => ({ value: c.id, label: c.nombre }))}
              required
            />
            <Select
              label="Proveedor (opcional)"
              value={formData.proveedor_rel}
              onChange={(e) => setFormData({...formData, proveedor_rel: e.target.value})}
              options={proveedores.map(p => ({ value: p.id, label: p.nombre }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Método de Pago"
              value={formData.metodo_pago}
              onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
              options={[
                { value: 'EFECTIVO', label: 'Efectivo' },
                { value: 'TRANSFERENCIA', label: 'Transferencia' },
                { value: 'QR', label: 'Pago QR' },
              ]}
              required
            />
            <Input
              label="Nro. Referencia"
              value={formData.nro_referencia}
              onChange={(e) => setFormData({...formData, nro_referencia: e.target.value})}
              placeholder="Nro. transferencia o factura"
            />
          </div>

          {/* Subir foto de comprobante */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Foto del comprobante (opcional)
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImagenChange}
              className="hidden"
            />
            
            {imagenPreview ? (
              <div className="relative inline-block">
                <img 
                  src={imagenPreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={quitarImagen}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <Camera className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Tomar foto o subir imagen</span>
              </button>
            )}
          </div>

          {/* Gasto retroactivo */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.es_retroactivo}
                onChange={(e) => setFormData({...formData, es_retroactivo: e.target.checked})}
                className="mt-1 w-4 h-4 text-amber-600 rounded"
              />
              <div>
                <p className="font-medium text-amber-800">Gasto retroactivo</p>
                <p className="text-sm text-amber-600">
                  Marcar si este gasto corresponde a una fecha anterior
                </p>
              </div>
            </label>
            
            {formData.es_retroactivo && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-amber-800 mb-1.5">
                  Contexto del gasto
                </label>
                <textarea
                  value={formData.notas_contexto}
                  onChange={(e) => setFormData({...formData, notas_contexto: e.target.value})}
                  placeholder="Ej: Tengo el comprobante del retiro del 5 de enero, se usó para mano de obra..."
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Guardar Gasto
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GastosPage;
