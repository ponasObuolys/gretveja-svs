// Dedicated trucks API endpoint
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

// Get all trucks
app.get('/api/trucks', async (req, res) => {
  try {
    console.log('Fetching trucks from Supabase...');
    
    // Check if we need to include company details
    const includeCompany = req.query.include === 'company';
    
    let query = supabase.from('trucks').select('*');
    
    // If include=company is specified, join with companies table
    if (includeCompany) {
      query = supabase.from('trucks').select(`
        *,
        companies:company_id (
          id,
          name,
          code
        )
      `);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching trucks:', error);
      return res.status(500).json({
        error: 'Failed to fetch trucks',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} trucks`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in trucks endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get a single truck by ID
app.get('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching truck with ID: ${id}`);
    
    // Check if we need to include company details
    const includeCompany = req.query.include === 'company';
    
    let query = supabase.from('trucks').select('*').eq('id', id).single();
    
    // If include=company is specified, join with companies table
    if (includeCompany) {
      query = supabase.from('trucks').select(`
        *,
        companies:company_id (
          id,
          name,
          code
        )
      `).eq('id', id).single();
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching truck with ID ${id}:`, error);
      return res.status(404).json({
        error: 'Truck not found',
        details: error
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in get truck endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new truck
app.post('/api/trucks', async (req, res) => {
  try {
    console.log('Creating new truck:', req.body);
    
    // Validate required fields
    const { plate_number, company_id } = req.body;
    
    if (!plate_number) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'plate_number is required'
      });
    }
    
    // Insert the truck
    const { data, error } = await supabase
      .from('trucks')
      .insert([{
        plate_number,
        model: req.body.model || '',
        year: req.body.year || null,
        company_id: company_id || null,
        notes: req.body.notes || ''
      }])
      .select();
    
    if (error) {
      console.error('Error creating truck:', error);
      return res.status(500).json({
        error: 'Failed to create truck',
        details: error
      });
    }
    
    console.log('Truck created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create truck endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update a truck
app.put('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating truck with ID: ${id}`, req.body);
    
    // Validate required fields
    const { plate_number } = req.body;
    
    if (!plate_number) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'plate_number is required'
      });
    }
    
    // Update the truck
    const { data, error } = await supabase
      .from('trucks')
      .update({
        plate_number,
        model: req.body.model || '',
        year: req.body.year || null,
        company_id: req.body.company_id || null,
        notes: req.body.notes || '',
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating truck with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to update truck',
        details: error
      });
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Truck not found'
      });
    }
    
    console.log('Truck updated successfully:', data);
    res.json(data[0]);
  } catch (error) {
    console.error('Unexpected error in update truck endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete a truck
app.delete('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting truck with ID: ${id}`);
    
    // Delete the truck
    const { error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting truck with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to delete truck',
        details: error
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error in delete truck endpoint:', error);
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
