/**
 * Trucks routes
 */
const express = require('express');
const router = express.Router();
const trucksController = require('../controllers/trucksController');

// GET all trucks
router.get('/', trucksController.getAllTrucks);

// POST create new truck
router.post('/', trucksController.createTruck);

// PUT update truck
router.put('/:id', trucksController.updateTruck);

// DELETE truck
router.delete('/:id', trucksController.deleteTruck);

module.exports = router;
