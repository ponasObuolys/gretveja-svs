/**
 * Products controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all products
 */
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) throw error;
    
    // Transform data from snake_case to camelCase
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new product
 */
const createProduct = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name', 'unit']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const productData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating product:', error);
    return handleError(res, error);
  }
};

/**
 * Update a product
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid product ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const productData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating product:', error);
    return handleError(res, error);
  }
};

/**
 * Delete a product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid product ID' }, 400);
    }
    
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Product not found' }, 404);
    }
    
    return res.json({ 
      success: true, 
      message: 'Product deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
