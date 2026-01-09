import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  tiposEventoAPI,
  eventosAPI,
  recordatoriosAPI,
} from '../../api/modules/calendario';

// ============================================================================
// MUTATIONS: CALENDARIO
// ============================================================================

// Tipos de Evento
export const useCreateTipoEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tiposEventoAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};

export const useUpdateTipoEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tiposEventoAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};

export const useDeleteTipoEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tiposEventoAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};

// Eventos
export const useCreateEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    },
  });
};

export const useUpdateEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => eventosAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      queryClient.invalidateQueries({ queryKey: ['eventos', variables.id] });
    },
  });
};

export const useDeleteEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => eventosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    },
  });
};

// Recordatorios
export const useCreateRecordatorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => recordatoriosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordatorios'] });
    },
  });
};

export const useUpdateRecordatorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => recordatoriosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordatorios'] });
    },
  });
};

export const useDeleteRecordatorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => recordatoriosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordatorios'] });
    },
  });
};
