// Simplified API for Vercel deployment testing
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
app.get('/api/debug', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      env: {
        supabaseUrl,
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error in debug endpoint',
      message: error.message
    });
  }
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Supabase connection error',
        details: error
      });
    }
    
    res.json({
      success: true,
      message: 'Supabase connection successful',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Supabase',
      message: error.message
    });
  }
});

// Simple products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch products',
        details: error
      });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Export the Express app
module.exports = app;
