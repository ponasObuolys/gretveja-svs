import express from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Gauti visas įmones
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant įmones:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant įmones' });
  }
});

// Gauti konkrečią įmonę pagal ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Įmonė nerasta' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant įmonę' });
  }
});

// Sukurti naują įmonę
router.post('/', async (req, res) => {
  const { name, code, vatCode } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([
        { 
          name,
          code,
          vat_code: vatCode
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Klaida kuriant įmonę:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant įmonę' });
  }
});

// Atnaujinti įmonę
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, code, vatCode } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({ 
        name,
        code,
        vat_code: vatCode,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Įmonė nerasta' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida atnaujinant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant įmonę' });
  }
});

// Ištrinti įmonę
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Įmonė sėkmingai ištrinta' });
  } catch (error) {
    console.error(`Klaida ištrinant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant įmonę' });
  }
});

export default router;