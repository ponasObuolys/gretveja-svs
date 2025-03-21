/**
 * Stocks routes
 */
const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

// GET all stocks
router.get('/', stocksController.getAllStocks);

// POST create new stock entry
router.post('/', stocksController.createStock);

// PUT update stock
router.put('/:id', stocksController.updateStock);

module.exports = router;
