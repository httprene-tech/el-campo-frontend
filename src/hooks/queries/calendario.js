import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE, STALE_TIMES } from '../../utils/constants';
import {
  tiposEventoAPI,
  eventosAPI,
  recordatoriosAPI,
} from '../../api/modules/calendario';

// ============================================================================
// QUERIES: CALENDARIO
// ============================================================================

// Tipos de Evento - Datos estáticos, staleTime muy largo
export const useTiposEvento = () => {
  return useQuery({
    queryKey: ['tipos-evento'],
    queryFn: () => tiposEventoAPI.getAll(),
    select: (response) => response.data?.results || response.data || [],
    staleTime: STALE_TIMES.STATIC, // 30 minutos
  });
};

export const useTipoEvento = (id) => {
  return useQuery({
    queryKey: ['tipos-evento', id],
    queryFn: () => tiposEventoAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Eventos
export const useEventos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['eventos', params],
    queryFn: ({ pageParam = 1 }) => 
      eventosAPI.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const results = lastPage.data?.results || lastPage.data || [];
      if (Array.isArray(results) && results.length === PAGE_SIZE) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map(page => page.data?.results || page.data || []),
      pageParams: data.pageParams,
    }),
  });
};

export const useEvento = (id) => {
  return useQuery({
    queryKey: ['eventos', id],
    queryFn: () => eventosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Recordatorios
export const useRecordatorios = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['recordatorios', params],
    queryFn: ({ pageParam = 1 }) => 
      recordatoriosAPI.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const results = lastPage.data?.results || lastPage.data || [];
      if (Array.isArray(results) && results.length === PAGE_SIZE) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map(page => page.data?.results || page.data || []),
      pageParams: data.pageParams,
    }),
  });
};
