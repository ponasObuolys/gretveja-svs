import express from 'express';
import { getStockReport } from '../controllers/stockController';

const router = express.Router();

// Gauti atsargų ataskaitą
router.get('/', getStockReport);

export default router; 