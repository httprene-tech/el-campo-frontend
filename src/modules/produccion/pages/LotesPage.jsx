import React, { useState } from 'react';
import { useLotes, useGalpones } from '../../../hooks/queries/produccion';
import { useCreateLote } from '../../../hooks/mutations/produccion';
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
import { Plus, Egg, Calendar, Users } from 'lucide-react';
import { ESTADOS_LOTE } from '../../../utils/constants';
import { formatDateShort, calculateAgeInDays } from '../../../utils/formatters';

const LotesPage = () => {
  const { data: lotesData, isLoading } = useLotes();
  const { data: galpones = [] } = useGalpones();
  const createLote = useCreateLote();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    galpon: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    cantidad_aves: '',
    raza: '',
    estado: 'CRECIMIENTO',
    notas: '',
  });

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
      await createLote.mutateAsync(formData);
      showToast('Lote creado correctamente', 'success');
      setModalOpen(false);
      setFormData({
        nombre: '',
        galpon: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        cantidad_aves: '',
        raza: '',
        estado: 'CRECIMIENTO',
        notas: '',
      });
    } catch (error) {
      showToast('Error al crear lote', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando lotes..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Lotes"
        subtitle="Gestión de lotes de gallinas ponedoras"
        action={{
          label: 'Nuevo Lote',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* Grid */}
      {lotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lotes.map((lote) => {
            const edadDias = calculateAgeInDays(lote.fecha_ingreso);
            const estadoColors = {
              CRECIMIENTO: 'bg-blue-50 text-blue-700',
              PRODUCCION: 'bg-green-50 text-green-700',
              MUDAS: 'bg-amber-50 text-amber-700',
              FINALIZADO: 'bg-gray-50 text-gray-700',
            };

            return (
              <Card key={lote.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lote.nombre}</h3>
                    <p className="text-sm text-gray-500">{lote.galpon_nombre || 'Sin galpón'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoColors[lote.estado] || estadoColors.CRECIMIENTO}`}>
                    {ESTADOS_LOTE[lote.estado] || lote.estado}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{lote.cantidad_aves} aves</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateShort(lote.fecha_ingreso)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Egg className="w-4 h-4" />
                    <span>{edadDias} días</span>
                  </div>
                  {lote.raza && (
                    <p className="text-xs text-gray-500">Raza: {lote.raza}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Egg}
            title="Sin lotes"
            description="Registra tu primer lote para comenzar"
            action={{
              label: 'Nuevo Lote',
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
        label="Lote"
        color="emerald"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Lote"
        height="auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Lote"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
          <Select
            label="Galpón"
            value={formData.galpon}
            onChange={(e) => setFormData({...formData, galpon: e.target.value})}
            options={galpones.map(g => ({ value: g.id, label: g.nombre }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Ingreso"
              type="date"
              value={formData.fecha_ingreso}
              onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Raza (opcional)"
              value={formData.raza}
              onChange={(e) => setFormData({...formData, raza: e.target.value})}
              placeholder="Ej: Lohmann Brown"
            />
            <Select
              label="Estado"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              options={Object.entries(ESTADOS_LOTE).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createLote.isPending} className="flex-1">
              Crear
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LotesPage;
