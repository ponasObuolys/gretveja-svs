import { supabase } from './config/supabase';

// Sample data for initial population
const sampleProducts = [
  { name: 'Obuoliai', unit: 'kg', price: 1.99 },
  { name: 'Kriaušės', unit: 'kg', price: 2.49 },
  { name: 'Bulvės', unit: 'kg', price: 0.99 },
  { name: 'Morkos', unit: 'kg', price: 1.29 },
  { name: 'Svogūnai', unit: 'kg', price: 1.19 }
];

const sampleCompanies = [
  { name: 'UAB "Vaisių Sodai"', address: 'Sodų g. 123, Vilnius', phone: '+37061234567' },
  { name: 'UAB "Daržovių Laukai"', address: 'Laukų g. 45, Kaunas', phone: '+37062345678' },
  { name: 'UAB "Žemės Ūkis"', address: 'Ūkio g. 78, Klaipėda', phone: '+37063456789' }
];

const sampleTrucks = [
  { plate_number: 'ABC123', company_id: 1 },
  { plate_number: 'DEF456', company_id: 2 },
  { plate_number: 'GHI789', company_id: 3 },
  { plate_number: 'JKL012', company_id: 1 }
];

async function migrateData() {
  console.log('Starting data migration to Supabase...');

  try {
    // Insert products
    console.log('Inserting products...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();
    
    if (productsError) {
      console.error('Error inserting products:', productsError);
    } else {
      console.log(`Successfully inserted ${productsData.length} products`);
    }

    // Insert companies
    console.log('Inserting companies...');
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .insert(sampleCompanies)
      .select();
    
    if (companiesError) {
      console.error('Error inserting companies:', companiesError);
    } else {
      console.log(`Successfully inserted ${companiesData.length} companies`);
    }

    // Insert trucks
    console.log('Inserting trucks...');
    const { data: trucksData, error: trucksError } = await supabase
      .from('trucks')
      .insert(sampleTrucks)
      .select();
    
    if (trucksError) {
      console.error('Error inserting trucks:', trucksError);
    } else {
      console.log(`Successfully inserted ${trucksData.length} trucks`);
    }

    console.log('Data migration completed successfully!');
  } catch (err) {
    console.error('Error during data migration:', err);
  }
}

// Run the migration
migrateData();
