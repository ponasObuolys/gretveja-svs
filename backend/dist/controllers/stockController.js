"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockReport = void 0;
const supabase_1 = require("../config/supabase");
// Cache mechanism to store stock report with expiration
let stockReportCache = {
    data: null,
    timestamp: 0,
    expirationMs: 5 * 60 * 1000 // 5 minutes cache
};
// Gauti atsargų ataskaitą
const getStockReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if we have a valid cache
        const now = Date.now();
        if (stockReportCache.data && (now - stockReportCache.timestamp) < stockReportCache.expirationMs) {
            console.log('Returning cached stock report');
            return res.status(200).json(stockReportCache.data);
        }
        console.log('Generating new stock report...');
        // Get all products in a single query
        const { data: products, error: productsError } = yield supabase_1.supabase
            .from('products')
            .select('id, name, unit')
            .order('name');
        if (productsError)
            throw productsError;
        // Get all purchase quantities in a single query
        const { data: purchases, error: purchasesError } = yield supabase_1.supabase
            .from('purchases')
            .select('product_id, quantity');
        if (purchasesError)
            throw purchasesError;
        // Get all issuance quantities in a single query
        const { data: issuances, error: issuancesError } = yield supabase_1.supabase
            .from('issuances')
            .select('product_id, quantity')
            .eq('is_issued', true);
        if (issuancesError)
            throw issuancesError;
        // Process the data in memory (much faster than multiple DB queries)
        const purchasesByProduct = {};
        const issuancesByProduct = {};
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
        const stockReport = products.map(product => {
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
    }
    catch (error) {
        console.error('Klaida gaunant atsargų ataskaitą:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant atsargų ataskaitą' });
    }
});
exports.getStockReport = getStockReport;
