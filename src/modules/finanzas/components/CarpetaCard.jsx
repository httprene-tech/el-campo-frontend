import React, { memo } from 'react';
import { Folder, Trash2 } from 'lucide-react';

/**
 * CarpetaCard - Tarjeta de carpeta para organización de documentos
 * Reutilizable en cualquier módulo que necesite mostrar carpetas
 */
const CarpetaCard = memo(({ carpeta, onClick, onDelete }) => (
  <div
    className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-emerald-200 transition-all active:scale-[0.98]"
    onClick={onClick}
  >
    {/* Delete button */}
    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(carpeta.id);
        }}
        className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
        style={{ touchAction: 'manipulation' }}
      >
        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
      </button>
    )}

    <div className="mb-4">
      <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
        <Folder className="w-8 h-8 text-amber-500" />
      </div>
    </div>

    <h3 className="font-semibold text-gray-900 truncate">{carpeta.nombre}</h3>
    <p className="text-sm text-gray-500 mt-1">
      {carpeta.cantidad_documentos || 0} documento{carpeta.cantidad_documentos !== 1 && 's'}
    </p>
  </div>
));

CarpetaCard.displayName = 'CarpetaCard';

export default CarpetaCard;
