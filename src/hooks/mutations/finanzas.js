import { useMutation, useQueryClient } from '@tanstack/react-query';
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
// MUTATIONS: FINANZAS
// ============================================================================

// Proyectos
export const useCreateProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => proyectosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};

export const useUpdateProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => proyectosAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      queryClient.invalidateQueries({ queryKey: ['proyectos', variables.id] });
    },
  });
};

export const useDeleteProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => proyectosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};

// Gastos
export const useCreateGasto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => gastosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['gastos', 'resumen-mensual'] });
    },
  });
};

export const useUpdateGasto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => gastosAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['gastos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['gastos', 'resumen-mensual'] });
    },
  });
};

export const useDeleteGasto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => gastosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['gastos', 'resumen-mensual'] });
    },
  });
};

// Categorías
export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => categoriasAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

// Proveedores
export const useCreateProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => proveedoresAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => proveedoresAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      queryClient.invalidateQueries({ queryKey: ['proveedores', variables.id] });
    },
  });
};

export const useDeleteProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => proveedoresAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};

// Socios
export const useCreateSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => sociosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
};

export const useUpdateSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => sociosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
};

export const useDeleteSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sociosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
};

// Galería
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => albumesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albumes'] });
    },
  });
};

export const useUploadFoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, imagen, titulo, descripcion }) => 
      fotosAPI.upload(albumId, imagen, titulo, descripcion),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fotos', variables.albumId] });
      queryClient.invalidateQueries({ queryKey: ['fotos', null] });
    },
  });
};

export const useDeleteFoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fotosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fotos'] });
      queryClient.invalidateQueries({ queryKey: ['albumes'] });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => albumesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albumes'] });
      queryClient.invalidateQueries({ queryKey: ['fotos'] });
    },
  });
};

// Documentos
export const useCreateCarpeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => carpetasAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carpetas'] });
    },
  });
};

export const useDeleteCarpeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => carpetasAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carpetas'] });
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });
};

export const useUploadDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => documentosAPI.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });
};

export const useDeleteDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });
};
