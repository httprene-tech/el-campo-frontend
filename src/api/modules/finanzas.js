import apiClient from '../client';

// ============================================================================
// MÓDULO: FINANZAS
// Base URL: /api/finanzas/
// ============================================================================

// Autenticación (está en finanzas según el backend)
export const authAPI = {
  login: (username, password) => 
    apiClient.post('/finanzas/auth/login/', { username, password }),
  cambiarContrasena: (currentPassword, newPassword) =>
    apiClient.post('/finanzas/auth/cambiar-contrasena/', { 
      current_password: currentPassword, 
      new_password: newPassword 
    }),
};

// Proyectos
export const proyectosAPI = {
  getAll: (params = {}) => apiClient.get('/finanzas/proyectos/', { params }),
  getById: (id) => apiClient.get(`/finanzas/proyectos/${id}/`),
  create: (data) => apiClient.post('/finanzas/proyectos/', data),
  update: (id, data) => apiClient.put(`/finanzas/proyectos/${id}/`, data),
  delete: (id) => apiClient.delete(`/finanzas/proyectos/${id}/`),
  exportarPDF: (id, params = {}) => 
    apiClient.get(`/finanzas/proyectos/${id}/exportar_pdf/`, { 
      params,
      responseType: 'blob' 
    }),
};

// Gastos
export const gastosAPI = {
  getAll: (params = {}) => apiClient.get('/finanzas/gastos/', { params }),
  getById: (id) => apiClient.get(`/finanzas/gastos/${id}/`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    // No especificar Content-Type manualmente - axios lo configura automáticamente
    // con el boundary correcto cuando se usa FormData
    return apiClient.post('/finanzas/gastos/', formData);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.put(`/finanzas/gastos/${id}/`, formData);
  },
  delete: (id) => apiClient.delete(`/finanzas/gastos/${id}/`),
  resumenMensual: (proyectoId) => 
    apiClient.get('/finanzas/gastos/resumen_mensual/', { params: { proyecto: proyectoId } }),
  resumenPorCategoria: (proyectoId) => 
    apiClient.get('/finanzas/gastos/resumen_por_categoria/', { params: { proyecto: proyectoId } }),
};

// Comprobantes (fotos de recibos de gastos)
export const comprobantesAPI = {
  getAll: (gastoId) => apiClient.get('/finanzas/comprobantes/', { params: { gasto: gastoId } }),
  upload: (gastoId, imagen) => {
    const formData = new FormData();
    formData.append('gasto', gastoId);
    formData.append('imagen', imagen);
    return apiClient.post('/finanzas/comprobantes/', formData);
  },
  delete: (id) => apiClient.delete(`/finanzas/comprobantes/${id}/`),
};

// Categorías
export const categoriasAPI = {
  getAll: () => apiClient.get('/finanzas/categorias/'),
  create: (data) => apiClient.post('/finanzas/categorias/', data),
};

// Proveedores
export const proveedoresAPI = {
  getAll: () => apiClient.get('/finanzas/proveedores/'),
  getById: (id) => apiClient.get(`/finanzas/proveedores/${id}/`),
  create: (data) => apiClient.post('/finanzas/proveedores/', data),
  update: (id, data) => apiClient.put(`/finanzas/proveedores/${id}/`, data),
  delete: (id) => apiClient.delete(`/finanzas/proveedores/${id}/`),
};

// Socios
export const sociosAPI = {
  getAll: () => apiClient.get('/finanzas/socios/'),
  getById: (id) => apiClient.get(`/finanzas/socios/${id}/`),
  create: (data) => apiClient.post('/finanzas/socios/', data),
  update: (id, data) => apiClient.put(`/finanzas/socios/${id}/`, data),
  delete: (id) => apiClient.delete(`/finanzas/socios/${id}/`),
};

// Galería (Álbumes y Fotos)
export const albumesAPI = {
  getAll: () => apiClient.get('/finanzas/albumes/'),
  getById: (id) => apiClient.get(`/finanzas/albumes/${id}/`),
  create: (data) => apiClient.post('/finanzas/albumes/', data),
  update: (id, data) => apiClient.put(`/finanzas/albumes/${id}/`, data),
  delete: (id) => apiClient.delete(`/finanzas/albumes/${id}/`),
};

export const fotosAPI = {
  getAll: (albumId = null) => {
    const params = albumId ? { album: albumId } : {};
    return apiClient.get('/finanzas/fotos/', { params });
  },
  upload: (albumId, imagen, titulo = '', descripcion = '') => {
    const formData = new FormData();
    formData.append('album', albumId);
    formData.append('imagen', imagen);
    if (titulo) formData.append('titulo', titulo);
    if (descripcion) formData.append('descripcion', descripcion);
    return apiClient.post('/finanzas/fotos/', formData);
  },
  delete: (id) => apiClient.delete(`/finanzas/fotos/${id}/`),
};

// Documentos
export const carpetasAPI = {
  getAll: () => apiClient.get('/finanzas/carpetas/'),
  getById: (id) => apiClient.get(`/finanzas/carpetas/${id}/`),
  create: (data) => apiClient.post('/finanzas/carpetas/', data),
  update: (id, data) => apiClient.put(`/finanzas/carpetas/${id}/`, data),
  delete: (id) => apiClient.delete(`/finanzas/carpetas/${id}/`),
};

export const documentosAPI = {
  getAll: (params = {}) => apiClient.get('/finanzas/documentos/', { params }),
  getById: (id) => apiClient.get(`/finanzas/documentos/${id}/`),
  upload: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.post('/finanzas/documentos/', formData);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.put(`/finanzas/documentos/${id}/`, formData);
  },
  delete: (id) => apiClient.delete(`/finanzas/documentos/${id}/`),
};
