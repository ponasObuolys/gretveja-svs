import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Gauti visus pirkimus
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .order('purchase_date', { ascending: false });
    
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant pirkimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant pirkimus' });
  }
};

// Gauti pirkimą pagal ID
export const getPurchaseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant pirkimą' });
  }
};

// Sukurti naują pirkimą
export const createPurchase = async (req: Request, res: Response) => {
  const { 
    invoiceNumber, 
    productId, 
    supplierId, 
    quantity, 
    purchaseDate, 
    unitPrice, 
    companyId 
  } = req.body;
  
  try {
    // Apskaičiuoti bendrą sumą
    const totalAmount = quantity * unitPrice;
    
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          invoice_number: invoiceNumber,
          product_id: productId,
          supplier_id: supplierId,
          quantity,
          purchase_date: purchaseDate,
          unit_price: unitPrice,
          company_id: companyId,
          total_amount: totalAmount
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Fetch the complete purchase with related data
    const { data: newPurchase, error: fetchError } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', data.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Klaida kuriant pirkimą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant pirkimą' });
  }
};

// Atnaujinti pirkimą
export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    invoiceNumber, 
    productId, 
    supplierId, 
    quantity, 
    purchaseDate, 
    unitPrice, 
    companyId 
  } = req.body;
  
  try {
    // Apskaičiuoti bendrą sumą
    const totalAmount = quantity * unitPrice;
    
    const { data, error } = await supabase
      .from('purchases')
      .update({
        invoice_number: invoiceNumber,
        product_id: productId,
        supplier_id: supplierId,
        quantity,
        purchase_date: purchaseDate,
        unit_price: unitPrice,
        company_id: companyId,
        total_amount: totalAmount,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    // Fetch the complete updated purchase with related data
    const { data: updatedPurchase, error: fetchError } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(200).json(updatedPurchase);
  } catch (error) {
    console.error(`Klaida atnaujinant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant pirkimą' });
  }
};

// Ištrinti pirkimą
export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Pirkimas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant pirkimą' });
  }
};