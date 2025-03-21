/**
 * Trucks controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all trucks with optional company data
 */
const getAllTrucks = async (req, res) => {
  try {
    console.log('Fetching trucks with include:', req.query.include);
    
    let query;
    
    // If include=company parameter is present, join with companies table
    if (req.query.include === 'company') {
      console.log('Including company data in trucks query');
      query = supabase
        .from('trucks')
        .select(`
          id,
          plate_number,
          company_id,
          created_at,
          updated_at,
          companies:company_id (
            id, 
            name, 
            code, 
            vat_code, 
            created_at, 
            updated_at
          )
        `);
    } else {
      console.log('Fetching only trucks data');
      query = supabase.from('trucks').select('*');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching trucks:', error);
      return handleError(res, error);
    }
    
    // Transform the data from snake_case to camelCase for frontend
    const transformedData = data.map(truck => {
      // First transform the main truck data
      const transformedTruck = {
        id: truck.id,
        plateNumber: truck.plate_number,
        companyId: truck.company_id,
        createdAt: truck.created_at,
        updatedAt: truck.updated_at
      };
      
      // Add company data if it exists
      if (req.query.include === 'company' && truck.companies) {
        transformedTruck.company = snakeToCamel(truck.companies);
      }
      
      return transformedTruck;
    });
    
    console.log('Sending transformed trucks data to client:', transformedData.length > 0 ? transformedData[0] : 'No trucks found');
    return res.json(transformedData);
  } catch (error) {
    console.error('Error in trucks endpoint:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new truck
 */
const createTruck = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['plateNumber']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const truckData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('trucks')
      .insert(truckData)
      .select();
    
    if (error) throw error;
    
    // Transform the returned data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating truck:', error);
    return handleError(res, error);
  }
};

/**
 * Update a truck
 */
const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid truck ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const truckData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('trucks')
      .update(truckData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating truck:', error);
    return handleError(res, error);
  }
};

/**
 * Delete a truck
 */
const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid truck ID' }, 400);
    }
    
    const { data, error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Truck not found' }, 404);
    }
    
    return res.json({ 
      success: true, 
      message: 'Truck deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting truck:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllTrucks,
  createTruck,
  updateTruck,
  deleteTruck
};
