// Setup script to run during Vercel deployment
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

// Check if tables exist
async function checkTables() {
  console.log('Checking for required tables in Supabase...');
  
  const tableStatus = {};
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table ${table} does not exist or is not accessible:`, error.message);
        tableStatus[table] = false;
      } else {
        console.log(`✅ Table ${table} exists and is accessible`);
        tableStatus[table] = true;
      }
    } catch (err) {
      console.error(`❌ Error checking table ${table}:`, err.message);
      tableStatus[table] = false;
    }
  }
  
  return tableStatus;
}

// Main setup function
async function setup() {
  console.log('Running setup script for Vercel deployment...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Check if tables exist
    const tableStatus = await checkTables();
    
    // If any tables are missing, run the database setup
    const missingTables = Object.entries(tableStatus)
      .filter(([_, exists]) => !exists)
      .map(([table]) => table);
    
    if (missingTables.length > 0) {
      console.log(`Missing tables detected: ${missingTables.join(', ')}`);
      console.log('Running database setup to create missing tables...');
      
      // Import and run the database setup
      const setupDatabase = require('./setup-database');
      await setupDatabase();
    } else {
      console.log('All required tables exist. No setup needed.');
    }
    
    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

// Run setup
setup();
