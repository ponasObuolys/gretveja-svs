"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockController_1 = require("../controllers/stockController");
const router = express_1.default.Router();
// Gauti atsargų ataskaitą
router.get('/', stockController_1.getStockReport);
exports.default = router;
