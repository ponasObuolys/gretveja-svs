// Dedicated stocks API endpoint
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json());

// Debug endpoint
app.get('/api/stocks/debug', async (req, res) => {
  try {
    // Check if stocks table exists
    const { data, error } = await supabase
      .from('stocks')
      .select('count')
      .limit(1);
    
    if (error) {
      // Try to create the stocks table if it doesn't exist
      try {
        const createTableResult = await supabase.rpc('create_table', {
          table_name: 'stocks',
          schema: `
            id uuid primary key default uuid_generate_v4(),
            product_id uuid references products(id),
            quantity numeric not null default 0,
            created_at timestamp with time zone default now(),
            updated_at timestamp with time zone default now()
          `
        });
        
        return res.json({
          success: true,
          message: 'Attempted to create stocks table',
          result: createTableResult
        });
      } catch (createError) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create stocks table',
          originalError: error,
          createError
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Stocks table exists',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error checking stocks table',
      message: error.message,
      stack: error.stack
    });
  }
});

// Get all stocks
app.get('/api/stocks', async (req, res) => {
  try {
    console.log('Fetching stocks from Supabase...');
    
    // First check if the table exists
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*');
      
      if (error) {
        console.error('Error fetching stocks:', error);
        return res.status(500).json({
          error: 'Failed to fetch stocks',
          details: error
        });
      }
      
      console.log(`Successfully fetched ${data.length} stocks`);
      return res.json(data);
    } catch (tableError) {
      console.error('Error accessing stocks table:', tableError);
      
      // If we get here, try to return an empty array instead of an error
      return res.json([]);
    }
  } catch (error) {
    console.error('Unexpected error in stocks endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Export the Express app
module.exports = (req, res) => {
  return app(req, res);
};
