import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Gauti atsargų ataskaitą
export const getStockReport = async (req: Request, res: Response) => {
  try {
    // Gauti visus produktus
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (productsError) throw productsError;
    
    // Sukurti ataskaitos masyvą
    const stockReport = [];
    
    // Įtraukti kiekvieną produktą į ataskaitą
    for (const product of products) {
      // Gauti bendrą įsigytą kiekį
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('quantity')
        .eq('product_id', product.id);
      
      if (purchasesError) throw purchasesError;
      
      const totalPurchased = purchasesData.reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      // Gauti bendrą išduotą kiekį
      const { data: issuancesData, error: issuancesError } = await supabase
        .from('issuances')
        .select('quantity')
        .eq('product_id', product.id)
        .eq('is_issued', true);
      
      if (issuancesError) throw issuancesError;
      
      const totalIssued = issuancesData.reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      // Apskaičiuoti likusias atsargas
      const stockInHand = totalPurchased - totalIssued;
      
      // Pridėti į ataskaitą
      stockReport.push({
        productId: product.id,
        productName: product.name,
        totalPurchased: totalPurchased,
        totalIssued: totalIssued,
        stockInHand: stockInHand,
        unit: product.unit
      });
    }
    
    return res.status(200).json(stockReport);
  } catch (error) {
    console.error('Klaida gaunant atsargų ataskaitą:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant atsargų ataskaitą' });
  }
};