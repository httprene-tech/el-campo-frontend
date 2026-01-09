import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vacunacionesAPI,
  tratamientosAPI,
  mortalidadesAPI,
  historialesAPI,
} from '../../api/modules/salud';

// ============================================================================
// MUTATIONS: SALUD
// ============================================================================

// Vacunaciones
export const useCreateVacunacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vacunacionesAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacunaciones'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
        queryClient.invalidateQueries({ queryKey: ['historiales'] });
      }
    },
  });
};

export const useUpdateVacunacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => vacunacionesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacunaciones'] });
    },
  });
};

export const useDeleteVacunacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => vacunacionesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacunaciones'] });
    },
  });
};

// Tratamientos
export const useCreateTratamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tratamientosAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tratamientos'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
        queryClient.invalidateQueries({ queryKey: ['historiales'] });
      }
    },
  });
};

export const useUpdateTratamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tratamientosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tratamientos'] });
    },
  });
};

export const useDeleteTratamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tratamientosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tratamientos'] });
    },
  });
};

// Mortalidad
export const useCreateMortalidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => mortalidadesAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mortalidades'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
        queryClient.invalidateQueries({ queryKey: ['historiales'] });
      }
    },
  });
};

export const useUpdateMortalidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => mortalidadesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortalidades'] });
    },
  });
};

export const useDeleteMortalidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => mortalidadesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortalidades'] });
    },
  });
};

// Historiales
export const useCreateHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => historialesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
    },
  });
};

export const useUpdateHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => historialesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      queryClient.invalidateQueries({ queryKey: ['historiales', variables.id] });
    },
  });
};
