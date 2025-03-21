/**
 * Issuances controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all issuances with related data
 */
const getAllIssuances = async (req, res) => {
  try {
    console.log('Fetching issuances with related data');
    
    // Join issuances with related tables to get all necessary data
    const { data, error } = await supabase
      .from('issuances')
      .select(`
        *,
        products:product_id (*),
        trucks:truck_id (*)
      `);
    
    if (error) {
      console.error('Error fetching issuances:', error);
      return handleError(res, error);
    }
    
    // Transform the data from snake_case to camelCase for frontend
    const transformedData = data.map(item => {
      const transformed = snakeToCamel({
        ...item,
        product: item.products,
        truck: item.trucks
      });
      
      // Remove the redundant fields that were added for the join
      delete transformed.products;
      delete transformed.trucks;
      
      return transformed;
    });
    
    console.log('Sending transformed issuances data to client');
    return res.json(transformedData);
  } catch (error) {
    console.error('Error in issuances GET endpoint:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new issuance
 */
const createIssuance = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['productId', 'quantity', 'issuanceDate']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase field names to snake_case for database
    const issuanceData = camelToSnake({
      ...req.body,
      isIssued: req.body.isIssued || false
    });
    
    console.log('Inserting issuance data:', issuanceData);
    
    // Use upsert to handle both insert and update
    const { data, error } = await supabase
      .from('issuances')
      .upsert(issuanceData)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return handleError(res, error);
    }
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Failed to create issuance record' }, 500);
    }
    
    // Transform the returned data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating issuance:', error);
    return handleError(res, error);
  }
};

/**
 * Update an issuance
 */
const updateIssuance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid issuance ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const issuanceData = camelToSnake(req.body);
    
    console.log('Updating issuance data:', issuanceData);
    
    const { data, error } = await supabase
      .from('issuances')
      .update(issuanceData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating issuance:', error);
    return handleError(res, error);
  }
};

/**
 * Delete an issuance
 */
const deleteIssuance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is provided and is a valid number
    if (!isValidId(id)) {
      console.error('Invalid issuance ID:', id);
      return handleError(res, { message: 'Invalid issuance ID' }, 400);
    }
    
    console.log('Deleting issuance with ID:', id);
    
    const { data, error } = await supabase
      .from('issuances')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error deleting issuance:', error);
      return handleError(res, error);
    }
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Issuance not found' }, 404);
    }
    
    return res.json({ 
      success: true, 
      message: 'Issuance deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting issuance:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllIssuances,
  createIssuance,
  updateIssuance,
  deleteIssuance
};
