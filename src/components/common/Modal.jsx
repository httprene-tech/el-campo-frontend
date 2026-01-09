import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  type = 'default', // default, success, error, warning, info
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in will-change-opacity"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div
        className="
          relative z-50
          flex min-h-full w-full
          items-start sm:items-center justify-center
          p-3 sm:p-4
        "
      >
        <div
          className={`
            relative w-full
            ${sizes[size]}
            bg-white rounded-2xl shadow-2xl
            animate-scale-in will-change-transform
            flex flex-col
            max-h-[calc(100vh-3rem)]
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {icons[type] && <span className="flex-shrink-0">{icons[type]}</span>}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all duration-150 ease-out touch-manipulation flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="p-4 sm:p-5 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;