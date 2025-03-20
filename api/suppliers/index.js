// Dedicated suppliers API endpoint
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

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    console.log('Fetching suppliers from Supabase...');
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({
        error: 'Failed to fetch suppliers',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} suppliers`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in suppliers endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get a single supplier by ID
app.get('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching supplier with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      return res.status(404).json({
        error: 'Supplier not found',
        details: error
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in get supplier endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new supplier
app.post('/api/suppliers', async (req, res) => {
  try {
    console.log('Creating new supplier:', req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Insert the supplier
    const { data, error } = await supabase
      .from('suppliers')
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
      console.error('Error creating supplier:', error);
      return res.status(500).json({
        error: 'Failed to create supplier',
        details: error
      });
    }
    
    console.log('Supplier created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create supplier endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update a supplier
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating supplier with ID: ${id}`, req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Update the supplier
    const { data, error } = await supabase
      .from('suppliers')
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
      console.error(`Error updating supplier with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to update supplier',
        details: error
      });
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Supplier not found'
      });
    }
    
    console.log('Supplier updated successfully:', data);
    res.json(data[0]);
  } catch (error) {
    console.error('Unexpected error in update supplier endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete a supplier
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting supplier with ID: ${id}`);
    
    // Delete the supplier
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to delete supplier',
        details: error
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error in delete supplier endpoint:', error);
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
