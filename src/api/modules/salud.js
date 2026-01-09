import apiClient from '../client';

// ============================================================================
// MÓDULO: SALUD
// Base URL: /api/salud/
// ============================================================================

// Vacunaciones
export const vacunacionesAPI = {
  getAll: (params = {}) => apiClient.get('/salud/vacunaciones/', { params }),
  getById: (id) => apiClient.get(`/salud/vacunaciones/${id}/`),
  create: (data) => apiClient.post('/salud/vacunaciones/', data),
  update: (id, data) => apiClient.put(`/salud/vacunaciones/${id}/`, data),
  delete: (id) => apiClient.delete(`/salud/vacunaciones/${id}/`),
};

// Tratamientos
export const tratamientosAPI = {
  getAll: (params = {}) => apiClient.get('/salud/tratamientos/', { params }),
  getById: (id) => apiClient.get(`/salud/tratamientos/${id}/`),
  create: (data) => apiClient.post('/salud/tratamientos/', data),
  update: (id, data) => apiClient.put(`/salud/tratamientos/${id}/`, data),
  delete: (id) => apiClient.delete(`/salud/tratamientos/${id}/`),
};

// Mortalidad
export const mortalidadesAPI = {
  getAll: (params = {}) => apiClient.get('/salud/mortalidades/', { params }),
  getById: (id) => apiClient.get(`/salud/mortalidades/${id}/`),
  create: (data) => apiClient.post('/salud/mortalidades/', data),
  update: (id, data) => apiClient.put(`/salud/mortalidades/${id}/`, data),
  delete: (id) => apiClient.delete(`/salud/mortalidades/${id}/`),
};

// Historial Veterinario
export const historialesAPI = {
  getAll: (params = {}) => apiClient.get('/salud/historiales/', { params }),
  getById: (id) => apiClient.get(`/salud/historiales/${id}/`),
  create: (data) => apiClient.post('/salud/historiales/', data),
  update: (id, data) => apiClient.put(`/salud/historiales/${id}/`, data),
  delete: (id) => apiClient.delete(`/salud/historiales/${id}/`),
};
