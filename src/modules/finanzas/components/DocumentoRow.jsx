import React, { memo } from 'react';
import { Calendar, Download, Trash2 } from 'lucide-react';

/**
 * DocumentoRow - Fila de documento con acciones de descarga y eliminación
 * Reutilizable para mostrar documentos en listas
 */
const DocumentoRow = memo(({ doc, getFileIcon, onDelete, userId, onDownload }) => {
  // Formatear fecha de manera segura
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    try {
      return new Date(dateStr).toLocaleDateString('es-BO');
    } catch {
      return 'Sin fecha';
    }
  };

  // Icono por defecto si no se proporciona getFileIcon
  const defaultGetFileIcon = (tipo) => {
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

  const iconFn = getFileIcon || defaultGetFileIcon;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {iconFn(doc.tipo)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{doc.nombre}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{doc.tipo_display || doc.tipo}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(doc.fecha_documento)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.archivo && (
          <a
            href={doc.archivo}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={onDownload}
            className="p-2 hover:bg-emerald-50 rounded-lg text-gray-600 hover:text-emerald-600 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            <Download className="w-5 h-5" />
          </a>
        )}
        {onDelete && doc.subido_por === userId && (
          <button
            onClick={() => onDelete(doc.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
});

DocumentoRow.displayName = 'DocumentoRow';

export default DocumentoRow;
