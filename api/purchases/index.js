// Dedicated purchases API endpoint
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
app.get('/api/purchases/debug', async (req, res) => {
  try {
    // Check if purchases table exists
    const { data, error } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error checking purchases table',
        details: error
      });
    }
    
    res.json({
      success: true,
      message: 'Purchases table exists',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error checking purchases table',
      message: error.message
    });
  }
});

// Get all purchases
app.get('/api/purchases', async (req, res) => {
  try {
    console.log('Fetching purchases from Supabase...');
    const { data, error } = await supabase
      .from('purchases')
      .select('*');
    
    if (error) {
      console.error('Error fetching purchases:', error);
      return res.status(500).json({
        error: 'Failed to fetch purchases',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} purchases`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in purchases endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new purchase
app.post('/api/purchases', async (req, res) => {
  try {
    console.log('Creating new purchase:', req.body);
    
    // Validate required fields
    const { supplier_id, date, document_number, total_amount } = req.body;
    
    if (!supplier_id || !date) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'supplier_id and date are required'
      });
    }
    
    // Insert the purchase
    const { data, error } = await supabase
      .from('purchases')
      .insert([{
        supplier_id,
        date,
        document_number: document_number || '',
        total_amount: total_amount || 0,
        notes: req.body.notes || ''
      }])
      .select();
    
    if (error) {
      console.error('Error creating purchase:', error);
      return res.status(500).json({
        error: 'Failed to create purchase',
        details: error
      });
    }
    
    console.log('Purchase created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create purchase endpoint:', error);
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
