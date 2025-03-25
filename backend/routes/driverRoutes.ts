import express from 'express';
import { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from '../controllers/driverController';

const router = express.Router();

// Get all drivers
router.get('/', getAllDrivers);

// Get driver by ID
router.get('/:id', getDriverById);

// Create a new driver
router.post('/', createDriver);

// Update driver
router.put('/:id', updateDriver);

// Delete driver
router.delete('/:id', deleteDriver);

export default router;
