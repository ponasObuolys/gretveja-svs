import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { Issuance } from '../models/Issuance';
import { Product } from '../models/Product';
import { Truck } from '../models/Truck';
import { Company } from '../models/Company';

// Gauti visus išdavimus
export const getAllIssuances = async (req: Request, res: Response) => {
  try {
    const issuances = await Issuance.findAll({
      include: [
        { model: Product },
        { 
          model: Truck,
          include: [{ model: Company }]
        }
      ]
    });
    return res.status(200).json(issuances);
  } catch (error) {
    console.error('Klaida gaunant išdavimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant išdavimus' });
  }
};

// Gauti išdavimą pagal ID
export const getIssuanceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const issuance = await Issuance.findByPk(id, {
      include: [
        { model: Product },
        { 
          model: Truck,
          include: [{ model: Company }]
        }
      ]
    });
    
    if (!issuance) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    return res.status(200).json(issuance);
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
    const issuance = await Issuance.create({
      productId,
      isIssued,
      issuanceDate,
      quantity,
      driverName,
      truckId,
      notes
    });
    
    const newIssuance = await Issuance.findByPk(issuance.id, {
      include: [
        { model: Product },
        { 
          model: Truck,
          include: [{ model: Company }]
        }
      ]
    });
    
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
    const issuance = await Issuance.findByPk(id);
    
    if (!issuance) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    await issuance.update({
      productId,
      isIssued,
      issuanceDate,
      quantity,
      driverName,
      truckId,
      notes
    });
    
    const updatedIssuance = await Issuance.findByPk(id, {
      include: [
        { model: Product },
        { 
          model: Truck,
          include: [{ model: Company }]
        }
      ]
    });
    
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
    const issuance = await Issuance.findByPk(id);
    
    if (!issuance) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    await issuance.destroy();
    
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
    const issuance = await Issuance.findByPk(id, {
      include: [
        { model: Product },
        { 
          model: Truck,
          include: [{ model: Company }]
        }
      ]
    });
    
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
    
    const issuanceDate = new Date(issuance.issuanceDate).toLocaleDateString('lt-LT');
    
    doc.fontSize(12).text(`Data: ${issuanceDate}`);
    doc.moveDown();
    
    doc.text(`Produktas: ${issuance.product?.name || 'Nenurodyta'}`);
    doc.text(`Kiekis: ${issuance.quantity} vnt.`);
    doc.text(`Vairuotojas: ${issuance.driverName}`);
    doc.text(`Vilkikas: ${issuance.truck?.plateNumber || 'Nenurodyta'}`);
    doc.text(`Įmonė: ${issuance.truck?.company?.name || 'Nenurodyta'}`);
    if (issuance.notes) {
      doc.text(`Pastabos: ${issuance.notes}`);
    }
    
    doc.moveDown(2);
    
    // Parašai
    doc.text('Perdavė: ____________________');
    doc.moveDown();
    doc.text('Priėmė: ____________________');
    
    // Užbaigti dokumentą
    doc.end();
    
    fileStream.on('finish', () => {
      console.log(`PDF sukurtas: ${filePath}`);
    });
    
  } catch (error) {
    console.error(`Klaida generuojant PDF išdavimui ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida generuojant PDF' });
  }
}; 