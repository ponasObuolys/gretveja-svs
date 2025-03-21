/**
 * Companies controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all companies
 */
const getAllCompanies = async (req, res) => {
  try {
    const { data, error } = await supabase.from('companies').select('*');
    
    if (error) throw error;
    
    // Transform the data from snake_case to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new company
 */
const createCompany = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const companyData = camelToSnake(req.body);
    
    console.log('Inserting company data:', companyData);
    
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select();
    
    if (error) throw error;
    
    // Transform the returned data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating company:', error);
    return handleError(res, error);
  }
};

/**
 * Update a company
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid company ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const companyData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating company:', error);
    return handleError(res, error);
  }
};

/**
 * Delete a company
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid company ID' }, 400);
    }
    
    const { data, error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Company not found' }, 404);
    }
    
    return res.json({ 
      success: true, 
      message: 'Company deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};
