import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  proveedoresAlimentoAPI,
  formulasAPI,
  racionesAPI,
  consumosAPI,
} from '../../api/modules/alimentacion';

// ============================================================================
// MUTATIONS: ALIMENTACIÓN
// ============================================================================

// Proveedores de Alimento
export const useCreateProveedorAlimento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => proveedoresAlimentoAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores-alimento'] });
    },
  });
};

export const useUpdateProveedorAlimento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => proveedoresAlimentoAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores-alimento'] });
    },
  });
};

export const useDeleteProveedorAlimento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => proveedoresAlimentoAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores-alimento'] });
    },
  });
};

// Fórmulas
export const useCreateFormula = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => formulasAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });
};

export const useUpdateFormula = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => formulasAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
      queryClient.invalidateQueries({ queryKey: ['formulas', variables.id] });
    },
  });
};

export const useDeleteFormula = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => formulasAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });
};

// Raciones
export const useCreateRacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => racionesAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['raciones'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
      }
    },
  });
};

export const useUpdateRacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => racionesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raciones'] });
    },
  });
};

export const useDeleteRacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => racionesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raciones'] });
    },
  });
};

// Consumos Diarios
export const useCreateConsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => consumosAPI.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumos'] });
      if (variables.lote) {
        queryClient.invalidateQueries({ queryKey: ['lotes', variables.lote] });
      }
      if (variables.material_alimento) {
        queryClient.invalidateQueries({ queryKey: ['materiales'] });
      }
    },
  });
};

export const useUpdateConsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => consumosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumos'] });
    },
  });
};

export const useDeleteConsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => consumosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumos'] });
    },
  });
};
