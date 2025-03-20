// Script to set up Supabase database tables
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL statements to create tables
const createTableSQL = {
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

// Tables to create in order (respecting foreign key dependencies)
const tables = [
  'products',
  'suppliers',
  'companies',
  'trucks',
  'stocks',
  'purchases',
  'issuances'
];

async function setupDatabase() {
  console.log('Setting up Supabase database tables...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Enable UUID extension
    const { data: extensionData, error: extensionError } = await supabase.rpc(
      'execute_sql',
      { sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' }
    );
    
    if (extensionError) {
      console.warn('Warning: Could not enable uuid-ossp extension. This might be already enabled or you lack permissions:', extensionError.message);
    } else {
      console.log('✅ uuid-ossp extension is enabled');
    }
    
    // Create tables in order
    for (const table of tables) {
      try {
        console.log(`Creating table: ${table}`);
        
        // Execute SQL to create table
        const { data, error } = await supabase.rpc(
          'execute_sql',
          { sql: createTableSQL[table] }
        );
        
        if (error) {
          console.error(`❌ Error creating table ${table}:`, error.message);
          
          // Try a different approach - check if table exists
          const { data: checkData, error: checkError } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (checkError) {
            console.error(`❌ Table ${table} does not exist or is not accessible:`, checkError.message);
          } else {
            console.log(`✅ Table ${table} already exists and is accessible`);
          }
        } else {
          console.log(`✅ Table ${table} created or already exists`);
        }
      } catch (err) {
        console.error(`❌ Error processing table ${table}:`, err.message);
      }
    }
    
    console.log('Database setup completed');
    return true;
  } catch (error) {
    console.error('Unexpected error during database setup:', error);
    return false;
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

// Export the setupDatabase function
module.exports = setupDatabase;
