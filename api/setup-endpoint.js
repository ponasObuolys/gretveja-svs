// Setup endpoint to manually trigger database setup
const express = require('express');
const cors = require('cors');
const setupDatabase = require('./setup-database');

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json());

// Check tables endpoint
app.get('/api/setup/check', async (req, res) => {
  try {
    console.log('Checking database tables...');
    
    const { createClient } = require('@supabase/supabase-js');
    
    // Supabase configuration
    const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Required tables
    const requiredTables = [
      'products',
      'suppliers',
      'companies',
      'trucks',
      'stocks',
      'purchases',
      'issuances'
    ];
    
    const tableStatus = {};
    
    // Check each table
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table ${table} does not exist or is not accessible:`, error.message);
          tableStatus[table] = {
            exists: false,
            error: error.message
          };
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
          tableStatus[table] = {
            exists: true,
            count: data[0]?.count || 0
          };
        }
      } catch (err) {
        console.error(`❌ Error checking table ${table}:`, err.message);
        tableStatus[table] = {
          exists: false,
          error: err.message
        };
      }
    }
    
    res.json({
      success: true,
      message: 'Database table check completed',
      supabaseUrl,
      tables: tableStatus
    });
  } catch (error) {
    console.error('Error checking tables:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check tables',
      message: error.message
    });
  }
});

// Setup tables endpoint
app.post('/api/setup/run', async (req, res) => {
  try {
    console.log('Running database setup...');
    
    // Run the database setup
    const result = await setupDatabase();
    
    if (result) {
      res.json({
        success: true,
        message: 'Database setup completed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Database setup failed'
      });
    }
  } catch (error) {
    console.error('Error running setup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run setup',
      message: error.message
    });
  }
});

// Export the Express app
module.exports = (req, res) => {
  return app(req, res);
};
