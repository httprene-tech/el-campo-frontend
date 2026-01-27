import React, { useState } from 'react';
import { useGalpones } from '../../../hooks/queries/produccion';
import { useCreateGalpon } from '../../../hooks/mutations/produccion';
import { 
  Card, 
  Button, 
  BottomSheet, 
  Input, 
  Textarea,
  LoadingSpinner, 
  Toast,
  FAB,
  EmptyState,
  PageHeader 
} from '../../../components/common';
import { Plus, Building2, Users } from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

const GalponesPage = () => {
  const { data: galpones = [], isLoading } = useGalpones();
  const createGalpon = useCreateGalpon();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad_maxima: '',
    descripcion: '',
  });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGalpon.mutateAsync(formData);
      showToast('Galpón creado correctamente', 'success');
      setModalOpen(false);
      setFormData({ nombre: '', capacidad_maxima: '', descripcion: '' });
    } catch (error) {
      showToast('Error al crear galpón', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando galpones..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Galpones"
        subtitle="Gestión de infraestructura de galpones"
        action={{
          label: 'Nuevo Galpón',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* Grid */}
      {galpones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galpones.map((galpon) => (
            <Card key={galpon.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{galpon.nombre}</h3>
                    <p className="text-xs text-gray-500">Capacidad: {formatNumber(galpon.capacidad_maxima)} aves</p>
                  </div>
                </div>
              </div>
              {galpon.descripcion && (
                <p className="text-sm text-gray-600 mt-2">{galpon.descripcion}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{galpon.cantidad_aves_actual || 0} aves actuales</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Building2}
            title="Sin galpones"
            description="Registra tu primer galpón para comenzar"
            action={{
              label: 'Nuevo Galpón',
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
        label="Galpón"
        color="emerald"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Galpón"
        height="auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Galpón"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
          <Input
            label="Capacidad Máxima"
            type="number"
            value={formData.capacidad_maxima}
            onChange={(e) => setFormData({...formData, capacidad_maxima: e.target.value})}
            required
          />
          <Textarea
            label="Descripción (opcional)"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createGalpon.isPending} className="flex-1">
              Crear
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GalponesPage;
