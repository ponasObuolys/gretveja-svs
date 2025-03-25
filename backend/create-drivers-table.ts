import { supabase } from './config/supabase';

const createDriversTable = async () => {
  try {
    // Check if the table already exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'drivers');
    
    if (checkError) {
      throw checkError;
    }
    
    // If the table already exists, don't recreate it
    if (existingTables && existingTables.length > 0) {
      console.log('Drivers table already exists');
      return;
    }
    
    // Create the drivers table
    const { error: createError } = await supabase.rpc('create_drivers_table');
    
    if (createError) {
      throw createError;
    }
    
    console.log('Drivers table created successfully');
    
    // Create the stored procedure for creating the drivers table
    const createTableProcedure = `
      CREATE OR REPLACE FUNCTION create_drivers_table()
      RETURNS void
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create drivers table
        CREATE TABLE IF NOT EXISTS drivers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          driver TEXT NOT NULL,
          company_id UUID REFERENCES companies(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create RLS policies
        ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for select
        CREATE POLICY "Allow select for all users" 
          ON drivers FOR SELECT 
          USING (true);
        
        -- Create policy for insert
        CREATE POLICY "Allow insert for authenticated users" 
          ON drivers FOR INSERT 
          WITH CHECK (auth.role() = 'authenticated');
        
        -- Create policy for update
        CREATE POLICY "Allow update for authenticated users" 
          ON drivers FOR UPDATE 
          USING (auth.role() = 'authenticated');
        
        -- Create policy for delete
        CREATE POLICY "Allow delete for authenticated users" 
          ON drivers FOR DELETE 
          USING (auth.role() = 'authenticated');
      END;
      $$;
    `;
    
    // Execute the stored procedure creation
    const { error: procedureError } = await supabase.rpc('exec_sql', { sql: createTableProcedure });
    
    if (procedureError) {
      throw procedureError;
    }
    
    console.log('Create drivers table procedure created successfully');
    
    // Now execute the procedure to create the table
    const { error: execError } = await supabase.rpc('create_drivers_table');
    
    if (execError) {
      throw execError;
    }
    
    console.log('Drivers table created successfully');
    
  } catch (error) {
    console.error('Error creating drivers table:', error);
  }
};

// Run the function
createDriversTable()
  .then(() => {
    console.log('Finished creating drivers table');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in create-drivers-table script:', error);
    process.exit(1);
  });
