import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../utils/constants';
import {
  galponesAPI,
  lotesAPI,
  recoleccionesAPI,
  calidadHuevosAPI,
} from '../../api/modules/produccion';

// ============================================================================
// QUERIES: PRODUCCIÓN
// ============================================================================

// Galpones
export const useGalpones = (params = {}) => {
  return useQuery({
    queryKey: ['galpones', params],
    queryFn: () => galponesAPI.getAll(params),
    select: (response) => response.data?.results || response.data || [],
  });
};

export const useGalpon = (id) => {
  return useQuery({
    queryKey: ['galpones', id],
    queryFn: () => galponesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Lotes
export const useLotes = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['lotes', params],
    queryFn: ({ pageParam = 1 }) => 
      lotesAPI.getAll({ ...params, page: pageParam }),
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

export const useLote = (id) => {
  return useQuery({
    queryKey: ['lotes', id],
    queryFn: () => lotesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Recolecciones
export const useRecolecciones = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['recolecciones', params],
    queryFn: ({ pageParam = 1 }) => 
      recoleccionesAPI.getAll({ ...params, page: pageParam }),
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

export const useRecoleccion = (id) => {
  return useQuery({
    queryKey: ['recolecciones', id],
    queryFn: () => recoleccionesAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Calidad de Huevos
export const useCalidadHuevos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['calidad-huevos', params],
    queryFn: ({ pageParam = 1 }) => 
      calidadHuevosAPI.getAll({ ...params, page: pageParam }),
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

export const useCalidadHuevo = (id) => {
  return useQuery({
    queryKey: ['calidad-huevos', id],
    queryFn: () => calidadHuevosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
