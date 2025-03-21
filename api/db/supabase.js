/**
 * Supabase client configuration and initialization
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');

// Get environment variables from config
const { supabaseUrl, supabaseKey } = config.env;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Initialize database tables if they don't exist
 */
const initializeDatabase = async () => {
  try {
    console.log('Checking database tables...');
    
    // Check if products table exists
    const { data: productsData, error: productsError } = await supabase.from('products').select('count');
    if (productsError && productsError.code === '42P01') {
      console.log('Products table does not exist. Creating...');
      // Create products table using SQL
      const { error: createError } = await supabase.rpc('create_products_table');
      if (createError) {
        console.error('Error creating products table:', createError);
      } else {
        console.log('Products table created successfully');
      }
    }
    
    // Check if stocks table exists
    const { data: stocksData, error: stocksError } = await supabase.from('stocks').select('count');
    if (stocksError && stocksError.code === '42P01') {
      console.log('Stocks table does not exist. Creating...');
      // Create stocks table using SQL
      const { error: createError } = await supabase.rpc('create_stocks_table');
      if (createError) {
        console.error('Error creating stocks table:', createError);
      } else {
        console.log('Stocks table created successfully');
      }
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  supabase,
  initializeDatabase
};
