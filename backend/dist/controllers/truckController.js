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
const Truck_1 = require("../models/Truck");
const Company_1 = require("../models/Company");
// Gauti visus vilkikus
const getAllTrucks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const include = req.query.include === 'company' ? [Company_1.Company] : [];
        const trucks = yield Truck_1.Truck.findAll({
            include,
            order: [['plateNumber', 'ASC']]
        });
        res.json(trucks);
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
        const truck = yield Truck_1.Truck.findByPk(id, {
            include: [Company_1.Company]
        });
        if (!truck) {
            return res.status(404).json({ message: 'Vilkikas nerastas' });
        }
        res.json(truck);
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
        const { plateNumber, model, companyId } = req.body;
        const truck = yield Truck_1.Truck.create({
            plateNumber,
            model,
            companyId
        });
        res.status(201).json(truck);
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
        const { plateNumber, model, companyId } = req.body;
        const truck = yield Truck_1.Truck.findByPk(id);
        if (!truck) {
            return res.status(404).json({ message: 'Vilkikas nerastas' });
        }
        yield truck.update({
            plateNumber,
            model,
            companyId
        });
        res.json(truck);
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
        const truck = yield Truck_1.Truck.findByPk(id);
        if (!truck) {
            return res.status(404).json({ message: 'Vilkikas nerastas' });
        }
        yield truck.destroy();
        res.status(204).send();
    }
    catch (error) {
        console.error('Klaida ištrinant vilkiką:', error);
        res.status(500).json({ message: 'Serverio klaida ištrinant vilkiką' });
    }
});
exports.deleteTruck = deleteTruck;
