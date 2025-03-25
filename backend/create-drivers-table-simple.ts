import { supabase } from './config/supabase';

const createDriversTable = async () => {
  try {
    // Create the drivers table directly with SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS drivers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        driver TEXT NOT NULL,
        company_id UUID REFERENCES companies(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create RLS policies if they don't exist
      DO $$
      BEGIN
        -- Enable RLS
        ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
        
        -- Create policies if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Allow select for all users') THEN
          CREATE POLICY "Allow select for all users" ON drivers FOR SELECT USING (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Allow insert for authenticated users') THEN
          CREATE POLICY "Allow insert for authenticated users" ON drivers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Allow update for authenticated users') THEN
          CREATE POLICY "Allow update for authenticated users" ON drivers FOR UPDATE USING (auth.role() = 'authenticated');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Allow delete for authenticated users') THEN
          CREATE POLICY "Allow delete for authenticated users" ON drivers FOR DELETE USING (auth.role() = 'authenticated');
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Error creating policies: %', SQLERRM;
      END;
      $$;
    `;
    
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      throw error;
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
