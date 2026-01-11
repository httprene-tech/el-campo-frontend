import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para Pull-to-Refresh
 * Retorna: { isRefreshing, pullProgress, onTouchStart, onTouchMove, onTouchEnd }
 */
export const usePullToRefresh = (onRefresh, { threshold = 80, enabled = true } = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullProgress, setPullProgress] = useState(0);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullProgress(0);
    }
  }, [onRefresh, isRefreshing]);

  const onTouchStart = useCallback((e) => {
    if (!enabled || window.scrollY > 5) return;
    setStartY(e.touches[0].clientY);
  }, [enabled]);

  const onTouchMove = useCallback((e) => {
    if (!enabled || startY === 0 || window.scrollY > 5) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
      // Resistencia al pull (efecto de goma)
      const progress = Math.min(diff * 0.5, threshold * 1.5);
      setPullProgress(progress);
    }
  }, [enabled, startY, threshold]);

  const onTouchEnd = useCallback(() => {
    if (pullProgress >= threshold) {
      handleRefresh();
    } else {
      setPullProgress(0);
    }
    setStartY(0);
  }, [pullProgress, threshold, handleRefresh]);

  return {
    isRefreshing,
    pullProgress,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

/**
 * Componente PullToRefresh Indicator
 */
export const PullToRefreshIndicator = ({ progress, isRefreshing, threshold = 80 }) => {
  const isTriggered = progress >= threshold;
  
  if (progress <= 0 && !isRefreshing) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ 
        transform: `translateY(${Math.min(progress, threshold)}px)`,
        transition: isRefreshing ? 'none' : 'transform 0.2s ease-out',
      }}
    >
      <div className={`
        w-10 h-10 rounded-full bg-white shadow-lg
        flex items-center justify-center
        transform transition-all duration-200
        ${isTriggered || isRefreshing ? 'scale-100' : 'scale-75'}
      `}>
        {isRefreshing ? (
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg 
            className={`w-5 h-5 text-emerald-500 transition-transform duration-200 ${isTriggered ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default usePullToRefresh;
