import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Gauti visus vilkikus
export const getAllTrucks = async (req: Request, res: Response) => {
  try {
    const includeCompany = req.query.include === 'company';
    
    let query;
      
    if (includeCompany) {
      query = supabase
        .from('trucks')
        .select(`
          *,
          companies (id, name)
        `)
        .order('plate_number');
    } else {
      query = supabase
        .from('trucks')
        .select('*')
        .order('plate_number');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Klaida gaunant vilkikus:', error);
    res.status(500).json({ message: 'Serverio klaida gaunant vilkikus' });
  }
};

// Gauti vilkiką pagal ID
export const getTruckById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('trucks')
      .select(`
        *,
        companies (id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Vilkikas nerastas' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Klaida gaunant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida gaunant vilkiką' });
  }
};

// Sukurti naują vilkiką
export const createTruck = async (req: Request, res: Response) => {
  try {
    const { plate_number, company_id } = req.body;
    
    const { data, error } = await supabase
      .from('trucks')
      .insert([
        { 
          plate_number,
          company_id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Klaida kuriant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida kuriant vilkiką' });
  }
};

// Atnaujinti vilkiką
export const updateTruck = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plate_number, company_id } = req.body;
    
    const { data, error } = await supabase
      .from('trucks')
      .update({ 
        plate_number,
        company_id,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Vilkikas nerastas' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Klaida atnaujinant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida atnaujinant vilkiką' });
  }
};

// Ištrinti vilkiką
export const deleteTruck = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Klaida ištrinant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida ištrinant vilkiką' });
  }
};