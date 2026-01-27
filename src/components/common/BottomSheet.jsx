import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * BottomSheet Modal - Se muestra desde abajo en móvil, centrado en desktop
 * Soporta gestos de arrastre para cerrar
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
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDragY(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsVisible(false);
      setDragY(0);
    }
  };

  // Drag handlers para mobile
  const handleTouchStart = useCallback((e) => {
    // Solo permitir drag desde el header o handle
    const target = e.target;
    const isHandle = target.closest('[data-drag-handle]');
    if (!isHandle) return;
    
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Solo permitir arrastrar hacia abajo
    if (diff > 0) {
      setDragY(diff);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Si se arrastró más de 100px, cerrar
    if (dragY > 100) {
      onClose();
    } else {
      // Volver a posición original con animación
      setDragY(0);
    }
  }, [isDragging, dragY, onClose]);

  if (!isVisible && !isOpen) return null;

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[95vh]',
  };

  const content = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop - smooth opacity transition */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: isOpen ? (isDragging ? Math.max(0.3, 1 - dragY / 300) : 1) : 0,
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      {isMobile ? (
        // Mobile: Bottom Sheet con drag
        <div
          ref={sheetRef}
          className={`
            fixed bottom-0 left-0 right-0
            bg-white rounded-t-3xl shadow-2xl
            ${heightClasses[height]}
            flex flex-col
            safe-area-inset-bottom
            touch-none
          `}
          style={{
            transform: isOpen 
              ? `translateY(${dragY}px)` 
              : 'translateY(100%)',
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'transform',
          }}
          onTransitionEnd={handleAnimationEnd}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Handle bar - área draggable */}
          <div 
            data-drag-handle
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          >
            <div className={`w-12 h-1.5 rounded-full transition-colors ${isDragging ? 'bg-gray-400' : 'bg-gray-300'}`} />
          </div>

          {/* Header - también draggable */}
          <div 
            data-drag-handle
            className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 cursor-grab active:cursor-grabbing"
          >
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
          <div className="flex-1 overflow-y-auto overscroll-contain p-5 touch-auto">
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
