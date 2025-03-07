import express from 'express';
import { getAllIssuances, getIssuanceById, createIssuance, updateIssuance, deleteIssuance, generatePdf } from '../controllers/issuanceController';

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

export default router; 