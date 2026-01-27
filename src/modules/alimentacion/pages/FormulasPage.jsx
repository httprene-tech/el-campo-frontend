import React, { useState } from 'react';
import { useFormulas } from '../../../hooks/queries/alimentacion';
import { useCreateFormula } from '../../../hooks/mutations/alimentacion';
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
import { Plus, UtensilsCrossed } from 'lucide-react';

const FormulasPage = () => {
  const { data: formulas = [], isLoading } = useFormulas();
  const createFormula = useCreateFormula();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    edad_minima_semanas: 0,
    edad_maxima_semanas: '',
  });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFormula.mutateAsync(formData);
      showToast('Fórmula creada correctamente', 'success');
      setModalOpen(false);
      setFormData({ nombre: '', descripcion: '', edad_minima_semanas: 0, edad_maxima_semanas: '' });
    } catch (error) {
      showToast('Error al crear fórmula', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando fórmulas..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Fórmulas de Alimento"
        subtitle="Gestión de fórmulas según edad de las aves"
        action={{
          label: 'Nueva Fórmula',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* Grid */}
      {formulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas.map((formula) => (
            <Card key={formula.id}>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{formula.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formula.edad_minima_semanas} - {formula.edad_maxima_semanas || '∞'} semanas
                  </p>
                  {formula.descripcion && (
                    <p className="text-sm text-gray-600 mt-2">{formula.descripcion}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={UtensilsCrossed}
            title="Sin fórmulas"
            description="Crea tu primera fórmula de alimento"
            action={{
              label: 'Nueva Fórmula',
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
        label="Fórmula"
        color="amber"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva Fórmula"
        height="auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Nombre" 
            value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Edad Mínima (semanas)" 
              type="number" 
              value={formData.edad_minima_semanas} 
              onChange={(e) => setFormData({...formData, edad_minima_semanas: e.target.value})} 
              required 
            />
            <Input 
              label="Edad Máxima (semanas)" 
              type="number" 
              value={formData.edad_maxima_semanas} 
              onChange={(e) => setFormData({...formData, edad_maxima_semanas: e.target.value})} 
            />
          </div>
          <Textarea 
            label="Descripción" 
            value={formData.descripcion} 
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={createFormula.isPending} className="flex-1">
              Crear
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default FormulasPage;
