"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseController_1 = require("../controllers/purchaseController");
const router = express_1.default.Router();
// Gauti visus pirkimus
router.get('/', purchaseController_1.getAllPurchases);
// Gauti konkretų pirkimą pagal ID
router.get('/:id', purchaseController_1.getPurchaseById);
// Sukurti naują pirkimą
router.post('/', purchaseController_1.createPurchase);
// Atnaujinti pirkimą
router.put('/:id', purchaseController_1.updatePurchase);
// Ištrinti pirkimą
router.delete('/:id', purchaseController_1.deletePurchase);
exports.default = router;
