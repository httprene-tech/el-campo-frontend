import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { proyectosAPI } from '../api';
import { STALE_TIMES } from '../utils/constants';

const ProyectoContext = createContext(null);

export const useProyecto = () => {
  const context = useContext(ProyectoContext);
  if (!context) {
    throw new Error('useProyecto debe usarse dentro de un ProyectoProvider');
  }
  return context;
};

// Hook interno para proyectos usando React Query
const useProyectosQuery = () => {
  return useQuery({
    queryKey: ['proyectos'],
    queryFn: async () => {
      const response = await proyectosAPI.getAll();
      const data = response.data.results ?? response.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: STALE_TIMES.NORMAL, // 5 minutos
  });
};

export const ProyectoProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: proyectos = [], isLoading: loading } = useProyectosQuery();
  const [proyectoActivoId, setProyectoActivoId] = useState(null);

  // Derivar proyectoActivo de proyectos
  const proyectoActivo = useMemo(() => {
    if (!proyectos.length) return null;
    // Si hay un ID guardado y existe en la lista, usarlo
    const found = proyectos.find(p => p.id === proyectoActivoId);
    if (found) return found;
    // Si no, usar el primero
    return proyectos[0];
  }, [proyectos, proyectoActivoId]);

  // Autoseleccionar primer proyecto cuando carguen
  useEffect(() => {
    if (proyectos.length > 0 && !proyectoActivoId) {
      setProyectoActivoId(proyectos[0].id);
    }
  }, [proyectos, proyectoActivoId]);

  const seleccionarProyecto = useCallback((proyecto) => {
    setProyectoActivoId(proyecto?.id || null);
  }, []);

  // Refrescar datos del proyecto activo
  const actualizarProyecto = useCallback(async () => {
    if (proyectoActivo) {
      // Invalidar queries de proyectos para obtener datos frescos
      await queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    }
  }, [proyectoActivo, queryClient]);

  // Recargar proyectos (para compatibilidad)
  const cargarProyectos = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['proyectos'] });
  }, [queryClient]);

  const value = useMemo(() => ({
    proyectos,
    proyectoActivo,
    loading,
    cargarProyectos,
    seleccionarProyecto,
    actualizarProyecto,
  }), [proyectos, proyectoActivo, loading, cargarProyectos, seleccionarProyecto, actualizarProyecto]);

  return (
    <ProyectoContext.Provider value={value}>
      {children}
    </ProyectoContext.Provider>
  );
};
