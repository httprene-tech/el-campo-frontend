import apiClient from '../client';

// ============================================================================
// MÓDULO: CALENDARIO
// Base URL: /api/calendario/
// ============================================================================

// Tipos de Evento
export const tiposEventoAPI = {
  getAll: (params = {}) => apiClient.get('/calendario/tipos/', { params }),
  getById: (id) => apiClient.get(`/calendario/tipos/${id}/`),
  create: (data) => apiClient.post('/calendario/tipos/', data),
  update: (id, data) => apiClient.put(`/calendario/tipos/${id}/`, data),
  delete: (id) => apiClient.delete(`/calendario/tipos/${id}/`),
};

// Eventos
export const eventosAPI = {
  getAll: (params = {}) => apiClient.get('/calendario/eventos/', { params }),
  getById: (id) => apiClient.get(`/calendario/eventos/${id}/`),
  create: (data) => apiClient.post('/calendario/eventos/', data),
  update: (id, data) => apiClient.put(`/calendario/eventos/${id}/`, data),
  delete: (id) => apiClient.delete(`/calendario/eventos/${id}/`),
};

// Recordatorios
export const recordatoriosAPI = {
  getAll: (params = {}) => apiClient.get('/calendario/recordatorios/', { params }),
  getById: (id) => apiClient.get(`/calendario/recordatorios/${id}/`),
  create: (data) => apiClient.post('/calendario/recordatorios/', data),
  update: (id, data) => apiClient.put(`/calendario/recordatorios/${id}/`, data),
  delete: (id) => apiClient.delete(`/calendario/recordatorios/${id}/`),
};
