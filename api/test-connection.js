// Supabase connection test endpoint
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Using URL:', supabaseUrl);
    console.log('Using Key:', supabaseKey.substring(0, 10) + '...');
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if products table exists
    const { data: productsData, error: productsError } = await supabase.from('products').select('count');
    
    // Check if stocks table exists
    const { data: stocksData, error: stocksError } = await supabase.from('stocks').select('count');
    
    // Return detailed information about database status
    return res.status(200).json({
      success: true,
      message: 'Supabase connection test',
      database: {
        products: {
          exists: !productsError || productsError.code !== '42P01',
          error: productsError ? productsError.message : null,
          data: productsData
        },
        stocks: {
          exists: !stocksError || stocksError.code !== '42P01',
          error: stocksError ? stocksError.message : null,
          data: stocksData
        }
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL_SET: !!process.env.SUPABASE_URL,
        SUPABASE_KEY_SET: !!process.env.SUPABASE_KEY
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
