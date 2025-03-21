/**
 * Issuances routes
 */
const express = require('express');
const router = express.Router();
const issuancesController = require('../controllers/issuancesController');

// GET all issuances
router.get('/', issuancesController.getAllIssuances);

// POST create new issuance
router.post('/', issuancesController.createIssuance);

// PUT update issuance
router.put('/:id', issuancesController.updateIssuance);

// DELETE issuance
router.delete('/:id', issuancesController.deleteIssuance);

module.exports = router;
