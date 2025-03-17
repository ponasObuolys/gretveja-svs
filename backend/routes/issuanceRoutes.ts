import express from 'express';
import { 
  getAllIssuances, 
  getIssuanceById, 
  createIssuance, 
  updateIssuance, 
  deleteIssuance, 
  generatePdf,
  generatePdfEnglish,
  generatePdfRussian,
  exportIssuancesToCsv,
  exportIssuancesToXlsx,
  exportIssuancesToPdf
} from '../controllers/issuanceController';

const router = express.Router();

// Gauti visus išdavimus
router.get('/', getAllIssuances);

// Gauti konkretų išdavimą pagal ID
router.get('/:id', getIssuanceById);

// Sukurti naują išdavimą
router.post('/', createIssuance);

// Atnaujinti išdavimą
router.put('/:id', updateIssuance);

// Ištrinti išdavimą
router.delete('/:id', deleteIssuance);

// Generuoti PDF
router.get('/:id/pdf', generatePdf);

// Generuoti PDF anglų kalba
router.get('/:id/pdf/en', generatePdfEnglish);

// Generuoti PDF rusų kalba
router.get('/:id/pdf/ru', generatePdfRussian);

// Export routes
router.get('/export/csv', exportIssuancesToCsv);
router.get('/export/xlsx', exportIssuancesToXlsx);
router.get('/export/pdf', exportIssuancesToPdf);

export default router;