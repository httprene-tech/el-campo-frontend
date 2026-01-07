import React, { createContext, useContext, useState, useEffect } from 'react';
import { proyectosAPI } from '../api';

const ProyectoContext = createContext(null);

export const useProyecto = () => {
  const context = useContext(ProyectoContext);
  if (!context) {
    throw new Error('useProyecto debe usarse dentro de un ProyectoProvider');
  }
  return context;
};

export const ProyectoProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoActivo, setProyectoActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar proyectos al iniciar
  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const response = await proyectosAPI.getAll();
      setProyectos(response.data);
      
      // Si hay proyectos y no hay uno activo, seleccionar el primero
      if (response.data.length > 0 && !proyectoActivo) {
        setProyectoActivo(response.data[0]);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarProyecto = (proyecto) => {
    setProyectoActivo(proyecto);
  };

  const actualizarProyecto = async () => {
    if (proyectoActivo) {
      try {
        const response = await proyectosAPI.getById(proyectoActivo.id);
        setProyectoActivo(response.data);
        
        // Actualizar también en la lista
        setProyectos(prev => 
          prev.map(p => p.id === response.data.id ? response.data : p)
        );
      } catch (error) {
        console.error('Error al actualizar proyecto:', error);
      }
    }
  };

  const value = {
    proyectos,
    proyectoActivo,
    loading,
    cargarProyectos,
    seleccionarProyecto,
    actualizarProyecto,
  };

  return (
    <ProyectoContext.Provider value={value}>
      {children}
    </ProyectoContext.Provider>
  );
};
