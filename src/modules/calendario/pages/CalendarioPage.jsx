import React, { useState } from 'react';
import { useEventos, useTiposEvento } from '../../../hooks/queries/calendario';
import { useCreateEvento } from '../../../hooks/mutations/calendario';
import { Card, Button, Modal, Input, Select, LoadingSpinner, Toast } from '../../../components/common';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateShort } from '../../../utils/formatters';

const CalendarioPage = () => {
  const { data: eventosData, isLoading } = useEventos();
  const { data: tiposEvento = [] } = useTiposEvento();
  const createEvento = useCreateEvento();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    titulo: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().slice(0, 16),
    fecha_fin: '',
    todo_el_dia: false,
    ubicacion: '',
    asignado_a: '',
    tipo_recurrencia: 'NINGUNA',
    recordatorio_minutos: 60,
  });

  const eventos = React.useMemo(() => {
    if (!eventosData) return [];
    return eventosData.pages?.flat() || eventosData || [];
  }, [eventosData]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        tipo: parseInt(formData.tipo),
        fecha_fin: formData.fecha_fin || null,
        descripcion: formData.descripcion || null,
        ubicacion: formData.ubicacion || null,
        asignado_a: formData.asignado_a ? parseInt(formData.asignado_a) : null,
        recordatorio_minutos: parseInt(formData.recordatorio_minutos) || 0,
      };
      await createEvento.mutateAsync(dataToSend);
      showToast('Evento creado correctamente', 'success');
      setModalOpen(false);
      setFormData({ 
        tipo: '', 
        titulo: '', 
        descripcion: '', 
        fecha_inicio: new Date().toISOString().slice(0, 16), 
        fecha_fin: '', 
        todo_el_dia: false,
        ubicacion: '',
        asignado_a: '',
        tipo_recurrencia: 'NINGUNA',
        recordatorio_minutos: 60,
      });
    } catch (error) {
      showToast('Error al crear evento', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando eventos..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-500">Eventos y recordatorios</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>Nuevo Evento</Button>
      </div>

      <div className="space-y-4">
        {eventos.slice(0, 20).map((evento) => (
          <Card key={evento.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{evento.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatDateShort(evento.fecha_inicio)}</p>
                  {evento.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{evento.descripcion}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                evento.estado === 'COMPLETADO' ? 'bg-green-100 text-green-700' :
                evento.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {evento.estado}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Evento" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Tipo de Evento" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} options={tiposEvento.map(t => ({ value: t.id, label: t.nombre }))} required />
          <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha Inicio" type="datetime-local" value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} required />
            <Input label="Fecha Fin (opcional)" type="datetime-local" value={formData.fecha_fin} onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ubicación" value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} placeholder="Ej: Galpón A" />
            <Input label="Recordatorio (minutos)" type="number" value={formData.recordatorio_minutos} onChange={(e) => setFormData({...formData, recordatorio_minutos: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Recurrencia" 
              value={formData.tipo_recurrencia} 
              onChange={(e) => setFormData({...formData, tipo_recurrencia: e.target.value})} 
              options={[
                { value: 'NINGUNA', label: 'Ninguna' },
                { value: 'DIARIA', label: 'Diaria' },
                { value: 'SEMANAL', label: 'Semanal' },
                { value: 'MENSUAL', label: 'Mensual' },
                { value: 'ANUAL', label: 'Anual' },
              ]} 
            />
            {/* Aquí se podría agregar un Select para usuarios si hubiera un hook de usuarios */}
            <Input label="ID Asignado (opcional)" type="number" value={formData.asignado_a} onChange={(e) => setFormData({...formData, asignado_a: e.target.value})} />
          </div>
          <Input label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} multiline />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" loading={createEvento.isPending} className="flex-1">Crear</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CalendarioPage;
