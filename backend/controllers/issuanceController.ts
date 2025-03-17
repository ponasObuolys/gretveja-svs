import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { supabase } from '../config/supabase';

// Gauti visus išdavimus
export const getAllIssuances = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('issuances')
      .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
      .order('issuance_date', { ascending: false });
    
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant išdavimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant išdavimus' });
  }
};

// Gauti išdavimą pagal ID
export const getIssuanceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('issuances')
      .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant išdavimą' });
  }
};

// Sukurti naują išdavimą
export const createIssuance = async (req: Request, res: Response) => {
  const { 
    productId, 
    isIssued, 
    issuanceDate, 
    quantity, 
    driverName, 
    truckId,
    notes
  } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('issuances')
      .insert([
        {
          product_id: productId,
          is_issued: isIssued,
          issuance_date: issuanceDate,
          quantity,
          driver_name: driverName,
          truck_id: truckId,
          notes
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Fetch the complete issuance with related data
    const { data: newIssuance, error: fetchError } = await supabase
      .from('issuances')
      .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
      .eq('id', data.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(201).json(newIssuance);
  } catch (error) {
    console.error('Klaida kuriant išdavimą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant išdavimą' });
  }
};

// Atnaujinti išdavimą
export const updateIssuance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    productId, 
    isIssued, 
    issuanceDate, 
    quantity, 
    driverName, 
    truckId,
    notes
  } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('issuances')
      .update({
        product_id: productId,
        is_issued: isIssued,
        issuance_date: issuanceDate,
        quantity,
        driver_name: driverName,
        truck_id: truckId,
        notes,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    // Fetch the complete updated issuance with related data
    const { data: updatedIssuance, error: fetchError } = await supabase
      .from('issuances')
      .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(200).json(updatedIssuance);
  } catch (error) {
    console.error(`Klaida atnaujinant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant išdavimą' });
  }
};

// Ištrinti išdavimą
export const deleteIssuance = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('issuances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Išdavimas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant išdavimą' });
  }
};

// Generuoti PDF
export const generatePdf = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data: issuance, error } = await supabase
      .from('issuances')
      .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!issuance) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    // Sukurti PDF dokumentą
    const doc = new PDFDocument();
    const filename = `issuance_${id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'pdfs', filename);
    
    // Patikrinti, ar egzistuoja katalogas, jei ne - sukurti
    if (!fs.existsSync(path.join(__dirname, '..', 'pdfs'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'pdfs'), { recursive: true });
    }
    
    // Nustatyti atsakymo antraštės
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');
    
    // Sukurti rašymo srautus
    const fileStream = fs.createWriteStream(filePath);
    doc.pipe(fileStream);
    doc.pipe(res);
    
    // PDF turinys
    doc.fontSize(20).text('Prekių perdavimo aktas', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Išdavimo data: ${new Date(issuance.issuance_date).toLocaleDateString('lt-LT')}`);
    doc.moveDown();
    
    doc.text(`Produktas: ${issuance.products.name}`);
    doc.text(`Kiekis: ${issuance.quantity} ${issuance.products.unit}`);
    doc.moveDown();
    
    doc.text(`Vairuotojas: ${issuance.driver_name}`);
    doc.text(`Vilkikas: ${issuance.trucks.plate_number}`);
    
    if (issuance.trucks.companies) {
      doc.text(`Įmonė: ${issuance.trucks.companies.name}`);
    }
    
    doc.moveDown();
    
    if (issuance.notes) {
      doc.text(`Pastabos: ${issuance.notes}`);
      doc.moveDown();
    }
    
    doc.text('Išdavė: _______________________', { align: 'left' });
    doc.moveDown();
    doc.text('Priėmė: _______________________', { align: 'left' });
    
    // Užbaigti dokumentą
    doc.end();
    
    // Grąžinti atsakymą tik kai dokumentas bus pilnai sukurtas
    fileStream.on('finish', () => {
      console.log(`PDF dokumentas sukurtas: ${filePath}`);
    });
    
  } catch (error) {
    console.error(`Klaida generuojant PDF išdavimui ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida generuojant PDF' });
  }
};