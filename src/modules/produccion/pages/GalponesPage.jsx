import React, { useState } from 'react';
import { useGalpones } from '../../../hooks/queries/produccion';
import { useCreateGalpon, useUpdateGalpon, useDeleteGalpon } from '../../../hooks/mutations/produccion';
import { Card, Button, Modal, Input, LoadingSpinner, Toast } from '../../../components/common';
import { Plus, Building2, Users } from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

const GalponesPage = () => {
  const { data: galpones = [], isLoading } = useGalpones();
  const createGalpon = useCreateGalpon();
  const updateGalpon = useUpdateGalpon();
  const deleteGalpon = useDeleteGalpon();
  
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galpones</h1>
          <p className="text-gray-500">Gestión de infraestructura de galpones</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Nuevo Galpón
        </Button>
      </div>

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

      {galpones.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay galpones registrados</p>
          </div>
        </Card>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Galpón" size="sm">
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
          <Input
            label="Descripción (opcional)"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            multiline
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
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GalponesPage;
