/**
 * Centralized error handling utilities
 */

/**
 * Standard error response for API endpoints
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleError = (res, error, statusCode = 500) => {
  console.error(`Error: ${error.message}`, error);
  
  return res.status(statusCode).json({
    success: false,
    error: error.message || 'Server error'
  });
};

/**
 * Validates required fields in a request body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object|null} - Error object or null if validation passes
 */
const validateRequiredFields = (body, requiredFields) => {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return {
        statusCode: 400,
        message: `Missing required field: ${field}`
      };
    }
  }
  return null;
};

/**
 * Validates that an ID is valid
 * @param {string|number} id - ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
const isValidId = (id) => {
  return id !== undefined && id !== null && id !== 'undefined' && !isNaN(parseInt(id));
};

module.exports = {
  handleError,
  validateRequiredFields,
  isValidId
};
