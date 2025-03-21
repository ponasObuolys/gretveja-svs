/**
 * Suppliers controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all suppliers
 */
const getAllSuppliers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    
    if (error) throw error;
    
    // Transform data from snake_case to camelCase
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new supplier
 */
const createSupplier = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const supplierData = camelToSnake(req.body);
    
    console.log('Inserting supplier data:', supplierData);
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating supplier:', error);
    return handleError(res, error);
  }
};

/**
 * Update a supplier
 */
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid supplier ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const supplierData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplierData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return handleError(res, error);
  }
};

/**
 * Delete a supplier
 */
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid supplier ID' }, 400);
    }
    
    const { data, error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Supplier not found' }, 404);
    }
    
    return res.json({ 
      success: true, 
      message: 'Supplier deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
