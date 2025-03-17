/**
 * Utility functions for transforming data between frontend and backend formats
 */

/**
 * Transforms snake_case object keys to camelCase
 * @param {Object} obj - Object with snake_case keys
 * @returns {Object} Object with camelCase keys
 */
export const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

/**
 * Transforms camelCase object keys to snake_case
 * @param {Object} obj - Object with camelCase keys
 * @returns {Object} Object with snake_case keys
 */
export const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

/**
 * Transforms product data from backend to frontend format
 * @param {Object} product - Product data from backend
 * @returns {Object} Transformed product data for frontend
 */
export const transformProductFromBackend = (product) => {
  if (!product) return null;
  
  return {
    id: product.id,
    name: product.name,
    nameEn: product.name_en,
    nameRu: product.name_ru,
    nameDe: product.name_de,
    unit: product.unit,
    // Using ID as a fallback for code to maintain compatibility
    code: product.id.toString(),
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
};

/**
 * Transforms product data from frontend to backend format
 * @param {Object} product - Product data from frontend
 * @returns {Object} Transformed product data for backend
 */
export const transformProductToBackend = (product) => {
  // Remove code field as it's not in the backend
  const { code, ...rest } = product;
  
  return {
    name: rest.name,
    name_en: rest.nameEn,
    name_ru: rest.nameRu,
    name_de: rest.nameDe,
    unit: rest.unit
  };
};
