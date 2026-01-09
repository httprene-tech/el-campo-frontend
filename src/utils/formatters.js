// Utilidades para formateo de datos

/**
 * Formatea un número como moneda boliviana
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 Bs';
  return `${Number(amount).toLocaleString('es-BO')} Bs`;
};

/**
 * Formatea una fecha en formato español
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};

/**
 * Formatea una fecha corta (DD/MM/YYYY)
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-BO');
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toLocaleString('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Calcula la edad en días desde una fecha
 */
export const calculateAgeInDays = (startDate) => {
  if (!startDate) return 0;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const today = new Date();
  const diffTime = Math.abs(today - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Trunca un texto a una longitud máxima
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Extracts array data from API response that may be paginated (DRF format)
 * Handles: plain arrays, { results: [] }, or any object with results property
 */
export const extractApiData = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (responseData.results && Array.isArray(responseData.results)) return responseData.results;
  return [];
};
