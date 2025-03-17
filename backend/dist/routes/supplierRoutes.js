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
// Gauti visus tiekėjus
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .select('*')
            .order('name');
        if (error) {
            console.error('Klaida gaunant tiekėjus:', error);
            return res.status(500).json({ message: 'Serverio klaida gaunant tiekėjus' });
        }
        // Jei nėra duomenų, grąžinti tuščią masyvą vietoj null
        if (!data || data.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(data);
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
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Tiekėjas nerastas' });
        }
        return res.status(200).json(data);
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
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .insert([
            {
                name,
                contact_person: contactPerson,
                phone,
                email
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        return res.status(201).json(data);
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
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .update({
            name,
            contact_person: contactPerson,
            phone,
            email,
            updated_at: new Date()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Tiekėjas nerastas' });
        }
        return res.status(200).json(data);
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
        const { error } = yield supabase_1.supabase
            .from('suppliers')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return res.status(200).json({ message: 'Tiekėjas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant tiekėją ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant tiekėją' });
    }
}));
exports.default = router;
