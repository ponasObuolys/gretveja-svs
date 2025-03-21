/**
 * Purchases routes
 */
const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');

// GET all purchases
router.get('/', purchasesController.getAllPurchases);

// POST create new purchase
router.post('/', purchasesController.createPurchase);

// PUT update purchase
router.put('/:id', purchasesController.updatePurchase);

// DELETE purchase
router.delete('/:id', purchasesController.deletePurchase);

module.exports = router;
