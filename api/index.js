// Vercel Serverless API handler
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase klientas
const supabase = createClient(supabaseUrl, supabaseKey);

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('Checking database tables...');
    
    // Check if products table exists
    const { data: productsData, error: productsError } = await supabase.from('products').select('count');
    if (productsError && productsError.code === '42P01') {
      console.log('Products table does not exist. Creating...');
      // Create products table using SQL
      const { error: createError } = await supabase.rpc('create_products_table');
      if (createError) {
        console.error('Error creating products table:', createError);
      } else {
        console.log('Products table created successfully');
      }
    }
    
    // Check if stocks table exists
    const { data: stocksData, error: stocksError } = await supabase.from('stocks').select('count');
    if (stocksError && stocksError.code === '42P01') {
      console.log('Stocks table does not exist. Creating...');
      // Create stocks table using SQL
      const { error: createError } = await supabase.rpc('create_stocks_table');
      if (createError) {
        console.error('Error creating stocks table:', createError);
      } else {
        console.log('Stocks table created successfully');
      }
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Express aplikacija
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Pagrindinis maršrutas
app.get('/', (req, res) => {
  res.json({ message: 'Sveiki atvykę į Gretvėja-SVS API!' });
});

// Test endpoint to check Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Using URL:', supabaseUrl);
    console.log('Using Key:', supabaseKey.substring(0, 10) + '...');
    
    // Check if products table exists
    const { data: productsData, error: productsError } = await supabase.from('products').select('count');
    
    // Check if stocks table exists
    const { data: stocksData, error: stocksError } = await supabase.from('stocks').select('count');
    
    // Return detailed information about database status
    return res.json({
      success: true,
      message: 'Supabase connection test',
      database: {
        products: {
          exists: !productsError || productsError.code !== '42P01',
          error: productsError ? productsError.message : null,
          data: productsData
        },
        stocks: {
          exists: !stocksError || stocksError.code !== '42P01',
          error: stocksError ? stocksError.message : null,
          data: stocksData
        }
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL_SET: !!process.env.SUPABASE_URL,
        SUPABASE_KEY_SET: !!process.env.SUPABASE_KEY
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API maršrutai
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stocks').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Purchases endpoints
app.get('/api/purchases', async (req, res) => {
  try {
    const { data, error } = await supabase.from('purchases').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    const { data, error } = await supabase.from('purchases').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: error.message });
  }
});

// Issuances endpoints
app.get('/api/issuances', async (req, res) => {
  try {
    const { data, error } = await supabase.from('issuances').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching issuances:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/issuances', async (req, res) => {
  try {
    const { data, error } = await supabase.from('issuances').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting issuance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Companies endpoints
app.get('/api/companies', async (req, res) => {
  try {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const { data, error } = await supabase.from('companies').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trucks endpoints
app.get('/api/trucks', async (req, res) => {
  try {
    let query = supabase.from('trucks').select('*');
    
    // Handle include parameter for related data
    if (req.query.include === 'company') {
      query = supabase.from('trucks').select('*, company:companies(*)');
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trucks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trucks').insert(req.body);
    if (error) throw error;
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
    if (error) throw error;
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
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting truck:', error);
    res.status(500).json({ error: error.message });
  }
});

// Klaidų apdorojimas
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Serverio klaida' });
});

// Vercel serverless function handler
// This is the format Vercel expects for serverless functions
module.exports = (req, res) => {
  // Log request for debugging
  console.log('API Request:', req.method, req.url);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Supabase URL set:', !!process.env.SUPABASE_URL);
  
  // Handle the request with the Express app
  return app(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initializeDatabase();
  });
}
