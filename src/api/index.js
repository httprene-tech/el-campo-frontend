// Exportaciones centralizadas de todos los módulos API
// Mantener compatibilidad con código existente

// Módulos organizados
export * from './modules/finanzas';
export * from './modules/produccion';
export * from './modules/alimentacion';
export * from './modules/salud';
export * from './modules/inventario';
export * from './modules/calendario';

// Cliente base
export { default as apiClient } from './client';

// Mantener apiClient.js para compatibilidad temporal
export { default } from './client';
