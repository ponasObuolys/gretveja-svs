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
const supabase_1 = require("../config/supabase");
const router = express_1.default.Router();
// Gauti visus produktus
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .select('*')
            .order('name');
        if (error) {
            console.error('Klaida gaunant produktus:', error);
            return res.status(500).json({ message: 'Serverio klaida gaunant produktus' });
        }
        // Jei nėra duomenų, grąžinti tuščią masyvą vietoj null
        if (!data || data.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Klaida gaunant produktus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant produktus' });
    }
}));
// Gauti konkretų produktą pagal ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Produktas nerastas' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error(`Klaida gaunant produktą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant produktą' });
    }
}));
// Sukurti naują produktą
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, nameEn, nameRu, description, unit } = req.body;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .insert([
            {
                name,
                name_en: nameEn,
                name_ru: nameRu,
                description,
                unit
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        return res.status(201).json(data);
    }
    catch (error) {
        console.error('Klaida kuriant produktą:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant produktą' });
    }
}));
// Atnaujinti produktą
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, nameEn, nameRu, description, unit } = req.body;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .update({
            name,
            name_en: nameEn,
            name_ru: nameRu,
            description,
            unit,
            updated_at: new Date()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Produktas nerastas' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error(`Klaida atnaujinant produktą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant produktą' });
    }
}));
// Ištrinti produktą
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { error } = yield supabase_1.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return res.status(200).json({ message: 'Produktas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant produktą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant produktą' });
    }
}));
exports.default = router;
