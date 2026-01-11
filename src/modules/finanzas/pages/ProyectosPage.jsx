import React, { useState } from 'react';
import { useProyecto } from '../../../context/ProyectoContext';
import { useAuth } from '../../../context/AuthContext';
import { useCreateProyecto } from '../../../hooks/mutations/finanzas';
import { proyectosAPI } from '../../../api';
import { Card, Button, Modal, Input, SkeletonCard, Toast } from '../../../components/common';
import {
  Plus,
  FolderOpen,
  Calendar,
  Wallet,
  Check,
  Download,
  Trash2,
  TrendingUp,
} from 'lucide-react';

const ProyectosPage = () => {
  const { proyectos, proyectoActivo, seleccionarProyecto, loading } = useProyecto();
  const { isAdmin } = useAuth();
  const createProyecto = useCreateProyecto();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [downloading, setDownloading] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    presupuesto_objetivo: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    descripcion: '',
  });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProyecto.mutateAsync(formData);
      showToast('Proyecto creado correctamente', 'success');
      setModalOpen(false);
      setFormData({
        nombre: '',
        presupuesto_objetivo: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        descripcion: '',
      });
    } catch (error) {
      showToast('Error al crear proyecto', 'error');
    }
  };

  const handleExportPDF = async (proyecto, filtro = null) => {
    setDownloading(proyecto.id);
    try {
      const params = {};
      if (filtro === 'mes_actual') params.mes_actual = true;
      if (filtro === 'mes_anterior') params.mes_anterior = true;
      
      const response = await proyectosAPI.exportarPDF(proyecto.id, params);
      
      // Crear blob y descargar
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_${proyecto.nombre}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast('Reporte descargado', 'success');
    } catch (error) {
      showToast('Error al generar reporte', 'error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500">Gestión de proyectos de construcción</p>
        </div>
        {isAdmin() && (
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proyectos.map((proyecto) => {
          const esActivo = proyectoActivo?.id === proyecto.id;
          const porcentaje = proyecto.porcentaje_consumido || 0;
          const saldo = Number(proyecto.saldo_restante) || 0;
          
          return (
            <Card 
              key={proyecto.id} 
              hover 
              className={`relative ${esActivo ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => seleccionarProyecto(proyecto)}
            >
              {esActivo && (
                <div className="absolute top-3 right-3 p-1.5 bg-emerald-500 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-3 rounded-xl ${esActivo ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <FolderOpen className={`w-6 h-6 ${esActivo ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{proyecto.nombre}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(proyecto.fecha_inicio).toLocaleDateString('es-BO')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Presupuesto</span>
                  <span className="font-semibold text-gray-900">
                    {Number(proyecto.presupuesto_objetivo).toLocaleString('es-BO')} Bs
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gastado</span>
                  <span className="font-medium text-red-600">
                    {Number(proyecto.total_gastado).toLocaleString('es-BO')} Bs
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disponible</span>
                  <span className={`font-semibold ${saldo > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {saldo.toLocaleString('es-BO')} Bs
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="pt-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        porcentaje > 80 ? 'bg-red-500' : porcentaje > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{porcentaje.toFixed(1)}% usado</p>
                </div>

                {/* Botones de reportes */}
                <div className="pt-3 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    loading={downloading === proyecto.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportPDF(proyecto);
                    }}
                    className="flex-1 text-xs"
                  >
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportPDF(proyecto, 'mes_actual');
                    }}
                    className="flex-1 text-xs"
                  >
                    Este mes
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {proyectos.length === 0 && (
          <Card className="col-span-full text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay proyectos creados</p>
            {isAdmin() && (
              <Button onClick={() => setModalOpen(true)} className="mt-4">
                Crear primer proyecto
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Modal Nuevo Proyecto */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Proyecto"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre del Proyecto"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            placeholder="Ej: Construcción Galpón Ponedoras"
            required
          />
          
          <Input
            label="Presupuesto (Bs)"
            type="number"
            step="0.01"
            value={formData.presupuesto_objetivo}
            onChange={(e) => setFormData({...formData, presupuesto_objetivo: e.target.value})}
            placeholder="100000"
            required
          />
          
          <Input
            label="Fecha de Inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
            required
          />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Descripción del proyecto..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createProyecto.isPending} className="flex-1">
              Crear Proyecto
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProyectosPage;
