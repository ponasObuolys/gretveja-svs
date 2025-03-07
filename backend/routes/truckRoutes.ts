import express from 'express';
import { getAllTrucks, getTruckById, createTruck, updateTruck, deleteTruck } from '../controllers/truckController';

const router = express.Router();

// Gauti visus vilkikus
router.get('/', getAllTrucks);

// Gauti vilkiką pagal ID
router.get('/:id', getTruckById);

// Sukurti naują vilkiką
router.post('/', createTruck);

// Atnaujinti vilkiką
router.put('/:id', updateTruck);

// Ištrinti vilkiką
router.delete('/:id', deleteTruck);

export default router; 