// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase klientas
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('Using URL:', supabaseUrl);
    
    const { data, error } = await supabase.from('products').select('count');
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
