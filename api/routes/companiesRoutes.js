/**
 * Companies routes
 */
const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companiesController');

// GET all companies
router.get('/', companiesController.getAllCompanies);

// POST create new company
router.post('/', companiesController.createCompany);

// PUT update company
router.put('/:id', companiesController.updateCompany);

// DELETE company
router.delete('/:id', companiesController.deleteCompany);

module.exports = router;
