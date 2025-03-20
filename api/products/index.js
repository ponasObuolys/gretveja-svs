// Dedicated products API endpoint
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

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        error: 'Failed to fetch products',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} products`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in products endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return res.status(404).json({
        error: 'Product not found',
        details: error
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in get product endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    console.log('Creating new product:', req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Insert the product
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        code: req.body.code || '',
        description: req.body.description || '',
        unit: req.body.unit || ''
      }])
      .select();
    
    if (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({
        error: 'Failed to create product',
        details: error
      });
    }
    
    console.log('Product created successfully:', data);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in create product endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating product with ID: ${id}`, req.body);
    
    // Validate required fields
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required'
      });
    }
    
    // Update the product
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        code: req.body.code || '',
        description: req.body.description || '',
        unit: req.body.unit || '',
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to update product',
        details: error
      });
    }
    
    if (data.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }
    
    console.log('Product updated successfully:', data);
    res.json(data[0]);
  } catch (error) {
    console.error('Unexpected error in update product endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting product with ID: ${id}`);
    
    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to delete product',
        details: error
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error in delete product endpoint:', error);
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
