"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const truckController_1 = require("../controllers/truckController");
const router = express_1.default.Router();
// Gauti visus vilkikus
router.get('/', truckController_1.getAllTrucks);
// Gauti vilkiką pagal ID
router.get('/:id', truckController_1.getTruckById);
// Sukurti naują vilkiką
router.post('/', truckController_1.createTruck);
// Atnaujinti vilkiką
router.put('/:id', truckController_1.updateTruck);
// Ištrinti vilkiką
router.delete('/:id', truckController_1.deleteTruck);
exports.default = router;
