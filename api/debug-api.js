// Debug API for Vercel deployment
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express app
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Debug API for Gretvėja-SVS',
    endpoints: [
      '/api/debug/env - Show environment variables',
      '/api/debug/tables - Check all database tables',
      '/api/debug/test-query - Test a simple query'
    ]
  });
});

// Environment variables endpoint
app.get('/api/debug/env', (req, res) => {
  res.json({
    supabaseUrl: supabaseUrl,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set'
  });
});

// Check tables endpoint
app.get('/api/debug/tables', async (req, res) => {
  try {
    const tables = [
      'products',
      'suppliers',
      'stocks',
      'purchases',
      'issuances',
      'companies',
      'trucks'
    ];
    
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          results[table] = {
            exists: false,
            error: error.message,
            details: error
          };
        } else {
          results[table] = {
            exists: true,
            count: data.length > 0 ? data[0].count : 0
          };
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err.message
        };
      }
    }
    
    res.json({
      timestamp: new Date().toISOString(),
      supabaseUrl: supabaseUrl,
      tables: results
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check tables',
      message: error.message,
      stack: error.stack
    });
  }
});

// Test query endpoint
app.get('/api/debug/test-query', async (req, res) => {
  try {
    // Try a simple query to check connection
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error
      });
    }
    
    res.json({
      success: true,
      count: data.length,
      sample: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Export the Express app
module.exports = app;
