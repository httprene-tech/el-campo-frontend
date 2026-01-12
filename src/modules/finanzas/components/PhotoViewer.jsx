import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  MessageCircle,
  Trash2,
  Info,
} from 'lucide-react';

/**
 * PhotoViewer - Visor de fotos a pantalla completa para PWA móvil
 * Usa createPortal para renderizar encima del sidebar
 */
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
  albumNombre,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentIndex = fotos.findIndex((f) => f.id === foto.id);
  const hasNext = currentIndex < fotos.length - 1;
  const hasPrev = currentIndex > 0;

  // Gestos de swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
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
    window.history.pushState({ photoViewer: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  // Reset image state on photo change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [foto.id]);

  const handleClose = useCallback(() => {
    window.history.back();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Navegar directamente a una foto por índice
  const navigateToIndex = (targetIndex) => {
    const diff = targetIndex - currentIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) onNext();
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) onPrev();
    }
  };

  return createPortal(
    <div
      className="photo-viewer-portal"
      style={{ height: '100dvh' }}
    >
      {/* Header con botón de regresar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-2 sm:px-4 bg-black/80 backdrop-blur-md"
        style={{
          paddingTop: 'max(8px, env(safe-area-inset-top))',
          paddingBottom: '8px',
          minHeight: '56px',
        }}
      >
        {/* Botón regresar */}
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
          className={`p-3 rounded-xl transition-all ${
            showInfo
              ? 'bg-white/25 text-white'
              : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <Info className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Área de imagen con gestos */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative min-h-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Botones navegación desktop */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Imagen */}
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-white/60">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                <Info className="w-8 h-8" />
              </div>
              <p className="text-sm">Error al cargar imagen</p>
            </div>
          ) : (
            <img
              src={foto.imagen}
              alt={foto.titulo || 'Foto'}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              draggable={false}
            />
          )}
        </div>

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Indicadores de swipe en móvil */}
        {(hasPrev || hasNext) && (
          <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1 pointer-events-none">
            {hasPrev ? (
              <div className="p-1.5 bg-white/20 rounded-full">
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </div>
            ) : (
              <div className="w-7" />
            )}
            {hasNext ? (
              <div className="p-1.5 bg-white/20 rounded-full">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </div>
            ) : (
              <div className="w-7" />
            )}
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

      {/* Footer con acciones */}
      <div
        className="flex-shrink-0 bg-black/80 backdrop-blur-md px-2 sm:px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {/* Thumbnails horizontales */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {fotos.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => navigateToIndex(idx)}
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

        {/* Acciones principales */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* WhatsApp */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(foto, 'whatsapp');
            }}
            className="p-3 sm:p-3.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Compartir */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(foto, 'native');
            }}
            className="p-3 sm:p-3.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Descargar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(foto);
            }}
            className="p-3 sm:p-3.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Eliminar */}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(foto.id);
              }}
              className="p-3 sm:p-3.5 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PhotoViewer;
