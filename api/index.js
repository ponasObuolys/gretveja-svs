// Vercel Serverless API handler
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase klientas
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Express aplikacija
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Diagnostikos maršrutas
app.get('/api/debug', async (req, res) => {
  try {
    // Tikriname Supabase ryšį
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Supabase connection error',
        details: error,
        env: {
          supabaseUrl: supabaseUrl,
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV || 'not set'
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString(),
      env: {
        supabaseUrl: supabaseUrl,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'not set'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Supabase',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// Pagrindinis maršrutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sveiki atvykę į Gretvėja-SVS API!',
    version: '1.0.0',
    supabaseUrl: supabaseUrl
  });
});

// API maršrutai
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase.from('products').select('*');
    
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

app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').insert(req.body);
    if (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    console.log('Fetching suppliers from Supabase...');
    const { data, error } = await supabase.from('suppliers').select('*');
    
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

app.post('/api/suppliers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').insert(req.body);
    if (error) {
      console.error('Error creating supplier:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('suppliers')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating supplier:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting supplier:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    console.log('Fetching stocks from Supabase...');
    const { data, error } = await supabase.from('stocks').select('*');
    
    if (error) {
      console.error('Error fetching stocks:', error);
      return res.status(500).json({
        error: 'Failed to fetch stocks',
        details: error
      });
    }
    
    console.log(`Successfully fetched ${data.length} stocks`);
    res.json(data);
  } catch (error) {
    console.error('Unexpected error in stocks endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Purchases endpoints
app.get('/api/purchases', async (req, res) => {
  try {
    console.log('Fetching purchases from Supabase...');
    const { data, error } = await supabase.from('purchases').select('*');
    
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

app.post('/api/purchases', async (req, res) => {
  try {
    const { data, error } = await supabase.from('purchases').insert(req.body);
    if (error) {
      console.error('Error creating purchase:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('purchases')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating purchase:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting purchase:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: error.message });
  }
});

// Issuances endpoints
app.get('/api/issuances', async (req, res) => {
  try {
    console.log('Fetching issuances from Supabase...');
    const { data, error } = await supabase.from('issuances').select('*');
    
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

app.post('/api/issuances', async (req, res) => {
  try {
    const { data, error } = await supabase.from('issuances').insert(req.body);
    if (error) {
      console.error('Error creating issuance:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating issuance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/issuances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('issuances')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating issuance:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating issuance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/issuances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('issuances')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting issuance:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting issuance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Companies endpoints
app.get('/api/companies', async (req, res) => {
  try {
    console.log('Fetching companies from Supabase...');
    const { data, error } = await supabase.from('companies').select('*');
    
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

app.post('/api/companies', async (req, res) => {
  try {
    const { data, error } = await supabase.from('companies').insert(req.body);
    if (error) {
      console.error('Error creating company:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('companies')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating company:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting company:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trucks endpoints
app.get('/api/trucks', async (req, res) => {
  try {
    console.log('Fetching trucks from Supabase...');
    console.log('Query params:', req.query);
    
    let query = supabase.from('trucks').select('*');
    
    // Handle include parameter for related data
    if (req.query.include === 'company') {
      console.log('Including company data in trucks query');
      query = supabase.from('trucks').select('*, company:companies(*)');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error fetching trucks:', error);
      return res.status(500).json({ 
        error: error.message,
        details: error 
      });
    }
    
    console.log(`Successfully fetched ${data.length} trucks`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

app.post('/api/trucks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trucks').insert(req.body);
    if (error) {
      console.error('Error creating truck:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating truck:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trucks')
      .update(req.body)
      .eq('id', id);
    if (error) {
      console.error('Error updating truck:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating truck:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting truck:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting truck:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Klaidų apdorojimas
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ 
    error: 'Serverio klaida', 
    message: err.message,
    stack: err.stack
  });
});

// Eksportuojame Express aplikaciją
module.exports = app;
