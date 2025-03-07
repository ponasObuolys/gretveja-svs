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
exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getPurchaseById = exports.getAllPurchases = void 0;
const Purchase_1 = require("../models/Purchase");
const Product_1 = require("../models/Product");
const Supplier_1 = require("../models/Supplier");
const Company_1 = require("../models/Company");
// Gauti visus pirkimus
const getAllPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield Purchase_1.Purchase.findAll({
            include: [
                { model: Product_1.Product },
                { model: Supplier_1.Supplier },
                { model: Company_1.Company }
            ]
        });
        return res.status(200).json(purchases);
    }
    catch (error) {
        console.error('Klaida gaunant pirkimus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant pirkimus' });
    }
});
exports.getAllPurchases = getAllPurchases;
// Gauti pirkimą pagal ID
const getPurchaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const purchase = yield Purchase_1.Purchase.findByPk(id, {
            include: [
                { model: Product_1.Product },
                { model: Supplier_1.Supplier },
                { model: Company_1.Company }
            ]
        });
        if (!purchase) {
            return res.status(404).json({ message: 'Pirkimas nerastas' });
        }
        return res.status(200).json(purchase);
    }
    catch (error) {
        console.error(`Klaida gaunant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant pirkimą' });
    }
});
exports.getPurchaseById = getPurchaseById;
// Sukurti naują pirkimą
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invoiceNumber, productId, supplierId, quantity, purchaseDate, unitPrice, companyId } = req.body;
    try {
        // Apskaičiuoti bendrą sumą
        const totalAmount = quantity * unitPrice;
        const purchase = yield Purchase_1.Purchase.create({
            invoiceNumber,
            productId,
            supplierId,
            quantity,
            purchaseDate,
            unitPrice,
            companyId,
            totalAmount
        });
        const newPurchase = yield Purchase_1.Purchase.findByPk(purchase.id, {
            include: [
                { model: Product_1.Product },
                { model: Supplier_1.Supplier },
                { model: Company_1.Company }
            ]
        });
        return res.status(201).json(newPurchase);
    }
    catch (error) {
        console.error('Klaida kuriant pirkimą:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant pirkimą' });
    }
});
exports.createPurchase = createPurchase;
// Atnaujinti pirkimą
const updatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { invoiceNumber, productId, supplierId, quantity, purchaseDate, unitPrice, companyId } = req.body;
    try {
        const purchase = yield Purchase_1.Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Pirkimas nerastas' });
        }
        // Apskaičiuoti bendrą sumą
        const totalAmount = quantity * unitPrice;
        yield purchase.update({
            invoiceNumber,
            productId,
            supplierId,
            quantity,
            purchaseDate,
            unitPrice,
            companyId,
            totalAmount
        });
        const updatedPurchase = yield Purchase_1.Purchase.findByPk(id, {
            include: [
                { model: Product_1.Product },
                { model: Supplier_1.Supplier },
                { model: Company_1.Company }
            ]
        });
        return res.status(200).json(updatedPurchase);
    }
    catch (error) {
        console.error(`Klaida atnaujinant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant pirkimą' });
    }
});
exports.updatePurchase = updatePurchase;
// Ištrinti pirkimą
const deletePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const purchase = yield Purchase_1.Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Pirkimas nerastas' });
        }
        yield purchase.destroy();
        return res.status(200).json({ message: 'Pirkimas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant pirkimą' });
    }
});
exports.deletePurchase = deletePurchase;
