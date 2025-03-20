// Main API file for Gretveja SVS
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

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Gretveja SVS API is running',
    version: '1.0.0',
    endpoints: [
      '/api/products',
      '/api/suppliers',
      '/api/companies',
      '/api/trucks',
      '/api/stocks',
      '/api/purchases',
      '/api/issuances'
    ]
  });
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    // Check connection
    const { data, error } = await supabase.from('_dummy_query_').select('*').limit(1).catch(() => {
      return { data: null, error: { message: 'Expected error from dummy query' } };
    });

    // Check tables
    const tables = ['products', 'suppliers', 'companies', 'trucks', 'stocks', 'purchases', 'issuances'];
    const tableStatus = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        tableStatus[table] = {
          exists: !error,
          error: error ? error.message : null
        };
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err.message
        };
      }
    }

    res.json({
      success: true,
      message: 'Debug information',
      supabaseUrl,
      tables: tableStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug error',
      message: error.message
    });
  }
});

// PRODUCTS ENDPOINTS
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

// SUPPLIERS ENDPOINTS
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

// COMPANIES ENDPOINTS
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

// TRUCKS ENDPOINTS
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

// STOCKS ENDPOINTS
app.get('/api/stocks', async (req, res) => {
  try {
    console.log('Fetching stocks from Supabase...');
    const { data, error } = await supabase
      .from('stocks')
      .select('*');
    
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

// PURCHASES ENDPOINTS
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

// ISSUANCES ENDPOINTS
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

// Setup database tables if they don't exist
async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Required tables with their schemas
    const tables = {
      products: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          code TEXT,
          description TEXT,
          unit TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      suppliers: `
        CREATE TABLE IF NOT EXISTS suppliers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          code TEXT,
          contact_person TEXT,
          phone TEXT,
          email TEXT,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      companies: `
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          code TEXT,
          contact_person TEXT,
          phone TEXT,
          email TEXT,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      trucks: `
        CREATE TABLE IF NOT EXISTS trucks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          plate_number TEXT NOT NULL,
          model TEXT,
          year INTEGER,
          company_id UUID REFERENCES companies(id),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      stocks: `
        CREATE TABLE IF NOT EXISTS stocks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID REFERENCES products(id),
          quantity NUMERIC NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      purchases: `
        CREATE TABLE IF NOT EXISTS purchases (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          supplier_id UUID REFERENCES suppliers(id),
          date DATE NOT NULL,
          document_number TEXT,
          total_amount NUMERIC NOT NULL DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `,
      issuances: `
        CREATE TABLE IF NOT EXISTS issuances (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id),
          date DATE NOT NULL,
          document_number TEXT,
          total_amount NUMERIC NOT NULL DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    };
    
    // Check if tables exist
    const tableOrder = ['products', 'suppliers', 'companies', 'trucks', 'stocks', 'purchases', 'issuances'];
    
    for (const table of tableOrder) {
      try {
        console.log(`Checking if table ${table} exists...`);
        
        // Try to select from the table
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`Table ${table} does not exist or is not accessible. Creating...`);
          
          // Try to create the table
          const { error: createError } = await supabase.rpc(
            'execute_sql',
            { sql: tables[table] }
          );
          
          if (createError) {
            console.error(`Error creating table ${table}:`, createError);
          } else {
            console.log(`Table ${table} created successfully.`);
          }
        } else {
          console.log(`Table ${table} already exists.`);
        }
      } catch (err) {
        console.error(`Error processing table ${table}:`, err);
      }
    }
    
    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run database setup when the app starts
setupDatabase();

// Export the Express app
module.exports = (req, res) => {
  return app(req, res);
};
