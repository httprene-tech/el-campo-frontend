import React, { memo, useState } from 'react';
import { ZoomIn, Image } from 'lucide-react';

/**
 * FotoCard - Tarjeta de foto con lazy loading y manejo de errores
 */
const FotoCard = memo(({ foto, onClick, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    try {
      return new Date(dateStr).toLocaleDateString('es-BO');
    } catch {
      return 'Sin fecha';
    }
  };

  return (
    <div
      className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer animate-fade-in-up"
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Skeleton loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Image className="w-8 h-8 text-gray-300" />
        </div>
      ) : (
        <img
          loading="lazy"
          src={foto.imagen}
          alt={foto.titulo || 'Foto'}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* Overlay con info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {foto.titulo && (
            <p className="text-white text-sm font-medium truncate">{foto.titulo}</p>
          )}
          <p className="text-white/70 text-xs">
            {formatDate(foto.fecha_foto || foto.creado_en)}
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

export default FotoCard;
