// Dedicated companies API endpoint
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

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    console.log('Fetching companies from Supabase...');
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) {
      console.error('Error fetching companies:', error);
      return res.status(500).json({
        error: 'Failed to fetch companies',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} companies`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in companies endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get a single company by ID
app.get('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching company with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return res.status(404).json({
        error: 'Company not found',
        details: error
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in get company endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new company
app.post('/api/companies', async (req, res) => {
  try {
    console.log('Creating new company:', req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Insert the company
    const { data, error } = await supabase
      .from('companies')
      .insert([{
        name,
        code: req.body.code || '',
        contact_person: req.body.contact_person || '',
        phone: req.body.phone || '',
        email: req.body.email || '',
        address: req.body.address || ''
      }])
      .select();
    
    if (error) {
      console.error('Error creating company:', error);
      return res.status(500).json({
        error: 'Failed to create company',
        details: error
      });
    }
    
    console.log('Company created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create company endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update a company
app.put('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating company with ID: ${id}`, req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Update the company
    const { data, error } = await supabase
      .from('companies')
      .update({
        name,
        code: req.body.code || '',
        contact_person: req.body.contact_person || '',
        phone: req.body.phone || '',
        email: req.body.email || '',
        address: req.body.address || '',
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to update company',
        details: error
      });
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Company not found'
      });
    }
    
    console.log('Company updated successfully:', data);
    res.json(data[0]);
  } catch (error) {
    console.error('Unexpected error in update company endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete a company
app.delete('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting company with ID: ${id}`);
    
    // Delete the company
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to delete company',
        details: error
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error in delete company endpoint:', error);
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
