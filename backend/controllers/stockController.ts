import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Define interfaces for type safety
interface StockReportItem {
  productId: number;
  productName: string;
  totalPurchased: number;
  totalIssued: number;
  stockInHand: number;
  unit: string;
}

interface StockCache {
  data: StockReportItem[] | null;
  timestamp: number;
  expirationMs: number;
}

// Cache mechanism to store stock report with expiration
let stockReportCache: StockCache = {
  data: null,
  timestamp: 0,
  expirationMs: 5 * 60 * 1000 // 5 minutes cache
};

// Gauti atsargų ataskaitą
export const getStockReport = async (req: Request, res: Response) => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (stockReportCache.data && (now - stockReportCache.timestamp) < stockReportCache.expirationMs) {
      console.log('Returning cached stock report');
      return res.status(200).json(stockReportCache.data);
    }

    console.log('Generating new stock report...');
    
    // Get all products in a single query
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, unit')
      .order('name');
    
    if (productsError) throw productsError;
    
    // Get all purchase quantities in a single query
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('product_id, quantity');
    
    if (purchasesError) throw purchasesError;
    
    // Get all issuance quantities in a single query
    const { data: issuances, error: issuancesError } = await supabase
      .from('issuances')
      .select('product_id, quantity')
      .eq('is_issued', true);
    
    if (issuancesError) throw issuancesError;
    
    // Process the data in memory (much faster than multiple DB queries)
    const purchasesByProduct: Record<number, number> = {};
    const issuancesByProduct: Record<number, number> = {};
    
    // Group purchases by product_id
    purchases.forEach(purchase => {
      const productId = purchase.product_id;
      if (!purchasesByProduct[productId]) {
        purchasesByProduct[productId] = 0;
      }
      purchasesByProduct[productId] += (purchase.quantity || 0);
    });
    
    // Group issuances by product_id
    issuances.forEach(issuance => {
      const productId = issuance.product_id;
      if (!issuancesByProduct[productId]) {
        issuancesByProduct[productId] = 0;
      }
      issuancesByProduct[productId] += (issuance.quantity || 0);
    });
    
    // Create the stock report
    const stockReport: StockReportItem[] = products.map(product => {
      const totalPurchased = purchasesByProduct[product.id] || 0;
      const totalIssued = issuancesByProduct[product.id] || 0;
      const stockInHand = totalPurchased - totalIssued;
      
      return {
        productId: product.id,
        productName: product.name,
        totalPurchased,
        totalIssued,
        stockInHand,
        unit: product.unit || 'vnt.'
      };
    });
    
    // Update cache
    stockReportCache = {
      data: stockReport,
      timestamp: now,
      expirationMs: 5 * 60 * 1000
    };
    
    return res.status(200).json(stockReport);
  } catch (error) {
    console.error('Klaida gaunant atsargų ataskaitą:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant atsargų ataskaitą' });
  }
};