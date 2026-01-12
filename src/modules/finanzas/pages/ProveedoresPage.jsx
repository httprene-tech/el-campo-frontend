import React, { useState, useMemo } from 'react';
import { useProveedores } from '../../../hooks/queries/finanzas';
import { useCreateProveedor, useUpdateProveedor, useDeleteProveedor } from '../../../hooks/mutations/finanzas';
import { Card, Button, Modal, Input, LoadingSpinner, Toast } from '../../../components/common';
import { extractApiData } from '../../../utils/formatters';
import { Plus, Users } from 'lucide-react';

// Componente extraído
import { ProveedorCard } from '../components';

const ProveedoresPage = () => {
  // React Query hooks
  const { data: proveedoresData = [], isLoading: loading } = useProveedores();
  const createProveedor = useCreateProveedor();
  const updateProveedor = useUpdateProveedor();
  const deleteProveedor = useDeleteProveedor();

  const proveedores = useMemo(() => extractApiData(proveedoresData), [proveedoresData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    especialidad: '',
  });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editando) {
        await updateProveedor.mutateAsync({ id: editando.id, data: formData });
        showToast('Proveedor actualizado', 'success');
      } else {
        await createProveedor.mutateAsync(formData);
        showToast('Proveedor creado', 'success');
      }
      cerrarModal();
    } catch (error) {
      showToast('Error al guardar', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (proveedor) => {
    setEditando(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      telefono: proveedor.telefono || '',
      direccion: proveedor.direccion || '',
      especialidad: proveedor.especialidad || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) return;

    try {
      await deleteProveedor.mutateAsync(id);
      showToast('Proveedor eliminado', 'success');
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    setFormData({
      nombre: '',
      telefono: '',
      direccion: '',
      especialidad: '',
    });
  };

  if (loading) return <LoadingSpinner text="Cargando proveedores..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-500">Gestión de proveedores y servicios</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Nuevo Proveedor
        </Button>
      </div>

      {/* Grid de proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proveedores.map((proveedor) => (
          <ProveedorCard
            key={proveedor.id}
            proveedor={proveedor}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {proveedores.length === 0 && (
          <Card className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay proveedores registrados</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del proveedor"
            required
          />

          <Input
            label="Especialidad"
            value={formData.especialidad}
            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
            placeholder="Ej: Materiales de construcción, Soldadura"
          />

          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="Ej: 70012345"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Dirección del proveedor"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={cerrarModal} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProveedoresPage;
