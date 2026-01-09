import apiClient from '../client';

// ============================================================================
// MÓDULO: INVENTARIO
// Base URL: /api/inventario/
// ============================================================================

// Materiales
export const materialesAPI = {
  getAll: (params = {}) => apiClient.get('/inventario/materiales/', { params }),
  getById: (id) => apiClient.get(`/inventario/materiales/${id}/`),
  create: (data) => apiClient.post('/inventario/materiales/', data),
  update: (id, data) => apiClient.put(`/inventario/materiales/${id}/`, data),
  delete: (id) => apiClient.delete(`/inventario/materiales/${id}/`),
};

// Movimientos de Inventario
export const movimientosAPI = {
  getAll: (params = {}) => apiClient.get('/inventario/movimientos/', { params }),
  getById: (id) => apiClient.get(`/inventario/movimientos/${id}/`),
  create: (data) => apiClient.post('/inventario/movimientos/', data),
  update: (id, data) => apiClient.put(`/inventario/movimientos/${id}/`, data),
  delete: (id) => apiClient.delete(`/inventario/movimientos/${id}/`),
};
