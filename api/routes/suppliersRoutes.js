/**
 * Suppliers routes
 */
const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');

// GET all suppliers
router.get('/', suppliersController.getAllSuppliers);

// POST create new supplier
router.post('/', suppliersController.createSupplier);

// PUT update supplier
router.put('/:id', suppliersController.updateSupplier);

// DELETE supplier
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;
