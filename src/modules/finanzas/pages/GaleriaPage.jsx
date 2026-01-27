import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAlbumes, useFotos } from '../../../hooks/queries/finanzas';
import { useCreateAlbum, useUploadFoto, useDeleteFoto, useDeleteAlbum } from '../../../hooks/mutations/finanzas';
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
import { 
  Plus, 
  Image, 
  Upload, 
  ChevronLeft, 
  Camera, 
  Grid, 
  LayoutGrid 
} from 'lucide-react';

// Componentes extraídos
import { PhotoViewer, AlbumCard, FotoCard } from '../components';

// Skeleton para carga de fotos
const PhotoSkeleton = () => (
  <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
);

const GaleriaPage = () => {
  const { user } = useAuth();

  // Helper para resolver URLs de imágenes
  const getMediaUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootUrl = apiBase.replace(/\/api\/?$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;

    return `${rootUrl}${path}`;
  }, []);

  const [albumActivo, setAlbumActivo] = useState(null);
  const [modalAlbum, setModalAlbum] = useState(false);
  const [fotoActiva, setFotoActiva] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [gridSize, setGridSize] = useState('normal');
  const fileInputRef = useRef(null);

  const [nuevoAlbum, setNuevoAlbum] = useState({ nombre: '', descripcion: '' });

  // React Query hooks
  const { data: albumesData = [], isLoading: loadingAlbumes } = useAlbumes();
  const { data: fotosData = [], isLoading: loadingFotos } = useFotos(albumActivo?.id);

  // Mutations
  const createAlbum = useCreateAlbum();
  const uploadFoto = useUploadFoto();
  const deleteFotoMutation = useDeleteFoto();
  const deleteAlbumMutation = useDeleteAlbum();

  const albumes = useMemo(() => extractApiData(albumesData), [albumesData]);
  const fotos = useMemo(() => extractApiData(fotosData), [fotosData]);

  const loading = loadingAlbumes;

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCrearAlbum = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createAlbum.mutateAsync(nuevoAlbum);
      showToast('Álbum creado', 'success');
      setModalAlbum(false);
      setNuevoAlbum({ nombre: '', descripcion: '' });
    } catch (error) {
      showToast('Error al crear álbum', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubirFotos = async (files) => {
    if (!albumActivo) return;

    setSubmitting(true);
    let subidas = 0;

    for (const file of files) {
      try {
        await uploadFoto.mutateAsync({ albumId: albumActivo.id, imagen: file });
        subidas++;
      } catch (error) {
        console.error('Error subiendo foto:', error);
      }
    }

    showToast(`${subidas} foto(s) subida(s)`, 'success');
    setSubmitting(false);
  };

  const handleDeleteFoto = async (id) => {
    if (!confirm('¿Eliminar esta foto?')) return;

    try {
      await deleteFotoMutation.mutateAsync(id);
      showToast('Foto eliminada', 'success');

      // Navegar a la siguiente foto o cerrar
      const idx = fotos.findIndex((f) => f.id === id);
      if (fotos.length > 1) {
        if (idx < fotos.length - 1) {
          setFotoActiva(fotos[idx + 1]);
        } else {
          setFotoActiva(fotos[idx - 1]);
        }
      } else {
        setFotoActiva(null);
      }
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!confirm('¿Eliminar este álbum y todas sus fotos?')) return;

    try {
      await deleteAlbumMutation.mutateAsync(id);
      showToast('Álbum eliminado', 'success');
      if (albumActivo?.id === id) setAlbumActivo(null);
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  // Compartir foto
  const handleShare = useCallback(
    async (foto, method) => {
      const shareUrl = foto.imagen;
      const shareText = `📸 Foto del proyecto: ${albumActivo?.nombre || 'Galería'}`;

      if (method === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
      } else if (navigator.share) {
        try {
          await navigator.share({
            title: foto.titulo || 'Foto del proyecto',
            text: shareText,
            url: shareUrl,
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
          }
        }
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
      }
    },
    [albumActivo]
  );

  // Descargar foto
  const handleDownload = useCallback(async (foto) => {
    try {
      const response = await fetch(foto.imagen);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = foto.titulo || `foto_${foto.id}.jpg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(foto.imagen, '_blank');
    }
  }, []);

  // Navegación de fotos
  const handleNextFoto = useCallback(() => {
    const idx = fotos.findIndex((f) => f.id === fotoActiva.id);
    if (idx < fotos.length - 1) {
      setFotoActiva(fotos[idx + 1]);
    }
  }, [fotos, fotoActiva]);

  const handlePrevFoto = useCallback(() => {
    const idx = fotos.findIndex((f) => f.id === fotoActiva.id);
    if (idx > 0) {
      setFotoActiva(fotos[idx - 1]);
    }
  }, [fotos, fotoActiva]);

  if (loading) return <LoadingSpinner text="Cargando galería..." />;

  // Vista de álbumes
  if (!albumActivo) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Galería"
          subtitle={`${albumes.length} álbum${albumes.length !== 1 ? 'es' : ''} de fotos`}
          action={{
            label: 'Nuevo Álbum',
            icon: Plus,
            onClick: () => setModalAlbum(true),
          }}
        />

        {/* Grid de álbumes */}
        {albumes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumes.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => setAlbumActivo(album)}
                onDelete={handleDeleteAlbum}
                getMediaUrl={getMediaUrl}
                userId={user?.user_id}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={Image}
              title="Sin álbumes"
              description="Crea tu primer álbum para organizar las fotos"
              action={{
                label: 'Crear álbum',
                icon: Plus,
                onClick: () => setModalAlbum(true),
              }}
            />
          </Card>
        )}

        {/* FAB - Mobile only */}
        <FAB
          onClick={() => setModalAlbum(true)}
          icon={Plus}
          label="Álbum"
          color="emerald"
        />

        {/* BottomSheet Nuevo Álbum */}
        <BottomSheet
          isOpen={modalAlbum}
          onClose={() => setModalAlbum(false)}
          title="Nuevo Álbum"
          height="auto"
        >
          <form onSubmit={handleCrearAlbum} className="space-y-5">
            <Input
              label="Nombre del Álbum"
              value={nuevoAlbum.nombre}
              onChange={(e) => setNuevoAlbum({ ...nuevoAlbum, nombre: e.target.value })}
              placeholder="Ej: Cimientos, Estructura"
              required
            />

            <Textarea
              label="Descripción"
              value={nuevoAlbum.descripcion}
              onChange={(e) => setNuevoAlbum({ ...nuevoAlbum, descripcion: e.target.value })}
              placeholder="Descripción del álbum..."
              rows={3}
            />

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalAlbum(false)} className="flex-1">
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

  // Vista de fotos del álbum
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <PageHeader
        title={albumActivo.nombre}
        subtitle={`${fotos.length} foto${fotos.length !== 1 ? 's' : ''}`}
        backButton={{
          icon: ChevronLeft,
          onClick: () => setAlbumActivo(null),
        }}
      />

      {/* Actions bar */}
      <div className="flex items-center justify-end gap-2">
        {/* Toggle grid size */}
        <button
          onClick={() => setGridSize((s) => (s === 'normal' ? 'compact' : 'normal'))}
          className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          title={gridSize === 'normal' ? 'Vista compacta' : 'Vista normal'}
        >
          {gridSize === 'normal' ? <LayoutGrid className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleSubirFotos(Array.from(e.target.files))}
          className="hidden"
        />
        <Button 
          icon={Upload} 
          onClick={() => fileInputRef.current?.click()} 
          loading={submitting}
          className="hidden sm:flex"
        >
          Subir Fotos
        </Button>
      </div>

      {/* Grid de fotos */}
      {fotos.length > 0 || loadingFotos ? (
        <div
          className={`grid gap-2 sm:gap-3 ${
            gridSize === 'compact'
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {loadingFotos ? (
            Array.from({ length: 8 }).map((_, i) => <PhotoSkeleton key={i} />)
          ) : (
            fotos.map((foto, idx) => (
              <FotoCard key={foto.id} foto={foto} index={idx} onClick={() => setFotoActiva(foto)} />
            ))
          )}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Camera}
            title="Álbum vacío"
            description="Sube las primeras fotos a este álbum"
            action={{
              label: 'Subir fotos',
              icon: Upload,
              onClick: () => fileInputRef.current?.click(),
            }}
          />
        </Card>
      )}

      {/* FAB - Mobile only for upload */}
      <FAB
        onClick={() => fileInputRef.current?.click()}
        icon={Upload}
        label="Subir"
        color="emerald"
      />

      {/* Visor de fotos a pantalla completa */}
      {fotoActiva && (
        <PhotoViewer
          foto={fotoActiva}
          fotos={fotos}
          onClose={() => setFotoActiva(null)}
          onNext={handleNextFoto}
          onPrev={handlePrevFoto}
          onDelete={handleDeleteFoto}
          onShare={handleShare}
          onDownload={handleDownload}
          canDelete={fotoActiva.subido_por === user?.user_id}
          albumNombre={albumActivo.nombre}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GaleriaPage;
