"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = exports.deleteIssuance = exports.updateIssuance = exports.createIssuance = exports.getIssuanceById = exports.getAllIssuances = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const Issuance_1 = require("../models/Issuance");
const Product_1 = require("../models/Product");
const Truck_1 = require("../models/Truck");
const Company_1 = require("../models/Company");
// Gauti visus išdavimus
const getAllIssuances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issuances = yield Issuance_1.Issuance.findAll({
            include: [
                { model: Product_1.Product },
                {
                    model: Truck_1.Truck,
                    include: [{ model: Company_1.Company }]
                }
            ]
        });
        return res.status(200).json(issuances);
    }
    catch (error) {
        console.error('Klaida gaunant išdavimus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant išdavimus' });
    }
});
exports.getAllIssuances = getAllIssuances;
// Gauti išdavimą pagal ID
const getIssuanceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const issuance = yield Issuance_1.Issuance.findByPk(id, {
            include: [
                { model: Product_1.Product },
                {
                    model: Truck_1.Truck,
                    include: [{ model: Company_1.Company }]
                }
            ]
        });
        if (!issuance) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        return res.status(200).json(issuance);
    }
    catch (error) {
        console.error(`Klaida gaunant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant išdavimą' });
    }
});
exports.getIssuanceById = getIssuanceById;
// Sukurti naują išdavimą
const createIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, isIssued, issuanceDate, quantity, driverName, truckId, notes } = req.body;
    try {
        const issuance = yield Issuance_1.Issuance.create({
            productId,
            isIssued,
            issuanceDate,
            quantity,
            driverName,
            truckId,
            notes
        });
        const newIssuance = yield Issuance_1.Issuance.findByPk(issuance.id, {
            include: [
                { model: Product_1.Product },
                {
                    model: Truck_1.Truck,
                    include: [{ model: Company_1.Company }]
                }
            ]
        });
        return res.status(201).json(newIssuance);
    }
    catch (error) {
        console.error('Klaida kuriant išdavimą:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant išdavimą' });
    }
});
exports.createIssuance = createIssuance;
// Atnaujinti išdavimą
const updateIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productId, isIssued, issuanceDate, quantity, driverName, truckId, notes } = req.body;
    try {
        const issuance = yield Issuance_1.Issuance.findByPk(id);
        if (!issuance) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        yield issuance.update({
            productId,
            isIssued,
            issuanceDate,
            quantity,
            driverName,
            truckId,
            notes
        });
        const updatedIssuance = yield Issuance_1.Issuance.findByPk(id, {
            include: [
                { model: Product_1.Product },
                {
                    model: Truck_1.Truck,
                    include: [{ model: Company_1.Company }]
                }
            ]
        });
        return res.status(200).json(updatedIssuance);
    }
    catch (error) {
        console.error(`Klaida atnaujinant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant išdavimą' });
    }
});
exports.updateIssuance = updateIssuance;
// Ištrinti išdavimą
const deleteIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const issuance = yield Issuance_1.Issuance.findByPk(id);
        if (!issuance) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        yield issuance.destroy();
        return res.status(200).json({ message: 'Išdavimas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant išdavimą' });
    }
});
exports.deleteIssuance = deleteIssuance;
// Generuoti PDF
const generatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { id } = req.params;
    try {
        const issuance = yield Issuance_1.Issuance.findByPk(id, {
            include: [
                { model: Product_1.Product },
                {
                    model: Truck_1.Truck,
                    include: [{ model: Company_1.Company }]
                }
            ]
        });
        if (!issuance) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        // Sukurti PDF dokumentą
        const doc = new pdfkit_1.default();
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
        doc.text(`Produktas: ${((_a = issuance.product) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta'}`);
        doc.text(`Kiekis: ${issuance.quantity} vnt.`);
        doc.text(`Vairuotojas: ${issuance.driverName}`);
        doc.text(`Vilkikas: ${((_b = issuance.truck) === null || _b === void 0 ? void 0 : _b.plateNumber) || 'Nenurodyta'}`);
        doc.text(`Įmonė: ${((_d = (_c = issuance.truck) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.name) || 'Nenurodyta'}`);
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
    }
    catch (error) {
        console.error(`Klaida generuojant PDF išdavimui ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida generuojant PDF' });
    }
});
exports.generatePdf = generatePdf;
