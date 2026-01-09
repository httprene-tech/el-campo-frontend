import React, { useState, useEffect } from 'react';
import { proveedoresAPI } from '../../../api';
import { Card, Button, Modal, Input, LoadingSpinner, Toast } from '../../../components/common';
import { extractApiData } from '../../../utils/formatters';
import {
  Plus,
  Users,
  Phone,
  MapPin,
  Briefcase,
  Trash2,
  Edit2,
  Wallet,
} from 'lucide-react';

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const response = await proveedoresAPI.getAll();
      setProveedores(extractApiData(response.data));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editando) {
        await proveedoresAPI.update(editando.id, formData);
        showToast('Proveedor actualizado', 'success');
      } else {
        await proveedoresAPI.create(formData);
        showToast('Proveedor creado', 'success');
      }
      cerrarModal();
      cargarProveedores();
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
      await proveedoresAPI.delete(id);
      showToast('Proveedor eliminado', 'success');
      cargarProveedores();
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
          <Card key={proveedor.id} className="relative group">
            {/* Acciones */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(proveedor)}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => handleDelete(proveedor.id)}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{proveedor.nombre}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {proveedor.especialidad || 'Sin especialidad'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {proveedor.telefono && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{proveedor.telefono}</span>
                </div>
              )}
              {proveedor.direccion && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{proveedor.direccion}</span>
                </div>
              )}
            </div>

            {/* Total pagado */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Pagado</span>
              <div className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-emerald-600">
                  {Number(proveedor.total_pagado || 0).toLocaleString('es-BO')} Bs
                </span>
              </div>
            </div>
          </Card>
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
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            placeholder="Nombre del proveedor"
            required
          />
          
          <Input
            label="Especialidad"
            value={formData.especialidad}
            onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
            placeholder="Ej: Materiales de construcción, Soldadura"
          />
          
          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            placeholder="Ej: 70012345"
          />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
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
