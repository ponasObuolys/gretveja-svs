import express from 'express';
import { Supplier } from '../models/Supplier';

const router = express.Router();

// Gauti visus tiekėjus
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error('Klaida gaunant tiekėjus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant tiekėjus' });
  }
});

// Gauti konkretų tiekėją pagal ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Tiekėjas nerastas' });
    }
    
    return res.status(200).json(supplier);
  } catch (error) {
    console.error(`Klaida gaunant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant tiekėją' });
  }
});

// Sukurti naują tiekėją
router.post('/', async (req, res) => {
  const { name, contactPerson, phone, email } = req.body;
  
  try {
    const supplier = await Supplier.create({
      name,
      contactPerson,
      phone,
      email
    });
    
    return res.status(201).json(supplier);
  } catch (error) {
    console.error('Klaida kuriant tiekėją:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant tiekėją' });
  }
});

// Atnaujinti tiekėją
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, phone, email } = req.body;
  
  try {
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Tiekėjas nerastas' });
    }
    
    await supplier.update({
      name,
      contactPerson,
      phone,
      email
    });
    
    return res.status(200).json(supplier);
  } catch (error) {
    console.error(`Klaida atnaujinant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant tiekėją' });
  }
});

// Ištrinti tiekėją
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Tiekėjas nerastas' });
    }
    
    await supplier.destroy();
    
    return res.status(200).json({ message: 'Tiekėjas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant tiekėją ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant tiekėją' });
  }
});

export default router; 