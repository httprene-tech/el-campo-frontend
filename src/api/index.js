import apiClient from './apiClient';

// ============================================================================
// AUTENTICACIÓN
// ============================================================================

export const authAPI = {
  login: (username, password) => 
    apiClient.post('/auth/login/', { username, password }),
  cambiarContrasena: (currentPassword, newPassword) =>
    apiClient.post('/auth/cambiar-contrasena/', { 
      current_password: currentPassword, 
      new_password: newPassword 
    }),
};

// ============================================================================
// PROYECTOS
// ============================================================================

export const proyectosAPI = {
  getAll: () => apiClient.get('/proyectos/'),
  getById: (id) => apiClient.get(`/proyectos/${id}/`),
  create: (data) => apiClient.post('/proyectos/', data),
  update: (id, data) => apiClient.put(`/proyectos/${id}/`, data),
  delete: (id) => apiClient.delete(`/proyectos/${id}/`),
  exportarPDF: (id, params = {}) => 
    apiClient.get(`/proyectos/${id}/exportar_pdf/`, { 
      params,
      responseType: 'blob' 
    }),
};

// ============================================================================
// GASTOS
// ============================================================================

export const gastosAPI = {
  getAll: (params = {}) => apiClient.get('/gastos/', { params }),
  getById: (id) => apiClient.get(`/gastos/${id}/`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.post('/gastos/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => apiClient.put(`/gastos/${id}/`, data),
  delete: (id) => apiClient.delete(`/gastos/${id}/`),
  resumenMensual: (proyectoId) => 
    apiClient.get('/gastos/resumen_mensual/', { params: { proyecto: proyectoId } }),
};

// ============================================================================
// CATEGORÍAS
// ============================================================================

export const categoriasAPI = {
  getAll: () => apiClient.get('/categorias/'),
  create: (data) => apiClient.post('/categorias/', data),
};

// ============================================================================
// PROVEEDORES
// ============================================================================

export const proveedoresAPI = {
  getAll: () => apiClient.get('/proveedores/'),
  getById: (id) => apiClient.get(`/proveedores/${id}/`),
  create: (data) => apiClient.post('/proveedores/', data),
  update: (id, data) => apiClient.put(`/proveedores/${id}/`, data),
  delete: (id) => apiClient.delete(`/proveedores/${id}/`),
};

// ============================================================================
// SOCIOS
// ============================================================================

export const sociosAPI = {
  getAll: () => apiClient.get('/socios/'),
  getById: (id) => apiClient.get(`/socios/${id}/`),
  create: (data) => apiClient.post('/socios/', data),
  update: (id, data) => apiClient.put(`/socios/${id}/`, data),
  delete: (id) => apiClient.delete(`/socios/${id}/`),
};

// ============================================================================
// GALERÍA (ÁLBUMES Y FOTOS)
// ============================================================================

export const albumesAPI = {
  getAll: () => apiClient.get('/albumes/'),
  getById: (id) => apiClient.get(`/albumes/${id}/`),
  create: (data) => apiClient.post('/albumes/', data),
  update: (id, data) => apiClient.put(`/albumes/${id}/`, data),
  delete: (id) => apiClient.delete(`/albumes/${id}/`),
};

export const fotosAPI = {
  getAll: (albumId = null) => {
    const params = albumId ? { album: albumId } : {};
    return apiClient.get('/fotos/', { params });
  },
  upload: (albumId, imagen, titulo = '', descripcion = '') => {
    const formData = new FormData();
    formData.append('album', albumId);
    formData.append('imagen', imagen);
    if (titulo) formData.append('titulo', titulo);
    if (descripcion) formData.append('descripcion', descripcion);
    return apiClient.post('/fotos/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => apiClient.delete(`/fotos/${id}/`),
};

// ============================================================================
// DOCUMENTOS
// ============================================================================

export const carpetasAPI = {
  getAll: () => apiClient.get('/carpetas/'),
  getById: (id) => apiClient.get(`/carpetas/${id}/`),
  create: (data) => apiClient.post('/carpetas/', data),
  update: (id, data) => apiClient.put(`/carpetas/${id}/`, data),
  delete: (id) => apiClient.delete(`/carpetas/${id}/`),
};

export const documentosAPI = {
  getAll: (params = {}) => apiClient.get('/documentos/', { params }),
  getById: (id) => apiClient.get(`/documentos/${id}/`),
  upload: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.post('/documentos/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => apiClient.delete(`/documentos/${id}/`),
};

// ============================================================================
// INVENTARIO (MATERIALES)
// ============================================================================

export const materialesAPI = {
  getAll: () => apiClient.get('/materiales/'),
  create: (data) => apiClient.post('/materiales/', data),
  update: (id, data) => apiClient.put(`/materiales/${id}/`, data),
};

export const movimientosAPI = {
  getAll: () => apiClient.get('/inventario-movimientos/'),
  create: (data) => apiClient.post('/inventario-movimientos/', data),
};
