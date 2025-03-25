/**
 * Trucks controller
 */
const { supabase } = require('../db/supabase');
const { handleError, isValidId } = require('../utils/errorHandler');
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
    
    console.log('Raw trucks data from DB:', data.length > 0 ? JSON.stringify(data[0], null, 2) : 'No trucks found');
    
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
    
    console.log('Sending transformed trucks data to client:', transformedData.length > 0 ? JSON.stringify(transformedData[0], null, 2) : 'No trucks found');
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
    // Log the incoming request body for debugging
    console.log('Received truck creation request body:', JSON.stringify(req.body, null, 2));
    
    // Convert camelCase to snake_case for database
    const truckData = camelToSnake(req.body);
    
    // Validate required fields - check for snake_case field after conversion
    if (!truckData.plate_number) {
      return handleError(res, { message: 'Missing required field: plate_number' }, 400);
    }
    
    console.log('Creating truck with data:', JSON.stringify(truckData, null, 2));
    
    const { data, error } = await supabase
      .from('trucks')
      .insert(truckData)
      .select();
    
    if (error) throw error;
    
    // Transform the returned data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    console.log('Created truck with data:', JSON.stringify(transformedData[0], null, 2));
    
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
    
    console.log('Updating truck with ID:', id, 'and data:', JSON.stringify(truckData, null, 2));
    
    const { data, error } = await supabase
      .from('trucks')
      .update(truckData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    console.log('Updated truck with data:', JSON.stringify(transformedData[0], null, 2));
    
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
    
    console.log('Deleting truck with ID:', id);
    
    const { data, error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Truck not found' }, 404);
    }
    
    console.log('Deleted truck with ID:', id);
    
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
