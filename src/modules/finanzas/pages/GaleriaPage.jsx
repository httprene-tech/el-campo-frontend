import React, { useState, useRef, useMemo } from 'react';
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
  X,
  ChevronLeft,
  Camera,
  Share2,
  Download,
  MessageCircle,
} from 'lucide-react';

// Componente memoizado para tarjeta de álbum
const AlbumCard = React.memo(({ album, onClick, onDelete, getMediaUrl }) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
    onClick={onClick}
  >
    {/* Portada */}
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
      {album.portada ? (
        <img 
          loading="lazy"
          src={getMediaUrl(album.portada)} 
          alt={album.nombre}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Folder className="w-16 h-16 text-gray-300" />
        </div>
      )}
      
      {/* Overlay con acciones */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(album.id);
          }}
          className="p-2 bg-white rounded-full hover:bg-red-50"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
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

// Componente memoizado para foto
const FotoCard = React.memo(({ foto, onClick }) => (
  <div
    className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
    onClick={onClick}
  >
    <img 
      loading="lazy"
      src={foto.imagen} 
      alt={foto.titulo || 'Foto'}
      className="w-full h-full object-cover transition-transform group-hover:scale-105"
    />
    
    {/* Overlay con fecha */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-0 left-0 right-0 p-3">
        {foto.titulo && (
          <p className="text-white text-sm font-medium truncate">{foto.titulo}</p>
        )}
        <p className="text-white/70 text-xs">
          {new Date(foto.fecha_subida).toLocaleDateString('es-BO')}
        </p>
      </div>
    </div>
  </div>
));

FotoCard.displayName = 'FotoCard';

const GaleriaPage = () => {
  // Helper para resolver URLs de imágenes
  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootUrl = apiBase.replace(/\/api\/?$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    
    return `${rootUrl}${path}`;
  };

  const [albumActivo, setAlbumActivo] = useState(null);
  const [modalAlbum, setModalAlbum] = useState(false);
  const [modalFoto, setModalFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
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

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      setModalFoto(null);
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

  // Compartir foto por WhatsApp
  const compartirWhatsApp = (foto) => {
    const mensaje = `📸 Foto del proyecto: ${albumActivo?.nombre || 'Galería'}\n${foto.imagen}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Compartir nativo (Web Share API)
  const compartirNativo = async (foto) => {
    if (!navigator.share) {
      compartirWhatsApp(foto);
      return;
    }
    
    try {
      await navigator.share({
        title: foto.titulo || 'Foto del proyecto',
        text: `Foto de ${albumActivo?.nombre || 'la galería'}`,
        url: foto.imagen,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        compartirWhatsApp(foto);
      }
    }
  };

  // Descargar foto
  const descargarFoto = async (foto) => {
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
  };

  if (loading) return <LoadingSpinner text="Cargando galería..." />;

  // Vista de álbumes
  if (!albumActivo) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
            <p className="text-gray-500">Álbumes de fotos del proyecto</p>
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
            />
          ))}

          {albumes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay álbumes creados</p>
              <Button onClick={() => setModalAlbum(true)} className="mt-4">
                Crear primer álbum
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
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{albumActivo.nombre}</h1>
            <p className="text-gray-500">{fotos.length} foto{fotos.length !== 1 && 's'}</p>
          </div>
        </div>
        <div className="flex gap-2">
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
            Subir Fotos
          </Button>
        </div>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((foto) => (
          <FotoCard
            key={foto.id}
            foto={foto}
            onClick={() => setModalFoto(foto)}
          />
        ))}

        {fotos.length === 0 && !loadingFotos && (
          <Card className="col-span-full text-center py-12">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Este álbum está vacío</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Subir primera foto
            </Button>
          </Card>
        )}
      </div>

      {/* Modal Vista de Foto con opciones de compartir */}
      {modalFoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onClick={() => setModalFoto(null)}
        >
          {/* Toolbar superior */}
          <div className="flex items-center justify-between p-4 safe-area-inset-top">
            <button 
              className="p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setModalFoto(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Acciones */}
            <div className="flex items-center gap-2">
              {/* Compartir WhatsApp */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  compartirWhatsApp(modalFoto);
                }}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                title="Enviar por WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              
              {/* Compartir nativo */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  compartirNativo(modalFoto);
                }}
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                title="Compartir"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {/* Descargar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  descargarFoto(modalFoto);
                }}
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                title="Descargar"
              >
                <Download className="w-5 h-5" />
              </button>
              
              {/* Eliminar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFoto(modalFoto.id);
                }}
                className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Imagen */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={modalFoto.imagen} 
              alt={modalFoto.titulo || 'Foto'}
              className="max-w-full max-h-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Info inferior */}
          <div className="p-4 safe-area-inset-bottom text-center">
            {modalFoto.titulo && (
              <p className="text-white font-medium">{modalFoto.titulo}</p>
            )}
            <p className="text-white/60 text-sm">
              {new Date(modalFoto.fecha_subida).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GaleriaPage;
