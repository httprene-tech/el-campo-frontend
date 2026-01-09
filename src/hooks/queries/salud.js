import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../utils/constants';
import {
  vacunacionesAPI,
  tratamientosAPI,
  mortalidadesAPI,
  historialesAPI,
} from '../../api/modules/salud';

// ============================================================================
// QUERIES: SALUD
// ============================================================================

// Vacunaciones
export const useVacunaciones = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['vacunaciones', params],
    queryFn: ({ pageParam = 1 }) => 
      vacunacionesAPI.getAll({ ...params, page: pageParam }),
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

export const useVacunacion = (id) => {
  return useQuery({
    queryKey: ['vacunaciones', id],
    queryFn: () => vacunacionesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Tratamientos
export const useTratamientos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['tratamientos', params],
    queryFn: ({ pageParam = 1 }) => 
      tratamientosAPI.getAll({ ...params, page: pageParam }),
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

export const useTratamiento = (id) => {
  return useQuery({
    queryKey: ['tratamientos', id],
    queryFn: () => tratamientosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Mortalidad
export const useMortalidades = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['mortalidades', params],
    queryFn: ({ pageParam = 1 }) => 
      mortalidadesAPI.getAll({ ...params, page: pageParam }),
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

export const useMortalidad = (id) => {
  return useQuery({
    queryKey: ['mortalidades', id],
    queryFn: () => mortalidadesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Historiales Veterinarios
export const useHistoriales = (params = {}) => {
  return useQuery({
    queryKey: ['historiales', params],
    queryFn: () => historialesAPI.getAll(params),
    select: (response) => response.data?.results || response.data || [],
  });
};

export const useHistorial = (id) => {
  return useQuery({
    queryKey: ['historiales', id],
    queryFn: () => historialesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
