import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCarpetas, useDocumentos } from '../../../hooks/queries/finanzas';
import { useCreateCarpeta, useDeleteCarpeta, useUploadDocumento, useDeleteDocumento } from '../../../hooks/mutations/finanzas';
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
import { extractApiData } from '../../../utils/formatters';
import { 
  Plus, 
  FileText, 
  Folder, 
  FolderPlus, 
  Upload, 
  ChevronLeft, 
  File 
} from 'lucide-react';

// Componentes extraídos
import { CarpetaCard, DocumentoRow } from '../components';

const DocumentosPage = () => {
  const { user } = useAuth();
  const [carpetaActiva, setCarpetaActiva] = useState(null);
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

  // React Query hooks
  const { data: carpetasData = [], isLoading: loadingCarpetas } = useCarpetas();
  const { data: documentosData, isLoading: loadingDocumentos } = useDocumentos(
    carpetaActiva ? { carpeta: carpetaActiva.id } : {}
  );

  // Mutations
  const createCarpeta = useCreateCarpeta();
  const deleteCarpetaMutation = useDeleteCarpeta();
  const uploadDocumento = useUploadDocumento();
  const deleteDocumentoMutation = useDeleteDocumento();

  const carpetas = useMemo(() => extractApiData(carpetasData), [carpetasData]);
  const documentos = useMemo(() => {
    if (!documentosData) return [];
    if (documentosData.pages) {
      return documentosData.pages.flat();
    }
    return extractApiData(documentosData);
  }, [documentosData]);

  const loading = loadingCarpetas;

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCrearCarpeta = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createCarpeta.mutateAsync(nuevaCarpeta);
      showToast('Carpeta creada', 'success');
      setModalCarpeta(false);
      setNuevaCarpeta({ nombre: '', descripcion: '' });
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
      await uploadDocumento.mutateAsync({
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
    } catch (error) {
      showToast('Error al subir documento', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocumento = async (id) => {
    if (!confirm('¿Eliminar este documento?')) return;

    try {
      await deleteDocumentoMutation.mutateAsync(id);
      showToast('Documento eliminado', 'success');
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const handleDeleteCarpeta = async (id) => {
    if (!confirm('¿Eliminar esta carpeta y todos sus documentos?')) return;

    try {
      await deleteCarpetaMutation.mutateAsync(id);
      showToast('Carpeta eliminada', 'success');
      if (carpetaActiva?.id === id) setCarpetaActiva(null);
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const getFileIcon = (tipo) => {
    const icons = {
      PLAN_PAGO: '📋',
      CONTRATO: '📝',
      COMPROBANTE_BANCO: '🏦',
      FACTURA: '🧾',
      PERMISO: '📄',
      PLANO: '📐',
      OTRO: '📎',
    };
    return icons[tipo] || '📄';
  };

  if (loading) return <LoadingSpinner text="Cargando documentos..." />;

  // Vista de carpetas
  if (!carpetaActiva) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Documentos"
          subtitle="Gestión de documentos del proyecto"
          action={{
            label: 'Nueva Carpeta',
            icon: FolderPlus,
            onClick: () => setModalCarpeta(true),
          }}
        />

        {/* Grid de carpetas */}
        {carpetas.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {carpetas.map((carpeta) => (
              <CarpetaCard
                key={carpeta.id}
                carpeta={carpeta}
                onClick={() => setCarpetaActiva(carpeta)}
                onDelete={handleDeleteCarpeta}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={Folder}
              title="No hay carpetas creadas"
              description="Crea tu primera carpeta para organizar los documentos"
              action={{
                label: 'Crear carpeta',
                icon: FolderPlus,
                onClick: () => setModalCarpeta(true),
              }}
            />
          </Card>
        )}

        {/* FAB - Mobile only */}
        <FAB
          onClick={() => setModalCarpeta(true)}
          icon={Plus}
          label="Carpeta"
          color="emerald"
        />

        {/* BottomSheet Nueva Carpeta */}
        <BottomSheet
          isOpen={modalCarpeta}
          onClose={() => setModalCarpeta(false)}
          title="Nueva Carpeta"
          height="auto"
        >
          <form onSubmit={handleCrearCarpeta} className="space-y-5">
            <Input
              label="Nombre de la Carpeta"
              value={nuevaCarpeta.nombre}
              onChange={(e) => setNuevaCarpeta({ ...nuevaCarpeta, nombre: e.target.value })}
              placeholder="Ej: Plan de Pago Banco, Contratos"
              required
            />

            <Textarea
              label="Descripción"
              value={nuevaCarpeta.descripcion}
              onChange={(e) => setNuevaCarpeta({ ...nuevaCarpeta, descripcion: e.target.value })}
              placeholder="Descripción de la carpeta..."
              rows={3}
            />

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalCarpeta(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" loading={submitting} className="flex-1">
                Crear
              </Button>
            </div>
          </form>
        </BottomSheet>

        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // Vista de documentos en carpeta
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <PageHeader
        title={carpetaActiva.nombre}
        subtitle={`${documentos.length} documento${documentos.length !== 1 ? 's' : ''}`}
        backButton={{
          icon: ChevronLeft,
          onClick: () => setCarpetaActiva(null),
        }}
        action={{
          label: 'Subir Documento',
          icon: Upload,
          onClick: () => setModalDocumento(true),
        }}
      />

      {/* Lista de documentos */}
      {documentos.length > 0 ? (
        <Card padding="none">
          <div className="divide-y divide-gray-50">
            {documentos.map((doc) => (
              <DocumentoRow
                key={doc.id}
                doc={doc}
                getFileIcon={getFileIcon}
                onDelete={handleDeleteDocumento}
                userId={user?.user_id}
              />
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={FileText}
            title="Carpeta vacía"
            description="Sube el primer documento a esta carpeta"
            action={{
              label: 'Subir documento',
              icon: Upload,
              onClick: () => setModalDocumento(true),
            }}
          />
        </Card>
      )}

      {/* FAB - Mobile only */}
      <FAB
        onClick={() => setModalDocumento(true)}
        icon={Upload}
        label="Subir"
        color="emerald"
      />

      {/* BottomSheet Subir Documento */}
      <BottomSheet
        isOpen={modalDocumento}
        onClose={() => setModalDocumento(false)}
        title="Subir Documento"
        height="auto"
      >
        <form onSubmit={handleSubirDocumento} className="space-y-5">
          <Input
            label="Nombre del Documento"
            value={nuevoDocumento.nombre}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, nombre: e.target.value })}
            placeholder="Ej: Cronograma de pagos enero 2024"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Documento"
              value={nuevoDocumento.tipo}
              onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, tipo: e.target.value })}
              options={tiposDocumento}
              required
            />
            <Input
              label="Fecha del Documento"
              type="date"
              value={nuevoDocumento.fecha_documento}
              onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, fecha_documento: e.target.value })}
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
                onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, archivo: e.target.files[0] })}
                className="hidden"
              />
            </div>
          </div>

          <Textarea
            label="Descripción (opcional)"
            value={nuevoDocumento.descripcion}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, descripcion: e.target.value })}
            placeholder="Notas sobre este documento..."
            rows={2}
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalDocumento(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Subir
            </Button>
          </div>
        </form>
      </BottomSheet>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DocumentosPage;
