import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('android'); // android or ios

  useEffect(() => {
    // 1. Verificar si ya está en modo standalone (ya instalada)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return;

    // 2. Verificar si el usuario ya descartó el banner recientemente
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const now = new Date().getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - parseInt(dismissedAt) < sevenDays) return;
    }

    // 3. Detectar plataforma
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIos ? 'ios' : 'android');

    // 4. Manejar evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Solo mostrar en móviles o tablets
      if (window.innerWidth < 1024) {
        setShowBanner(true);
      }
    };

    // 5. Para iOS, mostrar después de unos segundos (ya que no hay evento)
    if (isIos && window.innerWidth < 1024) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', new Date().getTime().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-area-inset-bottom mb-4 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-md border border-emerald-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-md mx-auto ring-1 ring-black/5">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0">
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight">Instalar El Campo</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
            {platform === 'ios' 
              ? 'Toca Compartir y luego "Agregar a inicio"' 
              : 'Acceso rápido y mejor experiencia.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {platform === 'android' ? (
            <button
              onClick={handleInstall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95"
            >
              Instalar
            </button>
          ) : (
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Share className="w-5 h-5 text-emerald-600" />
            </div>
          )}
          
          <button 
            onClick={handleDismiss}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
