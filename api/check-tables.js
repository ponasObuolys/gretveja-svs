// Script to check Supabase tables
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase klientas
const supabase = createClient(supabaseUrl, supabaseKey);

// Tables to check
const tables = [
  'products',
  'suppliers',
  'stocks',
  'purchases',
  'issuances',
  'companies',
  'trucks'
];

async function checkTables() {
  console.log('Checking Supabase tables...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Get list of all tables from Supabase
    const { data: tableList, error: tableError } = await supabase
      .from('_metadata')
      .select('table_name')
      .execute();
    
    if (tableError) {
      console.error('Error fetching table list:', tableError);
      
      // Try a different approach - check each table individually
      console.log('Trying to check each table individually...');
      
      for (const table of tables) {
        try {
          console.log(`Checking table: ${table}`);
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (error) {
            console.error(`❌ Table ${table} error:`, error.message);
          } else {
            console.log(`✅ Table ${table} exists and is accessible`);
          }
        } catch (err) {
          console.error(`❌ Error checking table ${table}:`, err.message);
        }
      }
      return;
    }
    
    console.log('Available tables in Supabase:', tableList);
    
    // Check each required table
    for (const table of tables) {
      if (tableList.some(t => t.table_name === table)) {
        console.log(`✅ Table ${table} exists`);
        
        // Try to fetch a record to verify access
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Cannot access table ${table}:`, error.message);
        } else {
          console.log(`✅ Successfully accessed table ${table}, found ${data.length} records`);
        }
      } else {
        console.error(`❌ Table ${table} does not exist in the database`);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkTables();
