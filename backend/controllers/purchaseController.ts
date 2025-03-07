import { Request, Response } from 'express';
import { Purchase } from '../models/Purchase';
import { Product } from '../models/Product';
import { Supplier } from '../models/Supplier';
import { Company } from '../models/Company';

// Gauti visus pirkimus
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Product },
        { model: Supplier },
        { model: Company }
      ]
    });
    return res.status(200).json(purchases);
  } catch (error) {
    console.error('Klaida gaunant pirkimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant pirkimus' });
  }
};

// Gauti pirkimą pagal ID
export const getPurchaseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const purchase = await Purchase.findByPk(id, {
      include: [
        { model: Product },
        { model: Supplier },
        { model: Company }
      ]
    });
    
    if (!purchase) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    return res.status(200).json(purchase);
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
    
    const purchase = await Purchase.create({
      invoiceNumber,
      productId,
      supplierId,
      quantity,
      purchaseDate,
      unitPrice,
      companyId,
      totalAmount
    });
    
    const newPurchase = await Purchase.findByPk(purchase.id, {
      include: [
        { model: Product },
        { model: Supplier },
        { model: Company }
      ]
    });
    
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
    const purchase = await Purchase.findByPk(id);
    
    if (!purchase) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    // Apskaičiuoti bendrą sumą
    const totalAmount = quantity * unitPrice;
    
    await purchase.update({
      invoiceNumber,
      productId,
      supplierId,
      quantity,
      purchaseDate,
      unitPrice,
      companyId,
      totalAmount
    });
    
    const updatedPurchase = await Purchase.findByPk(id, {
      include: [
        { model: Product },
        { model: Supplier },
        { model: Company }
      ]
    });
    
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
    const purchase = await Purchase.findByPk(id);
    
    if (!purchase) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    await purchase.destroy();
    
    return res.status(200).json({ message: 'Pirkimas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant pirkimą' });
  }
}; 