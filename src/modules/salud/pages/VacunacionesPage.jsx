import React, { useState } from 'react';
import { useVacunaciones } from '../../../hooks/queries/salud';
import { useLotes } from '../../../hooks/queries/produccion';
import { useCreateVacunacion } from '../../../hooks/mutations/salud';
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
import { Plus, Syringe, Calendar } from 'lucide-react';
import { formatDateShort } from '../../../utils/formatters';

const VacunacionesPage = () => {
  const { data: vacunacionesData, isLoading } = useVacunaciones();
  const { data: lotesData } = useLotes({ activo: true });
  const createVacunacion = useCreateVacunacion();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    lote: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo_vacuna: '',
    cantidad_aves: '',
    metodo_aplicacion: '',
    observaciones: '',
  });

  const vacunaciones = React.useMemo(() => {
    if (!vacunacionesData) return [];
    return vacunacionesData.pages?.flat() || vacunacionesData || [];
  }, [vacunacionesData]);

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
      await createVacunacion.mutateAsync(formData);
      showToast('Vacunación registrada correctamente', 'success');
      setModalOpen(false);
      setFormData({ 
        lote: '', 
        fecha: new Date().toISOString().split('T')[0], 
        tipo_vacuna: '', 
        cantidad_aves: '', 
        metodo_aplicacion: '', 
        observaciones: '' 
      });
    } catch (error) {
      showToast('Error al registrar vacunación', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando vacunaciones..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Vacunaciones"
        subtitle="Plan de vacunación de lotes"
        action={{
          label: 'Nueva Vacunación',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* List */}
      {vacunaciones.length > 0 ? (
        <div className="space-y-4">
          {vacunaciones.slice(0, 20).map((vac) => (
            <Card key={vac.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Syringe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vac.lote_nombre}</h3>
                    <p className="text-sm text-gray-600 mt-1">{vac.tipo_vacuna}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateShort(vac.fecha)}
                      </span>
                      <span>{vac.cantidad_aves} aves</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Syringe}
            title="Sin vacunaciones"
            description="Registra la primera vacunación del lote"
            action={{
              label: 'Nueva Vacunación',
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
        label="Vacunación"
        color="blue"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva Vacunación"
        height="auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            label="Lote" 
            value={formData.lote} 
            onChange={(e) => setFormData({...formData, lote: e.target.value})} 
            options={lotes.map(l => ({ value: l.id, label: l.nombre }))} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fecha" 
              type="date" 
              value={formData.fecha} 
              onChange={(e) => setFormData({...formData, fecha: e.target.value})} 
              required 
            />
            <Input 
              label="Cantidad de Aves" 
              type="number" 
              value={formData.cantidad_aves} 
              onChange={(e) => setFormData({...formData, cantidad_aves: e.target.value})} 
              required 
            />
          </div>
          <Input 
            label="Tipo de Vacuna" 
            value={formData.tipo_vacuna} 
            onChange={(e) => setFormData({...formData, tipo_vacuna: e.target.value})} 
            required 
          />
          <Input 
            label="Método de Aplicación" 
            value={formData.metodo_aplicacion} 
            onChange={(e) => setFormData({...formData, metodo_aplicacion: e.target.value})} 
            required 
          />
          <Textarea 
            label="Observaciones" 
            value={formData.observaciones} 
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            rows={2}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createVacunacion.isPending} className="flex-1">
              Registrar
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default VacunacionesPage;
