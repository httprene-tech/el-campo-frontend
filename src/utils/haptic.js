/**
 * Utilidades de Haptic Feedback para PWA
 * Usa la Vibration API del navegador
 */

/**
 * Vibración corta para feedback de éxito
 */
export const hapticSuccess = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

/**
 * Vibración para error/warning
 */
export const hapticError = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
};

/**
 * Vibración suave para tap/click
 */
export const hapticTap = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

/**
 * Vibración para notificación
 */
export const hapticNotification = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
};

/**
 * Hook para usar haptic feedback
 */
export const useHaptic = () => {
  const isSupported = 'vibrate' in navigator;

  return {
    isSupported,
    success: hapticSuccess,
    error: hapticError,
    tap: hapticTap,
    notification: hapticNotification,
  };
};

export default useHaptic;
