import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../utils/constants';
import {
  proveedoresAlimentoAPI,
  formulasAPI,
  racionesAPI,
  consumosAPI,
} from '../../api/modules/alimentacion';

// ============================================================================
// QUERIES: ALIMENTACIÓN
// ============================================================================

// Proveedores de Alimento
export const useProveedoresAlimento = () => {
  return useQuery({
    queryKey: ['proveedores-alimento'],
    queryFn: () => proveedoresAlimentoAPI.getAll(),
    select: (response) => response.data?.results || response.data || [],
  });
};

// Fórmulas
export const useFormulas = (params = {}) => {
  return useQuery({
    queryKey: ['formulas', params],
    queryFn: () => formulasAPI.getAll(params),
    select: (response) => response.data?.results || response.data || [],
  });
};

export const useFormula = (id) => {
  return useQuery({
    queryKey: ['formulas', id],
    queryFn: () => formulasAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Raciones
export const useRaciones = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['raciones', params],
    queryFn: ({ pageParam = 1 }) => 
      racionesAPI.getAll({ ...params, page: pageParam }),
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

export const useRacion = (id) => {
  return useQuery({
    queryKey: ['raciones', id],
    queryFn: () => racionesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Consumos Diarios
export const useConsumos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['consumos', params],
    queryFn: ({ pageParam = 1 }) => 
      consumosAPI.getAll({ ...params, page: pageParam }),
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

export const useConsumo = (id) => {
  return useQuery({
    queryKey: ['consumos', id],
    queryFn: () => consumosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
