/**
 * Purchases controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all purchases with related data
 */
const getAllPurchases = async (req, res) => {
  try {
    console.log('Fetching purchases with related data');
    
    // Join purchases with related tables to get all necessary data
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products:product_id (*),
        suppliers:supplier_id (*),
        companies:company_id (*)
      `);
    
    if (error) {
      console.error('Error fetching purchases:', error);
      return handleError(res, error);
    }
    
    console.log('Raw purchases data from DB:', JSON.stringify(data[0], null, 2));
    
    // Transform the data from snake_case to camelCase for frontend
    const transformedData = data.map(item => {
      // First transform the main purchase data
      const purchase = snakeToCamel(item);
      
      // Then transform the related entities and rename them to singular form
      if (item.products) {
        purchase.product = snakeToCamel(item.products);
        delete purchase.products;
      }
      
      if (item.suppliers) {
        purchase.supplier = snakeToCamel(item.suppliers);
        delete purchase.suppliers;
      }
      
      if (item.companies) {
        purchase.company = snakeToCamel(item.companies);
        delete purchase.companies;
      }
      
      return purchase;
    });
    
    console.log('Transformed purchase data for frontend:', JSON.stringify(transformedData[0], null, 2));
    
    console.log('Sending transformed purchases data to client');
    return res.json(transformedData);
  } catch (error) {
    console.error('Error in purchases GET endpoint:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new purchase
 */
const createPurchase = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['invoiceNumber', 'productId', 'quantity', 'purchaseDate']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const purchaseData = camelToSnake({
      ...req.body,
      // Calculate total amount
      totalAmount: Number(req.body.quantity) * (Number(req.body.unitPrice) || 0)
    });
    
    console.log('Inserting purchase data:', purchaseData);
    
    // Use upsert to handle both insert and update
    const { data, error } = await supabase
      .from('purchases')
      .upsert(purchaseData)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return handleError(res, error);
    }
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Failed to create purchase record' }, 500);
    }
    
    console.log('Raw created purchase data from DB:', JSON.stringify(data[0], null, 2));
    
    // Transform the returned data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    console.log('Transformed created purchase data for frontend:', JSON.stringify(transformedData[0], null, 2));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating purchase:', error);
    return handleError(res, error);
  }
};

/**
 * Update a purchase
 */
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid purchase ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const purchaseData = camelToSnake(req.body);
    
    // Calculate total amount if quantity and unitPrice are provided
    if (req.body.quantity !== undefined && req.body.unitPrice !== undefined) {
      purchaseData.total_amount = Number(req.body.quantity) * Number(req.body.unitPrice);
    }
    
    const { data, error } = await supabase
      .from('purchases')
      .update(purchaseData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    console.log('Raw updated purchase data from DB:', JSON.stringify(data[0], null, 2));
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    console.log('Transformed updated purchase data for frontend:', JSON.stringify(transformedData[0], null, 2));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating purchase:', error);
    return handleError(res, error);
  }
};

/**
 * Delete a purchase
 */
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is provided and is a valid number
    if (!isValidId(id)) {
      console.error('Invalid purchase ID:', id);
      return handleError(res, { message: 'Invalid purchase ID' }, 400);
    }
    
    console.log('Deleting purchase with ID:', id);
    
    const { data, error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error deleting purchase:', error);
      return handleError(res, error);
    }
    
    if (!data || data.length === 0) {
      return handleError(res, { message: 'Purchase not found' }, 404);
    }
    
    console.log('Deleted purchase data:', JSON.stringify(data[0], null, 2));
    
    return res.json({ 
      success: true, 
      message: 'Purchase deleted successfully', 
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase
};
