// Utilidades para validación de formularios

/**
 * Valida que un campo no esté vacío
 */
export const required = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Este campo es requerido';
  }
  return null;
};

/**
 * Valida que un número sea positivo
 */
export const positiveNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return null; // Dejar que required maneje esto
  }
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return 'Debe ser un número positivo';
  }
  return null;
};

/**
 * Valida que un número sea mayor o igual a un mínimo
 */
export const minValue = (min) => (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  if (isNaN(num) || num < min) {
    return `Debe ser mayor o igual a ${min}`;
  }
  return null;
};

/**
 * Valida que un número sea menor o igual a un máximo
 */
export const maxValue = (max) => (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  if (isNaN(num) || num > max) {
    return `Debe ser menor o igual a ${max}`;
  }
  return null;
};

/**
 * Valida una fecha
 */
export const validDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }
  return null;
};

/**
 * Valida que una fecha no sea futura
 */
export const notFutureDate = (value) => {
  const dateError = validDate(value);
  if (dateError) return dateError;
  
  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (date > today) {
    return 'La fecha no puede ser futura';
  }
  return null;
};

/**
 * Valida un email
 */
export const email = (value) => {
  if (!value) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Email inválido';
  }
  return null;
};

/**
 * Valida que la suma de valores coincida con un total
 */
export const sumMatches = (total) => (values) => {
  const sum = values.reduce((acc, val) => acc + Number(val || 0), 0);
  if (sum !== Number(total)) {
    return `La suma (${sum}) debe coincidir con el total (${total})`;
  }
  return null;
};
