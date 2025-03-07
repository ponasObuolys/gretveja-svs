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
const Product_1 = require("../models/Product");
const Purchase_1 = require("../models/Purchase");
const Issuance_1 = require("../models/Issuance");
// Gauti atsargų ataskaitą
const getStockReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Gauti visus produktus
        const products = yield Product_1.Product.findAll();
        // Sukurti ataskaitos masyvą
        const stockReport = [];
        // Įtraukti kiekvieną produktą į ataskaitą
        for (const product of products) {
            // Gauti bendrą įsigytą kiekį
            const totalPurchased = yield Purchase_1.Purchase.sum('quantity', {
                where: { productId: product.id }
            });
            // Gauti bendrą išduotą kiekį
            const totalIssued = yield Issuance_1.Issuance.sum('quantity', {
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
    }
    catch (error) {
        console.error('Klaida gaunant atsargų ataskaitą:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant atsargų ataskaitą' });
    }
});
exports.getStockReport = getStockReport;
