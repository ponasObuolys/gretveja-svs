-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stocks table if it doesn't exist
DO $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'stocks'
  ) THEN
    -- Create stocks table
    CREATE TABLE public.stocks (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES public.products(id),
      quantity INTEGER NOT NULL DEFAULT 0,
      location VARCHAR(100),
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add RLS policies
    ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for read access
    CREATE POLICY "Allow read access for all users" 
      ON public.stocks FOR SELECT 
      USING (true);
      
    -- Create policy for insert/update/delete
    CREATE POLICY "Allow full access for authenticated users" 
      ON public.stocks FOR ALL 
      USING (auth.role() = 'authenticated');
      
    -- Add some sample data (assuming products table exists with data)
    INSERT INTO public.stocks (product_id, quantity, location)
    SELECT id, 100, 'Warehouse A'
    FROM public.products
    LIMIT 3;
    
    RAISE NOTICE 'Stocks table created successfully';
  ELSE
    RAISE NOTICE 'Stocks table already exists';
  END IF;
END;
$$;
