import express from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Gauti visus tiekėjus
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant tiekėjus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant tiekėjus' });
  }
});

// Gauti konkretų tiekėją pagal ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Tiekėjas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant tiekėją' });
  }
});

// Sukurti naują tiekėją
router.post('/', async (req, res) => {
  const { name, contactPerson, phone, email } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([
        { 
          name,
          contact_person: contactPerson,
          phone,
          email
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Klaida kuriant tiekėją:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant tiekėją' });
  }
});

// Atnaujinti tiekėją
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, phone, email } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .update({ 
        name,
        contact_person: contactPerson,
        phone,
        email,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Tiekėjas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida atnaujinant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant tiekėją' });
  }
});

// Ištrinti tiekėją
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Tiekėjas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant tiekėją' });
  }
});

export default router;