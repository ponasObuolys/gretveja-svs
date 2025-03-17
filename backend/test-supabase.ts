import { supabase } from './config/supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Check products table
    console.log('\nChecking products table:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else {
      console.log(`Found ${products.length} products:`);
      console.log(JSON.stringify(products, null, 2));
    }

    // Check trucks table
    console.log('\nChecking trucks table:');
    const { data: trucks, error: trucksError } = await supabase
      .from('trucks')
      .select('*');
    
    if (trucksError) {
      console.error('Error fetching trucks:', trucksError);
    } else {
      console.log(`Found ${trucks.length} trucks:`);
      console.log(JSON.stringify(trucks, null, 2));
    }

    // Check companies table
    console.log('\nChecking companies table:');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    
    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
    } else {
      console.log(`Found ${companies.length} companies:`);
      console.log(JSON.stringify(companies, null, 2));
    }

    // List all tables in the database
    console.log('\nListing all tables:');
    const { data: tables, error: tablesError } = await supabase
      .rpc('list_tables');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Tables in database:');
      console.log(JSON.stringify(tables, null, 2));
    }
    
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
  }
}

// Run the test
testSupabaseConnection();
