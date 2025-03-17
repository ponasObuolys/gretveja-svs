import { supabase } from './config/supabase';

async function testSupabaseTables() {
  console.log('Testing Supabase tables for products and suppliers...');
  
  try {
    // Check products table
    console.log('\nChecking products table:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else {
      console.log(`Found ${products.length} products`);
      console.log('Sample product:', products[0]);
      
      // Check table structure
      console.log('\nProducts table structure:');
      const { data: productsColumns, error: productsColumnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'products' });
      
      if (productsColumnsError) {
        console.error('Error fetching products table structure:', productsColumnsError);
      } else {
        console.log('Products columns:', productsColumns);
      }
    }

    // Check suppliers table
    console.log('\nChecking suppliers table:');
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('*')
      .limit(5);
    
    if (suppliersError) {
      console.error('Error fetching suppliers:', suppliersError);
    } else {
      console.log(`Found ${suppliers.length} suppliers`);
      console.log('Sample supplier:', suppliers[0]);
      
      // Check table structure
      console.log('\nSuppliers table structure:');
      const { data: suppliersColumns, error: suppliersColumnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'suppliers' });
      
      if (suppliersColumnsError) {
        console.error('Error fetching suppliers table structure:', suppliersColumnsError);
      } else {
        console.log('Suppliers columns:', suppliersColumns);
      }
    }
    
  } catch (err) {
    console.error('Error testing Supabase tables:', err);
  }
}

// Run the test
testSupabaseTables();
