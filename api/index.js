/**
 * Gretvėja-SVS API
 * Vercel Serverless API handler
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { initializeDatabase } = require('./db/supabase');

// Import routes
const productsRoutes = require('./routes/productsRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const stocksRoutes = require('./routes/stocksRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');
const issuancesRoutes = require('./routes/issuancesRoutes');
const companiesRoutes = require('./routes/companiesRoutes');
const trucksRoutes = require('./routes/trucksRoutes');

// Express application
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Sveiki atvykę į Gretvėja-SVS API!' });
});

// Test endpoint to check Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const { supabase } = require('./db/supabase');
    console.log('Testing Supabase connection...');
    console.log('Using URL:', config.env.supabaseUrl);
    console.log('Using Key:', config.env.supabaseKey.substring(0, 10) + '...');
    
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
        NODE_ENV: config.env.nodeEnv,
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

// API routes
app.use('/api/products', productsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/issuances', issuancesRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/trucks', trucksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Serverio klaida' });
});

// Vercel serverless function handler
// This is the format Vercel expects for serverless functions
module.exports = (req, res) => {
  // Log request for debugging
  console.log('API Request:', req.method, req.url);
  console.log('Environment:', config.env.nodeEnv);
  console.log('Supabase URL set:', !!process.env.SUPABASE_URL);
  
  // Handle the request with the Express app
  return app(req, res);
};

// For local development
if (config.env.nodeEnv !== 'production') {
  const PORT = config.env.port;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initializeDatabase();
  });
}
