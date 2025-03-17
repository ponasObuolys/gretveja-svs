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
exports.deleteTruck = exports.updateTruck = exports.createTruck = exports.getTruckById = exports.getAllTrucks = void 0;
const supabase_1 = require("../config/supabase");
// Gauti visus vilkikus
const getAllTrucks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const includeCompany = req.query.include === 'company';
        let query;
        if (includeCompany) {
            query = supabase_1.supabase
                .from('trucks')
                .select(`
          *,
          companies (id, name)
        `)
                .order('plate_number');
        }
        else {
            query = supabase_1.supabase
                .from('trucks')
                .select('*')
                .order('plate_number');
        }
        const { data, error } = yield query;
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Klaida gaunant vilkikus:', error);
        res.status(500).json({ message: 'Serverio klaida gaunant vilkikus' });
    }
});
exports.getAllTrucks = getAllTrucks;
// Gauti vilkiką pagal ID
const getTruckById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('trucks')
            .select(`
        *,
        companies (id, name)
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Vilkikas nerastas' });
        }
        res.json(data);
    }
    catch (error) {
        console.error('Klaida gaunant vilkiką:', error);
        res.status(500).json({ message: 'Serverio klaida gaunant vilkiką' });
    }
});
exports.getTruckById = getTruckById;
// Sukurti naują vilkiką
const createTruck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { plate_number, company_id } = req.body;
        const { data, error } = yield supabase_1.supabase
            .from('trucks')
            .insert([
            {
                plate_number,
                company_id
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Klaida kuriant vilkiką:', error);
        res.status(500).json({ message: 'Serverio klaida kuriant vilkiką' });
    }
});
exports.createTruck = createTruck;
// Atnaujinti vilkiką
const updateTruck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { plate_number, company_id } = req.body;
        const { data, error } = yield supabase_1.supabase
            .from('trucks')
            .update({
            plate_number,
            company_id,
            updated_at: new Date()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Vilkikas nerastas' });
        }
        res.json(data);
    }
    catch (error) {
        console.error('Klaida atnaujinant vilkiką:', error);
        res.status(500).json({ message: 'Serverio klaida atnaujinant vilkiką' });
    }
});
exports.updateTruck = updateTruck;
// Ištrinti vilkiką
const deleteTruck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = yield supabase_1.supabase
            .from('trucks')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        console.error('Klaida ištrinant vilkiką:', error);
        res.status(500).json({ message: 'Serverio klaida ištrinant vilkiką' });
    }
});
exports.deleteTruck = deleteTruck;
