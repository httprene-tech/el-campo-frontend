import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  type = 'default', // default, success, error, warning, info
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const modalContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Scroll container */}
      <div 
        className="fixed inset-0 overflow-y-auto"
        onClick={onClose}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal panel */}
          <div
            className={`
              relative w-full ${sizes[size]}
              bg-white rounded-2xl shadow-2xl
              modal-enter
              flex flex-col
              max-h-[85vh]
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {icons[type] && <span className="flex-shrink-0">{icons[type]}</span>}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal at root level using Portal
  return createPortal(modalContent, document.body);
};

export default Modal;