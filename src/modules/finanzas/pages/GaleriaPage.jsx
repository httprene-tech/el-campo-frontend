import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAlbumes, useFotos } from '../../../hooks/queries/finanzas';
import { useCreateAlbum, useUploadFoto, useDeleteFoto, useDeleteAlbum } from '../../../hooks/mutations/finanzas';
import { Card, Button, Modal, Input, LoadingSpinner, Toast } from '../../../components/common';
import { extractApiData } from '../../../utils/formatters';
import {
  Plus,
  Image,
  Folder,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Share2,
  Download,
  MessageCircle,
  Info,
  Grid,
  LayoutGrid,
  ZoomIn,
} from 'lucide-react';

// Skeleton para carga de fotos
const PhotoSkeleton = () => (
  <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
);

// Componente memoizado para tarjeta de álbum mejorado
const AlbumCard = React.memo(({ album, onClick, onDelete, getMediaUrl, userId }) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
    onClick={onClick}
  >
    {/* Portada con efecto parallax suave */}
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {album.portada ? (
        <img 
          loading="lazy"
          src={getMediaUrl(album.portada)} 
          alt={album.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <Folder className="w-16 h-16 text-emerald-300" />
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Badge de cantidad */}
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full">
        <span className="text-white text-xs font-medium">{album.cantidad_fotos}</span>
      </div>
      
      {/* Botón eliminar */}
      {album.creado_por === userId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(album.id);
          }}
          className="absolute top-3 left-3 p-2 bg-red-500/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}
    </div>

    {/* Info */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 truncate">{album.nombre}</h3>
      <p className="text-sm text-gray-500">
        {album.cantidad_fotos} foto{album.cantidad_fotos !== 1 && 's'}
      </p>
    </div>
  </div>
));

AlbumCard.displayName = 'AlbumCard';

// Componente memoizado para foto con animación
const FotoCard = React.memo(({ foto, onClick, index }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div
      className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
      onClick={onClick}
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.4s ease-out forwards',
        opacity: 0,
      }}
    >
      {!loaded && <PhotoSkeleton />}
      <img 
        loading="lazy"
        src={foto.imagen} 
        alt={foto.titulo || 'Foto'}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
      
      {/* Overlay con gradiente mejorado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {foto.titulo && (
            <p className="text-white text-sm font-medium truncate">{foto.titulo}</p>
          )}
          <p className="text-white/70 text-xs">
            {(foto.fecha_foto || foto.creado_en) 
              ? new Date(foto.fecha_foto || foto.creado_en).toLocaleDateString('es-BO')
              : 'Sin fecha'}
          </p>
        </div>
      </div>
      
      {/* Icono de zoom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
});

FotoCard.displayName = 'FotoCard';

// Componente de visor de fotos a pantalla completa - Optimizado para PWA móvil
const PhotoViewer = ({ 
  foto, 
  fotos, 
  onClose, 
  onNext, 
  onPrev, 
  onDelete, 
  onShare, 
  onDownload, 
  canDelete,
  albumNombre 
}) => {
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const currentIndex = fotos.findIndex(f => f.id === foto.id);
  const hasNext = currentIndex < fotos.length - 1;
  const hasPrev = currentIndex > 0;

  // Gestos de swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasNext) {
      onNext();
    } else if (isRightSwipe && hasPrev) {
      onPrev();
    }
  };

  // Soporte para botón de atrás del navegador/PWA
  useEffect(() => {
    // Añadir entrada al historial cuando se abre el visor
    window.history.pushState({ photoViewer: true }, '');
    
    const handlePopState = (e) => {
      // Cuando el usuario presiona atrás, cerrar el visor
      onClose();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'Escape') {
        window.history.back(); // Usar history.back para mantener consistencia
      }
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.5, 3));
      if (e.key === '-') setZoom(z => Math.max(z - 0.5, 1));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, onNext, onPrev]);

  // Reset zoom on photo change
  useEffect(() => {
    setZoom(1);
    setImageLoaded(false);
  }, [foto.id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para cerrar usando history.back para consistencia
  const handleClose = () => {
    window.history.back();
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh', // Uses dynamic viewport height, falls back to 100vh in older browsers via inset-0
        zIndex: 99999,
        animation: 'photoViewerFadeIn 0.3s ease-out forwards',
      }}
    >
      {/* Header fijo con botón de regresar MUY PROMINENTE */}
      <div 
        className="flex-shrink-0 flex items-center justify-between px-2 sm:px-4 bg-black/80 backdrop-blur-md"
        style={{ 
          paddingTop: 'max(8px, env(safe-area-inset-top))',
          paddingBottom: '8px',
          minHeight: '56px',
        }}
      >
        {/* Botón regresar - GRANDE Y VISIBLE */}
        <button 
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 bg-white/20 hover:bg-white/30 active:bg-white/10 rounded-xl transition-all active:scale-95 min-w-[90px] sm:min-w-[100px]"
          onClick={handleClose}
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
          <span className="text-white font-semibold text-base sm:text-lg">Volver</span>
        </button>
        
        {/* Contador de fotos */}
        <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {fotos.length}
          </span>
        </div>
        
        {/* Info button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`p-3 rounded-xl transition-all ${showInfo ? 'bg-white/25 text-white' : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <Info className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      {/* Área de imagen con gestos */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden relative min-h-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Botón anterior - Solo desktop */}
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        
        {/* Imagen */}
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <img 
            src={foto.imagen} 
            alt={foto.titulo || 'Foto'}
            className={`max-w-full max-h-full object-contain transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              transform: `scale(${zoom})`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>
        
        {/* Botón siguiente - Solo desktop */}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
        
        {/* Indicadores de swipe en móvil - Mejorados */}
        {(hasPrev || hasNext) && (
          <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1 pointer-events-none">
            {hasPrev ? (
              <div className="p-1.5 bg-white/20 rounded-full">
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </div>
            ) : <div className="w-7" />}
            {hasNext ? (
              <div className="p-1.5 bg-white/20 rounded-full">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </div>
            ) : <div className="w-7" />}
          </div>
        )}
      </div>
      
      {/* Panel de información */}
      {showInfo && (
        <div 
          className="absolute top-20 right-2 sm:right-4 left-2 sm:left-auto w-auto sm:w-72 bg-black/90 backdrop-blur-lg rounded-xl p-4 text-white z-20 animate-fade-in"
          style={{ maxWidth: 'calc(100% - 16px)' }}
        >
          <h4 className="font-semibold mb-3">Información</h4>
          <div className="space-y-2 text-sm">
            {foto.titulo && (
              <div>
                <span className="text-white/60">Título:</span>
                <p className="font-medium">{foto.titulo}</p>
              </div>
            )}
            <div>
              <span className="text-white/60">Fecha:</span>
              <p className="font-medium">{formatDate(foto.fecha_foto || foto.creado_en)}</p>
            </div>
            <div>
              <span className="text-white/60">Álbum:</span>
              <p className="font-medium">{albumNombre}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer simplificado con acciones */}
      <div 
        className="flex-shrink-0 bg-black/80 backdrop-blur-md px-2 sm:px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {/* Thumbnails horizontales - Más pequeños en móvil */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {fotos.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => {
                const diff = idx - currentIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) onNext();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) onPrev();
                }
              }}
              className={`flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                f.id === foto.id 
                  ? 'ring-2 ring-white ring-offset-1 ring-offset-black scale-105' 
                  : 'opacity-40 hover:opacity-70'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <img 
                src={f.imagen} 
                alt="" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        
        {/* Acciones principales - Simplificadas */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* WhatsApp */}
          <button
            onClick={(e) => { e.stopPropagation(); onShare(foto, 'whatsapp'); }}
            className="p-3 sm:p-3.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Compartir */}
          <button
            onClick={(e) => { e.stopPropagation(); onShare(foto, 'native'); }}
            className="p-3 sm:p-3.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Descargar */}
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(foto); }}
            className="p-3 sm:p-3.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Eliminar */}
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(foto.id); }}
              className="p-3 sm:p-3.5 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>
      
      {/* CSS para animación */}
      <style>{`
        @keyframes photoViewerFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
      </style>
    </div>
  );
};

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
  const [gridSize, setGridSize] = useState('normal'); // 'compact' | 'normal'
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
      const idx = fotos.findIndex(f => f.id === id);
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
  const handleShare = useCallback(async (foto, method) => {
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
  }, [albumActivo]);

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
    const idx = fotos.findIndex(f => f.id === fotoActiva.id);
    if (idx < fotos.length - 1) {
      setFotoActiva(fotos[idx + 1]);
    }
  }, [fotos, fotoActiva]);

  const handlePrevFoto = useCallback(() => {
    const idx = fotos.findIndex(f => f.id === fotoActiva.id);
    if (idx > 0) {
      setFotoActiva(fotos[idx - 1]);
    }
  }, [fotos, fotoActiva]);

  if (loading) return <LoadingSpinner text="Cargando galería..." />;

  // Vista de álbumes
  if (!albumActivo) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
            <p className="text-gray-500">{albumes.length} álbum{albumes.length !== 1 && 'es'} de fotos</p>
          </div>
          <Button icon={Plus} onClick={() => setModalAlbum(true)}>
            Nuevo Álbum
          </Button>
        </div>

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

          {albumes.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin álbumes</h3>
              <p className="text-gray-500 mb-6">Crea tu primer álbum para organizar las fotos</p>
              <Button onClick={() => setModalAlbum(true)}>
                Crear álbum
              </Button>
            </div>
          )}
        </div>

        {/* Modal Nuevo Álbum */}
        <Modal
          isOpen={modalAlbum}
          onClose={() => setModalAlbum(false)}
          title="Nuevo Álbum"
          size="sm"
        >
          <form onSubmit={handleCrearAlbum} className="space-y-5">
            <Input
              label="Nombre del Álbum"
              value={nuevoAlbum.nombre}
              onChange={(e) => setNuevoAlbum({...nuevoAlbum, nombre: e.target.value})}
              placeholder="Ej: Cimientos, Estructura"
              required
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={nuevoAlbum.descripcion}
                onChange={(e) => setNuevoAlbum({...nuevoAlbum, descripcion: e.target.value})}
                placeholder="Descripción del álbum..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalAlbum(false)} className="flex-1">
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

  // Vista de fotos del álbum
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlbumActivo(null)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{albumActivo.nombre}</h1>
            <p className="text-gray-500">{fotos.length} foto{fotos.length !== 1 && 's'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Toggle grid size */}
          <button
            onClick={() => setGridSize(s => s === 'normal' ? 'compact' : 'normal')}
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
          >
            <span className="hidden sm:inline">Subir Fotos</span>
            <span className="sm:hidden">Subir</span>
          </Button>
        </div>
      </div>

      {/* Grid de fotos */}
      <div className={`grid gap-2 sm:gap-3 ${
        gridSize === 'compact' 
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6' 
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {loadingFotos ? (
          Array.from({ length: 8 }).map((_, i) => <PhotoSkeleton key={i} />)
        ) : (
          fotos.map((foto, idx) => (
            <FotoCard
              key={foto.id}
              foto={foto}
              index={idx}
              onClick={() => setFotoActiva(foto)}
            />
          ))
        )}

        {fotos.length === 0 && !loadingFotos && (
          <Card className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Álbum vacío</h3>
            <p className="text-gray-500 mb-6">Sube las primeras fotos a este álbum</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Subir fotos
            </Button>
          </Card>
        )}
      </div>

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
      
      {/* CSS global */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes photoViewerFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GaleriaPage;
