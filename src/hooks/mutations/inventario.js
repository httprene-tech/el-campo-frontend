import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  materialesAPI,
  movimientosAPI,
} from '../../api/modules/inventario';

// ============================================================================
// MUTATIONS: INVENTARIO
// ============================================================================

// Materiales
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => materialesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => materialesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.invalidateQueries({ queryKey: ['materiales', variables.id] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => materialesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
    },
  });
};

// Movimientos
export const useCreateMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => movimientosAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      if (variables.material) {
        queryClient.invalidateQueries({ queryKey: ['materiales', variables.material] });
        queryClient.invalidateQueries({ queryKey: ['materiales'] });
      }
    },
  });
};

export const useUpdateMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => movimientosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
};

export const useDeleteMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => movimientosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
};
