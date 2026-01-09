import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../utils/constants';
import {
  materialesAPI,
  movimientosAPI,
} from '../../api/modules/inventario';

// ============================================================================
// QUERIES: INVENTARIO
// ============================================================================

// Materiales
export const useMateriales = (params = {}) => {
  return useQuery({
    queryKey: ['materiales', params],
    queryFn: () => materialesAPI.getAll(params),
    select: (response) => response.data?.results || response.data || [],
  });
};

export const useMaterial = (id) => {
  return useQuery({
    queryKey: ['materiales', id],
    queryFn: () => materialesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Movimientos
export const useMovimientos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['movimientos', params],
    queryFn: ({ pageParam = 1 }) => 
      movimientosAPI.getAll({ ...params, page: pageParam }),
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

export const useMovimiento = (id) => {
  return useQuery({
    queryKey: ['movimientos', id],
    queryFn: () => movimientosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
