/**
 * Stocks controller
 */
const { supabase } = require('../db/supabase');
const { handleError, validateRequiredFields, isValidId } = require('../utils/errorHandler');
const { snakeToCamel, camelToSnake } = require('../utils/caseConverters');

/**
 * Get all stocks with related data
 */
const getAllStocks = async (req, res) => {
  try {
    // Get language preference from query parameter, default to Lithuanian
    const lang = req.query.lang || 'lt';
    
    console.log('Fetching stocks with language:', lang);
    
    // Get all products first
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, name_en, name_ru, unit');
    
    if (productsError) throw productsError;
    
    // Get stocks data
    const { data: stocksData, error: stocksError } = await supabase
      .from('stocks')
      .select('id, product_id, quantity, location, last_updated');
    
    if (stocksError) throw stocksError;
    
    // Create a map of stocks by product_id for quick lookup
    const stocksMap = {};
    stocksData.forEach(stock => {
      stocksMap[stock.product_id] = stock;
    });
    
    // Get all purchases for calculating totals
    const { data: purchasesData, error: purchasesError } = await supabase
      .from('purchases')
      .select('product_id, quantity');
    
    if (purchasesError) throw purchasesError;
    
    // Get all issuances for calculating totals
    const { data: issuancesData, error: issuancesError } = await supabase
      .from('issuances')
      .select('product_id, quantity');
    
    if (issuancesError) throw issuancesError;
    
    // Calculate totals for each product
    const purchaseTotals = {};
    const issuanceTotals = {};
    
    // Sum up all purchases by product_id
    purchasesData.forEach(purchase => {
      const productId = purchase.product_id;
      purchaseTotals[productId] = (purchaseTotals[productId] || 0) + purchase.quantity;
    });
    
    // Sum up all issuances by product_id
    issuancesData.forEach(issuance => {
      const productId = issuance.product_id;
      issuanceTotals[productId] = (issuanceTotals[productId] || 0) + issuance.quantity;
    });
    
    // Format the response to include all products, even if they don't have stock entries
    const formattedData = productsData.map(product => {
      // Select the appropriate name based on language preference
      let productName = product.name; // Default to Lithuanian
      
      const productId = product.id;
      const stockInfo = stocksMap[productId] || { quantity: 0, location: 'Nenurodyta', last_updated: null };
      const totalPurchased = purchaseTotals[productId] || 0;
      const totalIssued = issuanceTotals[productId] || 0;
      const currentBalance = totalPurchased - totalIssued;
      
      return {
        id: stockInfo.id || null,
        productId: productId,
        productName: productName,
        name_en: product.name_en,
        name_ru: product.name_ru,
        unit: product.unit,
        totalPurchased: totalPurchased,
        totalIssued: totalIssued,
        stockInHand: currentBalance,
        location: stockInfo.location,
        lastUpdated: stockInfo.last_updated
      };
    });
    
    return res.json(formattedData);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return handleError(res, error);
  }
};

/**
 * Update stock information
 */
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!isValidId(id)) {
      return handleError(res, { message: 'Invalid stock ID' }, 400);
    }
    
    // Convert camelCase to snake_case for database
    const stockData = camelToSnake(req.body);
    
    const { data, error } = await supabase
      .from('stocks')
      .update(stockData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.json(transformedData);
  } catch (error) {
    console.error('Error updating stock:', error);
    return handleError(res, error);
  }
};

/**
 * Create a new stock entry
 */
const createStock = async (req, res) => {
  try {
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['productId']);
    if (validation) {
      return handleError(res, { message: validation.message }, validation.statusCode);
    }
    
    // Convert camelCase to snake_case for database
    const stockData = camelToSnake(req.body);
    
    // Add last_updated field
    stockData.last_updated = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('stocks')
      .insert(stockData)
      .select();
    
    if (error) throw error;
    
    // Transform data back to camelCase for frontend
    const transformedData = data.map(item => snakeToCamel(item));
    
    return res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating stock:', error);
    return handleError(res, error);
  }
};

module.exports = {
  getAllStocks,
  updateStock,
  createStock
};
