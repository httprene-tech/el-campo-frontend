import apiClient from '../client';

// ============================================================================
// MÓDULO: PRODUCCIÓN
// Base URL: /api/produccion/
// ============================================================================

// Galpones
export const galponesAPI = {
  getAll: (params = {}) => apiClient.get('/produccion/galpones/', { params }),
  getById: (id) => apiClient.get(`/produccion/galpones/${id}/`),
  create: (data) => apiClient.post('/produccion/galpones/', data),
  update: (id, data) => apiClient.put(`/produccion/galpones/${id}/`, data),
  delete: (id) => apiClient.delete(`/produccion/galpones/${id}/`),
};

// Lotes
export const lotesAPI = {
  getAll: (params = {}) => apiClient.get('/produccion/lotes/', { params }),
  getById: (id) => apiClient.get(`/produccion/lotes/${id}/`),
  create: (data) => apiClient.post('/produccion/lotes/', data),
  update: (id, data) => apiClient.put(`/produccion/lotes/${id}/`, data),
  delete: (id) => apiClient.delete(`/produccion/lotes/${id}/`),
};

// Recolecciones
export const recoleccionesAPI = {
  getAll: (params = {}) => apiClient.get('/produccion/recolecciones/', { params }),
  getById: (id) => apiClient.get(`/produccion/recolecciones/${id}/`),
  create: (data) => apiClient.post('/produccion/recolecciones/', data),
  update: (id, data) => apiClient.put(`/produccion/recolecciones/${id}/`, data),
  delete: (id) => apiClient.delete(`/produccion/recolecciones/${id}/`),
};

// Calidad de Huevos
export const calidadHuevosAPI = {
  getAll: (params = {}) => apiClient.get('/produccion/calidad-huevos/', { params }),
  getById: (id) => apiClient.get(`/produccion/calidad-huevos/${id}/`),
  create: (data) => apiClient.post('/produccion/calidad-huevos/', data),
  update: (id, data) => apiClient.put(`/produccion/calidad-huevos/${id}/`, data),
  delete: (id) => apiClient.delete(`/produccion/calidad-huevos/${id}/`),
};
