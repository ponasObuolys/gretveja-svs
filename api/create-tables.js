// Script to create missing Supabase tables if they don't exist
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Table schemas
const tableSchemas = {
  products: `
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    code text,
    description text,
    unit text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  suppliers: `
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    code text,
    contact_person text,
    phone text,
    email text,
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  stocks: `
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id),
    quantity numeric not null default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  purchases: `
    id uuid primary key default uuid_generate_v4(),
    supplier_id uuid references suppliers(id),
    date date not null,
    document_number text,
    total_amount numeric not null default 0,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  issuances: `
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references companies(id),
    date date not null,
    document_number text,
    total_amount numeric not null default 0,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  companies: `
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    code text,
    contact_person text,
    phone text,
    email text,
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `,
  trucks: `
    id uuid primary key default uuid_generate_v4(),
    plate_number text not null,
    model text,
    year integer,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  `
};

// Tables to check and create if needed
const tables = Object.keys(tableSchemas);

async function checkAndCreateTables() {
  console.log('Checking and creating Supabase tables if needed...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Check if uuid-ossp extension is enabled (for uuid_generate_v4())
    const { error: extensionError } = await supabase.rpc('enable_uuid_extension');
    if (extensionError) {
      console.warn('Warning: Could not enable uuid-ossp extension. This might be already enabled or you lack permissions:', extensionError.message);
    } else {
      console.log('✅ uuid-ossp extension is enabled');
    }
    
    // Check each table
    for (const table of tables) {
      try {
        console.log(`Checking table: ${table}`);
        
        // Try to query the table to see if it exists
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error && error.code === '42P01') { // Table doesn't exist
          console.log(`❌ Table ${table} does not exist. Creating it...`);
          
          // Create the table using SQL
          const { error: createError } = await supabase.rpc('create_table', { 
            table_name: table, 
            schema: tableSchemas[table] 
          });
          
          if (createError) {
            console.error(`Failed to create table ${table}:`, createError.message);
          } else {
            console.log(`✅ Table ${table} created successfully`);
          }
        } else if (error) {
          console.error(`Error checking table ${table}:`, error.message);
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
        }
      } catch (err) {
        console.error(`Error processing table ${table}:`, err.message);
      }
    }
    
    console.log('Table check and creation process completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check and create process
checkAndCreateTables();
