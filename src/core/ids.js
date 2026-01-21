// Generar IDs únicos
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Validar ID
export const isValidId = (id) => typeof id === 'string' || typeof id === 'number';

