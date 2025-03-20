// Vercel Serverless API handler
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Aplinkos kintamieji
const supabaseUrl = process.env.SUPABASE_URL || 'https://krddmfggwygganqronyl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZGRtZmdnd3lnZ2FucXJvbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjYzOTQsImV4cCI6MjA1NzgwMjM5NH0.KxAhOUSg9cSkyCo-IPCf82qN0Be7rt2L0tQDFuAtWro';

// Supabase klientas
const supabase = createClient(supabaseUrl, supabaseKey);

// Express aplikacija
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Pagrindinis maršrutas
app.get('/', (req, res) => {
  res.json({ message: 'Sveiki atvykę į Gretvėja-SVS API!' });
});

// API maršrutai
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stocks').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Klaidų apdorojimas
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Serverio klaida' });
});

// Eksportuojame Express aplikaciją
module.exports = app;
