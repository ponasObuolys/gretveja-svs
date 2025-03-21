-- Clear existing data from stocks table
TRUNCATE TABLE public.stocks RESTART IDENTITY;

-- Insert records for all products with default quantity
INSERT INTO public.stocks (product_id, quantity, location)
SELECT 
  id, 
  0, -- Default quantity
  'Pagrindinis sandėlys' -- Default location in Lithuanian
FROM 
  public.products;

-- Verify the data was inserted
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  s.quantity,
  s.location
FROM 
  public.stocks s
JOIN 
  public.products p ON s.product_id = p.id
ORDER BY 
  p.id;
