"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issuanceController_1 = require("../controllers/issuanceController");
const router = express_1.default.Router();
// Gauti visus išdavimus
router.get('/', issuanceController_1.getAllIssuances);
// Gauti konkretų išdavimą pagal ID
router.get('/:id', issuanceController_1.getIssuanceById);
// Sukurti naują išdavimą
router.post('/', issuanceController_1.createIssuance);
// Atnaujinti išdavimą
router.put('/:id', issuanceController_1.updateIssuance);
// Ištrinti išdavimą
router.delete('/:id', issuanceController_1.deleteIssuance);
// Generuoti PDF
router.get('/:id/pdf', issuanceController_1.generatePdf);
// Export routes
router.get('/export/csv', issuanceController_1.exportIssuancesToCsv);
router.get('/export/xlsx', issuanceController_1.exportIssuancesToXlsx);
router.get('/export/pdf', issuanceController_1.exportIssuancesToPdf);
exports.default = router;
