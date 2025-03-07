import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Product } from '../models/Product';
import { Purchase } from '../models/Purchase';
import { Issuance } from '../models/Issuance';

// Gauti atsargų ataskaitą
export const getStockReport = async (req: Request, res: Response) => {
  try {
    // Gauti visus produktus
    const products = await Product.findAll();
    
    // Sukurti ataskaitos masyvą
    const stockReport = [];
    
    // Įtraukti kiekvieną produktą į ataskaitą
    for (const product of products) {
      // Gauti bendrą įsigytą kiekį
      const totalPurchased = await Purchase.sum('quantity', {
        where: { productId: product.id }
      });
      
      // Gauti bendrą išduotą kiekį
      const totalIssued = await Issuance.sum('quantity', {
        where: { 
          productId: product.id,
          isIssued: true
        }
      });
      
      // Apskaičiuoti likusias atsargas
      const stockInHand = (totalPurchased || 0) - (totalIssued || 0);
      
      // Pridėti į ataskaitą
      stockReport.push({
        productId: product.id,
        productName: product.name,
        totalPurchased: totalPurchased || 0,
        totalIssued: totalIssued || 0,
        stockInHand: stockInHand
      });
    }
    
    return res.status(200).json(stockReport);
  } catch (error) {
    console.error('Klaida gaunant atsargų ataskaitą:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant atsargų ataskaitą' });
  }
}; 