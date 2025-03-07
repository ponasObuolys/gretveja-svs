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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Company_1 = require("../models/Company");
const router = express_1.default.Router();
// Gauti visas įmones
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield Company_1.Company.findAll();
        return res.status(200).json(companies);
    }
    catch (error) {
        console.error('Klaida gaunant įmones:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant įmones' });
    }
}));
// Gauti konkrečią įmonę pagal ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const company = yield Company_1.Company.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Įmonė nerasta' });
        }
        return res.status(200).json(company);
    }
    catch (error) {
        console.error(`Klaida gaunant įmonę ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant įmonę' });
    }
}));
// Sukurti naują įmonę
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, code, vatCode } = req.body;
    try {
        const company = yield Company_1.Company.create({
            name,
            code,
            vatCode
        });
        return res.status(201).json(company);
    }
    catch (error) {
        console.error('Klaida kuriant įmonę:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant įmonę' });
    }
}));
// Atnaujinti įmonę
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, code, vatCode } = req.body;
    try {
        const company = yield Company_1.Company.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Įmonė nerasta' });
        }
        yield company.update({
            name,
            code,
            vatCode
        });
        return res.status(200).json(company);
    }
    catch (error) {
        console.error(`Klaida atnaujinant įmonę ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant įmonę' });
    }
}));
// Ištrinti įmonę
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const company = yield Company_1.Company.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Įmonė nerasta' });
        }
        yield company.destroy();
        return res.status(200).json({ message: 'Įmonė sėkmingai ištrinta' });
    }
    catch (error) {
        console.error(`Klaida ištrinant įmonę ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant įmonę' });
    }
}));
exports.default = router;
