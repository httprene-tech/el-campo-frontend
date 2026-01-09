import React, { useState } from 'react';
import { useFormulas } from '../../../hooks/queries/alimentacion';
import { useCreateFormula } from '../../../hooks/mutations/alimentacion';
import { Card, Button, Modal, Input, LoadingSpinner, Toast } from '../../../components/common';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fórmulas de Alimento</h1>
          <p className="text-gray-500">Gestión de fórmulas según edad de las aves</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Nueva Fórmula
        </Button>
      </div>

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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Fórmula" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <Input label="Edad Mínima (semanas)" type="number" value={formData.edad_minima_semanas} onChange={(e) => setFormData({...formData, edad_minima_semanas: e.target.value})} required />
          <Input label="Edad Máxima (semanas)" type="number" value={formData.edad_maxima_semanas} onChange={(e) => setFormData({...formData, edad_maxima_semanas: e.target.value})} />
          <Input label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} multiline />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" loading={createFormula.isPending} className="flex-1">Crear</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default FormulasPage;
