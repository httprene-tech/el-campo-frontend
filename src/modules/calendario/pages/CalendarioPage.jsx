import React, { useState } from 'react';
import { useEventos, useTiposEvento } from '../../../hooks/queries/calendario';
import { useCreateEvento } from '../../../hooks/mutations/calendario';
import { 
  Card, 
  Button, 
  BottomSheet, 
  Input, 
  Select, 
  Textarea,
  LoadingSpinner, 
  Toast,
  FAB,
  EmptyState,
  PageHeader 
} from '../../../components/common';
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

  const resetForm = () => {
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
      resetForm();
    } catch (error) {
      showToast('Error al crear evento', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando eventos..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Calendario"
        subtitle="Eventos y recordatorios"
        action={{
          label: 'Nuevo Evento',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* Lista de eventos */}
      {eventos.length > 0 ? (
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
      ) : (
        <Card>
          <EmptyState
            icon={CalendarIcon}
            title="No hay eventos"
            description="Crea tu primer evento para comenzar"
            action={{
              label: 'Nuevo Evento',
              icon: Plus,
              onClick: () => setModalOpen(true),
            }}
          />
        </Card>
      )}

      {/* FAB - Mobile only */}
      <FAB
        onClick={() => setModalOpen(true)}
        icon={Plus}
        label="Evento"
        color="emerald"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Evento"
        height="auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            label="Tipo de Evento" 
            value={formData.tipo} 
            onChange={(e) => setFormData({...formData, tipo: e.target.value})} 
            options={tiposEvento.map(t => ({ value: t.id, label: t.nombre }))} 
            required 
          />
          <Input 
            label="Título" 
            value={formData.titulo} 
            onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fecha Inicio" 
              type="datetime-local" 
              value={formData.fecha_inicio} 
              onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} 
              required 
            />
            <Input 
              label="Fecha Fin (opcional)" 
              type="datetime-local" 
              value={formData.fecha_fin} 
              onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Ubicación" 
              value={formData.ubicacion} 
              onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} 
              placeholder="Ej: Galpón A" 
            />
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
          </div>
          <Textarea 
            label="Descripción" 
            value={formData.descripcion} 
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Descripción del evento..."
            rows={3}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createEvento.isPending} className="flex-1">
              Crear
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CalendarioPage;
