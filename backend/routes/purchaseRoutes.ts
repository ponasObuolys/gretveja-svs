import express from 'express';
import { getAllPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase } from '../controllers/purchaseController';

const router = express.Router();

// Gauti visus pirkimus
router.get('/', getAllPurchases);

// Gauti konkretų pirkimą pagal ID
router.get('/:id', getPurchaseById);

// Sukurti naują pirkimą
router.post('/', createPurchase);

// Atnaujinti pirkimą
router.put('/:id', updatePurchase);

// Ištrinti pirkimą
router.delete('/:id', deletePurchase);

export default router; 