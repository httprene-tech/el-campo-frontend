import React, { useState, useMemo } from 'react';
import { useProveedores } from '../../../hooks/queries/finanzas';
import { useCreateProveedor, useUpdateProveedor, useDeleteProveedor } from '../../../hooks/mutations/finanzas';
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
      {/* Header - Desktop button hidden on mobile */}
      <PageHeader
        title="Proveedores"
        subtitle="Gestión de proveedores y servicios"
        action={{
          label: 'Nuevo Proveedor',
          icon: Plus,
          onClick: () => setModalOpen(true),
        }}
      />

      {/* Grid de proveedores */}
      {proveedores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proveedores.map((proveedor) => (
            <ProveedorCard
              key={proveedor.id}
              proveedor={proveedor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Users}
            title="No hay proveedores registrados"
            description="Agrega tu primer proveedor para comenzar"
            action={{
              label: 'Agregar Proveedor',
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
        label="Nuevo"
        color="emerald"
      />

      {/* BottomSheet Form */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        height="auto"
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

          <Textarea
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            placeholder="Dirección del proveedor"
            rows={2}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={cerrarModal} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProveedoresPage;
