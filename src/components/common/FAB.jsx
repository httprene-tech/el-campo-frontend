import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

/**
 * FAB - Floating Action Button
 * Solo visible en móvil, se oculta al hacer scroll hacia abajo
 */
const FAB = ({ 
  onClick, 
  icon: Icon = Plus,
  label = 'Nuevo',
  color = 'emerald', // emerald, blue, red, amber
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!isMobile || !visible) return null;

  const colors = {
    emerald: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200',
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200',
    red: 'bg-red-500 hover:bg-red-600 shadow-red-200',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-5 py-3.5
        text-white font-medium
        rounded-full
        shadow-xl
        transform transition-all duration-300 ease-out
        ${colors[color]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
        active:scale-95
        safe-area-inset-bottom
      `}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default FAB;
