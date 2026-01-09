import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  galponesAPI,
  lotesAPI,
  recoleccionesAPI,
  calidadHuevosAPI,
} from '../../api/modules/produccion';

// ============================================================================
// MUTATIONS: PRODUCCIÓN
// ============================================================================

// Galpones
export const useCreateGalpon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => galponesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galpones'] });
    },
  });
};

export const useUpdateGalpon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => galponesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['galpones'] });
      queryClient.invalidateQueries({ queryKey: ['galpones', variables.id] });
    },
  });
};

export const useDeleteGalpon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => galponesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galpones'] });
    },
  });
};

// Lotes
export const useCreateLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => lotesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['galpones'] });
    },
  });
};

export const useUpdateLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => lotesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', variables.id] });
    },
  });
};

export const useDeleteLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => lotesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};

// Recolecciones
export const useCreateRecoleccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => recoleccionesAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recolecciones'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
      }
    },
  });
};

export const useUpdateRecoleccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => recoleccionesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recolecciones'] });
      queryClient.invalidateQueries({ queryKey: ['recolecciones', variables.id] });
    },
  });
};

export const useDeleteRecoleccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => recoleccionesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recolecciones'] });
    },
  });
};

// Calidad de Huevos
export const useCreateCalidadHuevo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => calidadHuevosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calidad-huevos'] });
      queryClient.invalidateQueries({ queryKey: ['recolecciones'] });
    },
  });
};

export const useUpdateCalidadHuevo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => calidadHuevosAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calidad-huevos'] });
      queryClient.invalidateQueries({ queryKey: ['calidad-huevos', variables.id] });
    },
  });
};

export const useDeleteCalidadHuevo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => calidadHuevosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calidad-huevos'] });
    },
  });
};
