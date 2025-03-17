import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Gauti visus produktus
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Klaida gaunant produktus:', error);
      return res.status(500).json({ message: 'Serverio klaida gaunant produktus' });
    }
    
    // Jei nėra duomenų, grąžinti tuščią masyvą
    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant produktus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant produktus' });
  }
};

// Gauti konkretų produktą pagal ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Klaida gaunant produktą ID ${id}:`, error);
      return res.status(500).json({ message: 'Serverio klaida gaunant produktą' });
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant produktą' });
  }
};

// Sukurti naują produktą
export const createProduct = async (req: Request, res: Response) => {
  const { name, nameEn, nameRu, description, unit } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          name_en: nameEn, 
          name_ru: nameRu, 
          description, 
          unit 
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Klaida kuriant produktą:', error);
      return res.status(500).json({ message: 'Serverio klaida kuriant produktą' });
    }
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Klaida kuriant produktą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant produktą' });
  }
};

// Atnaujinti produktą
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, nameEn, nameRu, description, unit } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        name, 
        name_en: nameEn, 
        name_ru: nameRu, 
        description, 
        unit,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Klaida atnaujinant produktą ID ${id}:`, error);
      return res.status(500).json({ message: 'Serverio klaida atnaujinant produktą' });
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida atnaujinant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant produktą' });
  }
};

// Ištrinti produktą
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Klaida ištrinant produktą ID ${id}:`, error);
      return res.status(500).json({ message: 'Serverio klaida ištrinant produktą' });
    }
    
    return res.status(200).json({ message: 'Produktas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant produktą' });
  }
};
