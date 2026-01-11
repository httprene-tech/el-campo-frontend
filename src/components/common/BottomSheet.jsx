import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * BottomSheet Modal - Se muestra desde abajo en móvil, centrado en desktop
 */
const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  height = 'auto', // 'auto', 'half', 'full'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setIsVisible(false);
  };

  if (!isVisible && !isOpen) return null;

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[95vh]',
  };

  const content = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      {isMobile ? (
        // Mobile: Bottom Sheet
        <div
          className={`
            fixed bottom-0 left-0 right-0
            bg-white rounded-t-3xl shadow-2xl
            ${heightClasses[height]}
            transform transition-transform duration-300 ease-out
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
            flex flex-col
            safe-area-inset-bottom
          `}
          onTransitionEnd={handleAnimationEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">
            {children}
          </div>
        </div>
      ) : (
        // Desktop: Centered Modal
        <div 
          className="fixed inset-0 overflow-y-auto"
          onClick={onClose}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className={`
                relative w-full max-w-md
                bg-white rounded-2xl shadow-2xl
                transform transition-all duration-300
                ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                flex flex-col
                max-h-[85vh]
              `}
              onClick={(e) => e.stopPropagation()}
              onTransitionEnd={handleAnimationEnd}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
};

export default BottomSheet;
