import React, { useState, useEffect, useRef } from 'react';
import { carpetasAPI, documentosAPI } from '../../../api';
import { Card, Button, Modal, Input, Select, LoadingSpinner, Toast } from '../../../components/common';
import {
  Plus,
  FileText,
  Folder,
  FolderPlus,
  Upload,
  Trash2,
  Download,
  ChevronLeft,
  File,
  Calendar,
} from 'lucide-react';

const DocumentosPage = () => {
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaActiva, setCarpetaActiva] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCarpeta, setModalCarpeta] = useState(false);
  const [modalDocumento, setModalDocumento] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  
  const [nuevaCarpeta, setNuevaCarpeta] = useState({ nombre: '', descripcion: '' });
  const [nuevoDocumento, setNuevoDocumento] = useState({
    nombre: '',
    tipo: 'OTRO',
    descripcion: '',
    fecha_documento: new Date().toISOString().split('T')[0],
    archivo: null,
  });

  const tiposDocumento = [
    { value: 'PLAN_PAGO', label: 'Plan de Pago' },
    { value: 'CONTRATO', label: 'Contrato' },
    { value: 'COMPROBANTE_BANCO', label: 'Comprobante Bancario' },
    { value: 'FACTURA', label: 'Factura' },
    { value: 'PERMISO', label: 'Permiso Municipal' },
    { value: 'PLANO', label: 'Plano/Diseño' },
    { value: 'OTRO', label: 'Otro' },
  ];

  useEffect(() => {
    cargarCarpetas();
  }, []);

  useEffect(() => {
    if (carpetaActiva) {
      cargarDocumentos();
    }
  }, [carpetaActiva]);

  const cargarCarpetas = async () => {
    try {
      setLoading(true);
      const response = await carpetasAPI.getAll();
      setCarpetas(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarDocumentos = async () => {
    try {
      const response = await documentosAPI.getAll({ carpeta: carpetaActiva.id });
      setDocumentos(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCrearCarpeta = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await carpetasAPI.create(nuevaCarpeta);
      showToast('Carpeta creada', 'success');
      setModalCarpeta(false);
      setNuevaCarpeta({ nombre: '', descripcion: '' });
      cargarCarpetas();
    } catch (error) {
      showToast('Error al crear carpeta', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubirDocumento = async (e) => {
    e.preventDefault();
    if (!nuevoDocumento.archivo) {
      showToast('Seleccione un archivo', 'warning');
      return;
    }
    
    setSubmitting(true);

    try {
      await documentosAPI.upload({
        ...nuevoDocumento,
        carpeta: carpetaActiva.id,
      });
      showToast('Documento subido', 'success');
      setModalDocumento(false);
      setNuevoDocumento({
        nombre: '',
        tipo: 'OTRO',
        descripcion: '',
        fecha_documento: new Date().toISOString().split('T')[0],
        archivo: null,
      });
      cargarDocumentos();
      cargarCarpetas();
    } catch (error) {
      showToast('Error al subir documento', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocumento = async (id) => {
    if (!confirm('¿Eliminar este documento?')) return;
    
    try {
      await documentosAPI.delete(id);
      showToast('Documento eliminado', 'success');
      cargarDocumentos();
      cargarCarpetas();
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const handleDeleteCarpeta = async (id) => {
    if (!confirm('¿Eliminar esta carpeta y todos sus documentos?')) return;
    
    try {
      await carpetasAPI.delete(id);
      showToast('Carpeta eliminada', 'success');
      if (carpetaActiva?.id === id) setCarpetaActiva(null);
      cargarCarpetas();
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const getFileIcon = (tipo) => {
    const icons = {
      'PLAN_PAGO': '📋',
      'CONTRATO': '📝',
      'COMPROBANTE_BANCO': '🏦',
      'FACTURA': '🧾',
      'PERMISO': '📄',
      'PLANO': '📐',
      'OTRO': '📎',
    };
    return icons[tipo] || '📄';
  };

  if (loading) return <LoadingSpinner text="Cargando documentos..." />;

  // Vista de carpetas
  if (!carpetaActiva) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
            <p className="text-gray-500">Gestión de documentos del proyecto</p>
          </div>
          <Button icon={FolderPlus} onClick={() => setModalCarpeta(true)}>
            Nueva Carpeta
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {carpetas.map((carpeta) => (
            <div
              key={carpeta.id}
              className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-emerald-200 transition-all"
              onClick={() => setCarpetaActiva(carpeta)}
            >
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCarpeta(carpeta.id);
                }}
                className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>

              <div className="mb-4">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Folder className="w-8 h-8 text-amber-500" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 truncate">{carpeta.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {carpeta.cantidad_documentos} documento{carpeta.cantidad_documentos !== 1 && 's'}
              </p>
            </div>
          ))}

          {carpetas.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay carpetas creadas</p>
              <Button onClick={() => setModalCarpeta(true)} className="mt-4">
                Crear primera carpeta
              </Button>
            </div>
          )}
        </div>

        {/* Modal Nueva Carpeta */}
        <Modal
          isOpen={modalCarpeta}
          onClose={() => setModalCarpeta(false)}
          title="Nueva Carpeta"
          size="sm"
        >
          <form onSubmit={handleCrearCarpeta} className="space-y-5">
            <Input
              label="Nombre de la Carpeta"
              value={nuevaCarpeta.nombre}
              onChange={(e) => setNuevaCarpeta({...nuevaCarpeta, nombre: e.target.value})}
              placeholder="Ej: Plan de Pago Banco, Contratos"
              required
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={nuevaCarpeta.descripcion}
                onChange={(e) => setNuevaCarpeta({...nuevaCarpeta, descripcion: e.target.value})}
                placeholder="Descripción de la carpeta..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalCarpeta(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" loading={submitting} className="flex-1">
                Crear
              </Button>
            </div>
          </form>
        </Modal>

        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // Vista de documentos en carpeta
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCarpetaActiva(null)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{carpetaActiva.nombre}</h1>
            <p className="text-gray-500">{documentos.length} documento{documentos.length !== 1 && 's'}</p>
          </div>
        </div>
        <Button icon={Upload} onClick={() => setModalDocumento(true)}>
          Subir Documento
        </Button>
      </div>

      {/* Lista de documentos */}
      <Card padding="none">
        <div className="divide-y divide-gray-50">
          {documentos.length > 0 ? (
            documentos.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {getFileIcon(doc.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{doc.nombre}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{doc.tipo_display}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.fecha_documento).toLocaleDateString('es-BO')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteDocumento(doc.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Esta carpeta está vacía</p>
              <Button onClick={() => setModalDocumento(true)}>
                Subir primer documento
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Modal Subir Documento */}
      <Modal
        isOpen={modalDocumento}
        onClose={() => setModalDocumento(false)}
        title="Subir Documento"
        size="md"
      >
        <form onSubmit={handleSubirDocumento} className="space-y-5">
          <Input
            label="Nombre del Documento"
            value={nuevoDocumento.nombre}
            onChange={(e) => setNuevoDocumento({...nuevoDocumento, nombre: e.target.value})}
            placeholder="Ej: Cronograma de pagos enero 2024"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Documento"
              value={nuevoDocumento.tipo}
              onChange={(e) => setNuevoDocumento({...nuevoDocumento, tipo: e.target.value})}
              options={tiposDocumento}
              required
            />
            <Input
              label="Fecha del Documento"
              type="date"
              value={nuevoDocumento.fecha_documento}
              onChange={(e) => setNuevoDocumento({...nuevoDocumento, fecha_documento: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Archivo</label>
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {nuevoDocumento.archivo ? (
                <div>
                  <File className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{nuevoDocumento.archivo.name}</p>
                  <p className="text-xs text-gray-500">
                    {(nuevoDocumento.archivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click para seleccionar archivo</p>
                  <p className="text-xs text-gray-400">PDF, DOC, XLS, IMG</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setNuevoDocumento({...nuevoDocumento, archivo: e.target.files[0]})}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
            <textarea
              value={nuevoDocumento.descripcion}
              onChange={(e) => setNuevoDocumento({...nuevoDocumento, descripcion: e.target.value})}
              placeholder="Notas sobre este documento..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalDocumento(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Subir
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DocumentosPage;
