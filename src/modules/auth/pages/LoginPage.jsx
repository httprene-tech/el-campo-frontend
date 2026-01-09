import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Input, Button } from '../../../components/common';
import { User, Lock, Egg } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Floating eggs decoration */}
      <div className="absolute top-20 right-20 opacity-20">
        <Egg className="w-24 h-24 text-emerald-300 animate-pulse-soft" />
      </div>
      <div className="absolute bottom-32 left-16 opacity-10">
        <Egg className="w-16 h-16 text-teal-300 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-300/50 transform hover:scale-105 transition-transform">
              <Egg className="w-12 h-12 text-white" />
            </div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 rounded-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">El Campo</h1>
          <p className="text-emerald-600 font-medium mt-1">Granja Avícola</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-white/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              icon={User}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              icon={Lock}
              required
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-scale-in">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
              className="!bg-gradient-to-r !from-emerald-500 !to-teal-600 hover:!from-emerald-600 hover:!to-teal-700"
            >
              Ingresar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              ¿Problemas para acceder? Contacta al administrador
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Sistema de Control Financiero y Gestión
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
