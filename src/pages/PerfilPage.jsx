import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { Card, Button, Input, Toast, Modal } from '../components/common';
import {
  User,
  Lock,
  LogOut,
  Key,
  Fingerprint,
  CheckCircle,
} from 'lucide-react';

const PerfilPage = () => {
  const { user, logout } = useAuth();
  const [modalContrasena, setModalContrasena] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (passwords.new.length < 4) {
      showToast('La contraseña debe tener al menos 4 caracteres', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await authAPI.cambiarContrasena(passwords.current, passwords.new);
      showToast('Contraseña cambiada correctamente', 'success');
      setModalContrasena(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al cambiar contraseña';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Verificar si el navegador soporta biometría (WebAuthn)
  const soportaBiometria = typeof PublicKeyCredential !== 'undefined';

  const configurarBiometria = async () => {
    if (!soportaBiometria) {
      showToast('Tu dispositivo no soporta autenticación biométrica', 'error');
      return;
    }
    
    // WebAuthn es complejo y requiere backend configurado
    // Por ahora solo informamos
    showToast('Próximamente: Login con huella digital', 'info');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500">Configuración de tu cuenta</p>
      </div>

      {/* Info del usuario */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.first_name?.[0] || user?.username?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.first_name || user?.username}
            </h2>
            <p className="text-gray-500">@{user?.username}</p>
            {user?.perfil_socio?.rol && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {user.perfil_socio.rol}
              </span>
            )}
            {user?.is_superuser && (
              <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                Superusuario
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Opciones */}
      <Card padding="none">
        <div className="divide-y divide-gray-100">
          {/* Cambiar contraseña */}
          <button
            onClick={() => setModalContrasena(true)}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Cambiar contraseña</p>
              <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
            </div>
          </button>

          {/* Login con huella (solo móvil) */}
          {soportaBiometria && (
            <button
              onClick={configurarBiometria}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="p-2 bg-green-50 rounded-lg">
                <Fingerprint className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Login con huella</p>
                <p className="text-sm text-gray-500">Accede más rápido con biometría</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Próximamente</span>
            </button>
          )}

          {/* Cerrar sesión */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left text-red-600"
          >
            <div className="p-2 bg-red-100 rounded-lg">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Cerrar sesión</p>
              <p className="text-sm text-red-400">Salir de tu cuenta</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Info de la app */}
      <div className="text-center text-sm text-gray-400">
        <p>El Campo - Granja Avícola</p>
        <p>Versión 1.0.0</p>
      </div>

      {/* Modal Cambiar Contraseña */}
      <Modal
        isOpen={modalContrasena}
        onClose={() => setModalContrasena(false)}
        title="Cambiar Contraseña"
        size="sm"
      >
        <form onSubmit={handleCambiarContrasena} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            icon={Lock}
            required
          />
          
          <Input
            label="Nueva contraseña"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            icon={Key}
            required
          />
          
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            icon={CheckCircle}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setModalContrasena(false)} 
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Cambiar
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default PerfilPage;
