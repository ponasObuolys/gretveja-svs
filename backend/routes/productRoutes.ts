import express from 'express';
import { Product } from '../models/Product';

const router = express.Router();

// Gauti visus produktus
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Klaida gaunant produktus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant produktus' });
  }
});

// Gauti konkretų produktą pagal ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Klaida gaunant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant produktą' });
  }
});

// Sukurti naują produktą
router.post('/', async (req, res) => {
  const { code, name, nameEn, nameRu, description, unit } = req.body;
  
  try {
    const product = await Product.create({
      code,
      name,
      nameEn,
      nameRu,
      description,
      unit
    });
    
    return res.status(201).json(product);
  } catch (error) {
    console.error('Klaida kuriant produktą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant produktą' });
  }
});

// Atnaujinti produktą
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, unit } = req.body;
  
  try {
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    
    await product.update({
      name,
      unit
    });
    
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Klaida atnaujinant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant produktą' });
  }
});

// Ištrinti produktą
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    
    await product.destroy();
    
    return res.status(200).json({ message: 'Produktas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant produktą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant produktą' });
  }
});

export default router; 