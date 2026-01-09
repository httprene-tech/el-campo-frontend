import apiClient from '../client';

// ============================================================================
// MÓDULO: ALIMENTACIÓN
// Base URL: /api/alimentacion/
// ============================================================================

// Proveedores de Alimento
export const proveedoresAlimentoAPI = {
  getAll: (params = {}) => apiClient.get('/alimentacion/proveedores/', { params }),
  getById: (id) => apiClient.get(`/alimentacion/proveedores/${id}/`),
  create: (data) => apiClient.post('/alimentacion/proveedores/', data),
  update: (id, data) => apiClient.put(`/alimentacion/proveedores/${id}/`, data),
  delete: (id) => apiClient.delete(`/alimentacion/proveedores/${id}/`),
};

// Fórmulas de Alimento
export const formulasAPI = {
  getAll: (params = {}) => apiClient.get('/alimentacion/formulas/', { params }),
  getById: (id) => apiClient.get(`/alimentacion/formulas/${id}/`),
  create: (data) => apiClient.post('/alimentacion/formulas/', data),
  update: (id, data) => apiClient.put(`/alimentacion/formulas/${id}/`, data),
  delete: (id) => apiClient.delete(`/alimentacion/formulas/${id}/`),
};

// Raciones
export const racionesAPI = {
  getAll: (params = {}) => apiClient.get('/alimentacion/raciones/', { params }),
  getById: (id) => apiClient.get(`/alimentacion/raciones/${id}/`),
  create: (data) => apiClient.post('/alimentacion/raciones/', data),
  update: (id, data) => apiClient.put(`/alimentacion/raciones/${id}/`, data),
  delete: (id) => apiClient.delete(`/alimentacion/raciones/${id}/`),
};

// Consumos Diarios
export const consumosAPI = {
  getAll: (params = {}) => apiClient.get('/alimentacion/consumos/', { params }),
  getById: (id) => apiClient.get(`/alimentacion/consumos/${id}/`),
  create: (data) => apiClient.post('/alimentacion/consumos/', data),
  update: (id, data) => apiClient.put(`/alimentacion/consumos/${id}/`, data),
  delete: (id) => apiClient.delete(`/alimentacion/consumos/${id}/`),
};
