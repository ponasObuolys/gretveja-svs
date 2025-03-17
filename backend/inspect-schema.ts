import { supabase } from './config/supabase';

async function inspectSchema() {
  console.log('Inspecting Supabase database schema...');

  try {
    // Get schema information for products table
    console.log('\nInspecting products table:');
    const { data: productsInfo, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(0);
    
    if (productsError) {
      console.error('Error inspecting products table:', productsError);
    } else {
      // This will show column names from the response structure
      console.log('Products table columns:', Object.keys(productsInfo?.length ? productsInfo[0] : {}));
      
      // Try to get column information directly
      const { data: productsColumns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'products' })
        .select('*');
      
      if (columnsError) {
        console.log('Could not get detailed column info:', columnsError.message);
      } else {
        console.log('Detailed column info:', productsColumns);
      }
    }

    // Get schema information for companies table
    console.log('\nInspecting companies table:');
    const { data: companiesInfo, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(0);
    
    if (companiesError) {
      console.error('Error inspecting companies table:', companiesError);
    } else {
      console.log('Companies table columns:', Object.keys(companiesInfo?.length ? companiesInfo[0] : {}));
    }

    // Get schema information for trucks table
    console.log('\nInspecting trucks table:');
    const { data: trucksInfo, error: trucksError } = await supabase
      .from('trucks')
      .select('*')
      .limit(0);
    
    if (trucksError) {
      console.error('Error inspecting trucks table:', trucksError);
    } else {
      console.log('Trucks table columns:', Object.keys(trucksInfo?.length ? trucksInfo[0] : {}));
    }

    // Try to get RLS policies information
    console.log('\nChecking RLS policies:');
    const { data: rlsPolicies, error: rlsError } = await supabase
      .rpc('get_policies')
      .select('*');
    
    if (rlsError) {
      console.log('Could not get RLS policies:', rlsError.message);
      
      // Alternative: try a simple query to check if we can read from the table
      console.log('Checking if we can read from trucks table:');
      const { data: trucksRead, error: readError } = await supabase
        .from('trucks')
        .select('*')
        .limit(1);
      
      if (readError) {
        console.log('Error reading from trucks:', readError.message);
      } else {
        console.log('Can read from trucks table:', trucksRead);
      }
    } else {
      console.log('RLS policies:', rlsPolicies);
    }

  } catch (err) {
    console.error('Error during schema inspection:', err);
  }
}

// Run the inspection
inspectSchema();
