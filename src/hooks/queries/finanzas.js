import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE, STALE_TIMES } from '../../utils/constants';
import {
  proyectosAPI,
  gastosAPI,
  categoriasAPI,
  proveedoresAPI,
  sociosAPI,
  albumesAPI,
  fotosAPI,
  carpetasAPI,
  documentosAPI,
} from '../../api/modules/finanzas';

// ============================================================================
// QUERIES: FINANZAS
// ============================================================================

// Proyectos
export const useProyectos = (params = {}) => {
  return useQuery({
    queryKey: ['proyectos', params],
    queryFn: () => proyectosAPI.getAll(params),
    select: (response) => response.data,
  });
};

export const useProyecto = (id) => {
  return useQuery({
    queryKey: ['proyectos', id],
    queryFn: () => proyectosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Gastos
export const useGastos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['gastos', params],
    queryFn: ({ pageParam = 1 }) => 
      gastosAPI.getAll({ ...params, page: pageParam }),
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

export const useGasto = (id) => {
  return useQuery({
    queryKey: ['gastos', id],
    queryFn: () => gastosAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useResumenMensualGastos = (proyectoId) => {
  return useQuery({
    queryKey: ['gastos', 'resumen-mensual', proyectoId],
    queryFn: () => gastosAPI.resumenMensual(proyectoId),
    select: (response) => response.data,
    enabled: !!proyectoId,
  });
};

export const useResumenPorCategoria = (proyectoId) => {
  return useQuery({
    queryKey: ['gastos', 'resumen-por-categoria', proyectoId],
    queryFn: () => gastosAPI.resumenPorCategoria(proyectoId),
    select: (response) => response.data,
    enabled: !!proyectoId,
  });
};

// Categorías - Datos estáticos, staleTime largo
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriasAPI.getAll(),
    select: (response) => response.data,
    staleTime: STALE_TIMES.CATALOG, // 10 minutos
  });
};

// Proveedores - Datos de catálogo, staleTime medio-largo
export const useProveedores = () => {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: () => proveedoresAPI.getAll(),
    select: (response) => response.data,
    staleTime: STALE_TIMES.CATALOG, // 10 minutos
  });
};

export const useProveedor = (id) => {
  return useQuery({
    queryKey: ['proveedores', id],
    queryFn: () => proveedoresAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Socios - Datos de catálogo
export const useSocios = () => {
  return useQuery({
    queryKey: ['socios'],
    queryFn: () => sociosAPI.getAll(),
    select: (response) => response.data,
    staleTime: STALE_TIMES.CATALOG, // 10 minutos
  });
};

// Galería
export const useAlbumes = () => {
  return useQuery({
    queryKey: ['albumes'],
    queryFn: () => albumesAPI.getAll(),
    select: (response) => response.data,
    staleTime: STALE_TIMES.NORMAL, // 5 minutos
  });
};

export const useFotos = (albumId = null) => {
  return useQuery({
    queryKey: ['fotos', albumId],
    queryFn: () => fotosAPI.getAll(albumId),
    select: (response) => response.data,
  });
};

// Documentos
export const useCarpetas = () => {
  return useQuery({
    queryKey: ['carpetas'],
    queryFn: () => carpetasAPI.getAll(),
    select: (response) => response.data,
    staleTime: STALE_TIMES.NORMAL, // 5 minutos
  });
};

export const useDocumentos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['documentos', params],
    queryFn: ({ pageParam = 1 }) => 
      documentosAPI.getAll({ ...params, page: pageParam }),
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
