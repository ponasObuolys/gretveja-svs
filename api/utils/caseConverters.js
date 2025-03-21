/**
 * Utility functions for converting between snake_case and camelCase
 */

/**
 * Converts an object's keys from snake_case to camelCase
 * @param {Object} obj - The object with snake_case keys
 * @returns {Object} - A new object with camelCase keys
 */
const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const result = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // If value is an object or array, recursively convert its keys
    if (obj[key] && typeof obj[key] === 'object') {
      result[camelKey] = Array.isArray(obj[key])
        ? obj[key].map(item => typeof item === 'object' ? snakeToCamel(item) : item)
        : snakeToCamel(obj[key]);
    } else {
      result[camelKey] = obj[key];
    }
  });
  
  return result;
};

/**
 * Converts an object's keys from camelCase to snake_case
 * @param {Object} obj - The object with camelCase keys
 * @returns {Object} - A new object with snake_case keys
 */
const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const result = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
    
    // If value is an object or array, recursively convert its keys
    if (obj[key] && typeof obj[key] === 'object') {
      result[snakeKey] = Array.isArray(obj[key])
        ? obj[key].map(item => typeof item === 'object' ? camelToSnake(item) : item)
        : camelToSnake(obj[key]);
    } else {
      result[snakeKey] = obj[key];
    }
  });
  
  return result;
};

module.exports = {
  snakeToCamel,
  camelToSnake
};
