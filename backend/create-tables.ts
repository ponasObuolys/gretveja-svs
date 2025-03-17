import { supabase } from './config/supabase';

async function createTables() {
  console.log('Creating tables in Supabase...');

  try {
    // Create products table
    console.log('\nCreating products table...');
    const { error: productsError } = await supabase.rpc('create_products_table');
    
    if (productsError) {
      console.error('Error creating products table:', productsError);
      
      // Try SQL query directly if RPC doesn't work
      console.log('Trying SQL query directly...');
      const { error: sqlError } = await supabase.from('products').insert({
        name: 'Test Product',
        unit: 'kg'
      });
      
      if (sqlError) {
        console.error('Error with direct SQL:', sqlError);
        console.log('Column error details:', sqlError.message);
      } else {
        console.log('Successfully inserted test product!');
      }
    } else {
      console.log('Products table created successfully');
    }

    // Try to get all tables in the database
    console.log('\nListing all tables in the database...');
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error('Error listing tables:', error);
    } else {
      console.log('Tables in database:', data);
    }

  } catch (err) {
    console.error('Error during table creation:', err);
  }
}

// Run the table creation
createTables();
