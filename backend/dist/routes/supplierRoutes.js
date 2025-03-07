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
const Supplier_1 = require("../models/Supplier");
const router = express_1.default.Router();
// Gauti visus tiekėjus
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield Supplier_1.Supplier.findAll();
        return res.status(200).json(suppliers);
    }
    catch (error) {
        console.error('Klaida gaunant tiekėjus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant tiekėjus' });
    }
}));
// Gauti konkretų tiekėją pagal ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const supplier = yield Supplier_1.Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tiekėjas nerastas' });
        }
        return res.status(200).json(supplier);
    }
    catch (error) {
        console.error(`Klaida gaunant tiekėją ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant tiekėją' });
    }
}));
// Sukurti naują tiekėją
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, contactPerson, phone, email } = req.body;
    try {
        const supplier = yield Supplier_1.Supplier.create({
            name,
            contactPerson,
            phone,
            email
        });
        return res.status(201).json(supplier);
    }
    catch (error) {
        console.error('Klaida kuriant tiekėją:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant tiekėją' });
    }
}));
// Atnaujinti tiekėją
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, contactPerson, phone, email } = req.body;
    try {
        const supplier = yield Supplier_1.Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tiekėjas nerastas' });
        }
        yield supplier.update({
            name,
            contactPerson,
            phone,
            email
        });
        return res.status(200).json(supplier);
    }
    catch (error) {
        console.error(`Klaida atnaujinant tiekėją ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant tiekėją' });
    }
}));
// Ištrinti tiekėją
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const supplier = yield Supplier_1.Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tiekėjas nerastas' });
        }
        yield supplier.destroy();
        return res.status(200).json({ message: 'Tiekėjas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant tiekėją ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant tiekėją' });
    }
}));
exports.default = router;
