import React, { useState } from 'react';
import { useRecolecciones, useLotes } from '../../../hooks/queries/produccion';
import { useCreateRecoleccion } from '../../../hooks/mutations/produccion';
import { Card, Button, Modal, Input, Select, LoadingSpinner, Toast } from '../../../components/common';
import { Plus, Egg, Calendar } from 'lucide-react';
import { formatDateShort, formatNumber } from '../../../utils/formatters';

const RecoleccionPage = () => {
  const { data: recoleccionesData, isLoading } = useRecolecciones();
  const { data: lotesData } = useLotes({ activo: true });
  const createRecoleccion = useCreateRecoleccion();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    lote: '',
    fecha: new Date().toISOString().split('T')[0],
    cantidad_huevos: '',
    hora_recoleccion: '',
    notas: '',
  });

  const recolecciones = React.useMemo(() => {
    if (!recoleccionesData) return [];
    return recoleccionesData.pages?.flat() || recoleccionesData || [];
  }, [recoleccionesData]);

  const lotes = React.useMemo(() => {
    if (!lotesData) return [];
    return lotesData.pages?.flat() || lotesData || [];
  }, [lotesData]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecoleccion.mutateAsync(formData);
      showToast('Recolección registrada correctamente', 'success');
      setModalOpen(false);
      setFormData({
        lote: '',
        fecha: new Date().toISOString().split('T')[0],
        cantidad_huevos: '',
        hora_recoleccion: '',
        notas: '',
      });
    } catch (error) {
      showToast('Error al registrar recolección', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando recolecciones..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recolección de Huevos</h1>
          <p className="text-gray-500">Registro diario de producción de huevos</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Nueva Recolección
        </Button>
      </div>

      <div className="space-y-4">
        {recolecciones.slice(0, 20).map((recoleccion) => (
          <Card key={recoleccion.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Egg className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{recoleccion.lote_nombre}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateShort(recoleccion.fecha)}
                    </span>
                    {recoleccion.hora_recoleccion && (
                      <span>{recoleccion.hora_recoleccion}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(recoleccion.cantidad_huevos, 0)}
                </p>
                <p className="text-sm text-gray-500">huevos</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {recolecciones.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Egg className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay recolecciones registradas</p>
          </div>
        </Card>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Recolección" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Lote"
            value={formData.lote}
            onChange={(e) => setFormData({...formData, lote: e.target.value})}
            options={lotes.map(l => ({ value: l.id, label: l.nombre }))}
            required
          />
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            required
          />
          <Input
            label="Cantidad de Huevos"
            type="number"
            value={formData.cantidad_huevos}
            onChange={(e) => setFormData({...formData, cantidad_huevos: e.target.value})}
            required
          />
          <Input
            label="Hora de Recolección (opcional)"
            type="time"
            value={formData.hora_recoleccion}
            onChange={(e) => setFormData({...formData, hora_recoleccion: e.target.value})}
          />
          <Input
            label="Notas (opcional)"
            value={formData.notas}
            onChange={(e) => setFormData({...formData, notas: e.target.value})}
            multiline
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createRecoleccion.isPending} className="flex-1">
              Registrar
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default RecoleccionPage;
