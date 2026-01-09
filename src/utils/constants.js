// Constantes compartidas de la aplicación

// Paginación (alineado con backend)
export const PAGE_SIZE = 20;

// Estados de lotes
export const ESTADOS_LOTE = {
  CRECIMIENTO: 'CRECIMIENTO',
  PRODUCCION: 'PRODUCCION',
  MUDAS: 'MUDAS',
  FINALIZADO: 'FINALIZADO',
};

// Tipos de defectos de huevos
export const TIPOS_DEFECTO = {
  NINGUNO: 'NINGUNO',
  CASCARON_DEBIL: 'CASCARON_DEBIL',
  CASCARON_ROTO: 'CASCARON_ROTO',
  SUCIO: 'SUCIO',
  FORMA_IRREGULAR: 'FORMA_IRREGULAR',
  TAMAÑO_PEQUENO: 'TAMAÑO_PEQUENO',
  OTRO: 'OTRO',
};

// Unidades de medida
export const UNIDADES_MEDIDA = [
  { value: 'BOLSA', label: 'Bolsa' },
  { value: 'PIEZA', label: 'Pieza / Unidad' },
  { value: 'METRO_CUBICO', label: 'Metro Cúbico' },
  { value: 'KILO', label: 'Kilogramo' },
  { value: 'GLOBAL', label: 'Global' },
];

// Tipos de movimiento de inventario
export const TIPOS_MOVIMIENTO = {
  ENTRADA: 'ENTRADA',
  SALIDA: 'SALIDA',
};

// Colores para gráficos
export const CHART_COLORS = [
  '#6b7280', '#9ca3af', '#d1d5db', 
  '#e5e7eb', '#f3f4f6', '#f9fafb',
  '#059669', '#10b981', '#34d399',
];

// Configuración de React Query
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false, // Importante para PWA
  retry: 1,
};
