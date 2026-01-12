import React, { memo } from 'react';
import { Folder, Trash2 } from 'lucide-react';

/**
 * AlbumCard - Tarjeta de álbum con portada y acciones
 */
const AlbumCard = memo(({ album, onClick, onDelete, getMediaUrl, userId }) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
    onClick={onClick}
  >
    {/* Portada */}
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {album.portada ? (
        <img
          loading="lazy"
          src={getMediaUrl(album.portada)}
          alt={album.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
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

export default AlbumCard;
