/**
 * Products routes
 */
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAllProducts);

// POST create new product
router.post('/', productsController.createProduct);

// PUT update product
router.put('/:id', productsController.updateProduct);

// DELETE product
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
