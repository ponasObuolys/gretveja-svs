// Dedicated issuances API endpoint
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
app.get('/api/issuances/debug', async (req, res) => {
  try {
    // Check if issuances table exists
    const { data, error } = await supabase
      .from('issuances')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error checking issuances table',
        details: error
      });
    }
    
    res.json({
      success: true,
      message: 'Issuances table exists',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error checking issuances table',
      message: error.message
    });
  }
});

// Get all issuances
app.get('/api/issuances', async (req, res) => {
  try {
    console.log('Fetching issuances from Supabase...');
    const { data, error } = await supabase
      .from('issuances')
      .select('*');
    
    if (error) {
      console.error('Error fetching issuances:', error);
      return res.status(500).json({
        error: 'Failed to fetch issuances',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} issuances`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in issuances endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new issuance
app.post('/api/issuances', async (req, res) => {
  try {
    console.log('Creating new issuance:', req.body);
    
    // Validate required fields
    const { company_id, date, document_number, total_amount } = req.body;
    
    if (!company_id || !date) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'company_id and date are required'
      });
    }
    
    // Insert the issuance
    const { data, error } = await supabase
      .from('issuances')
      .insert([{
        company_id,
        date,
        document_number: document_number || '',
        total_amount: total_amount || 0,
        notes: req.body.notes || ''
      }])
      .select();
    
    if (error) {
      console.error('Error creating issuance:', error);
      return res.status(500).json({
        error: 'Failed to create issuance',
        details: error
      });
    }
    
    console.log('Issuance created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create issuance endpoint:', error);
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
