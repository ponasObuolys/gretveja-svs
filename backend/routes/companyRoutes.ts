import express from 'express';
import { Company } from '../models/Company';

const router = express.Router();

// Gauti visas įmones
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    return res.status(200).json(companies);
  } catch (error) {
    console.error('Klaida gaunant įmones:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant įmones' });
  }
});

// Gauti konkrečią įmonę pagal ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ message: 'Įmonė nerasta' });
    }
    
    return res.status(200).json(company);
  } catch (error) {
    console.error(`Klaida gaunant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant įmonę' });
  }
});

// Sukurti naują įmonę
router.post('/', async (req, res) => {
  const { name, code, vatCode } = req.body;
  
  try {
    const company = await Company.create({
      name,
      code,
      vatCode
    });
    
    return res.status(201).json(company);
  } catch (error) {
    console.error('Klaida kuriant įmonę:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant įmonę' });
  }
});

// Atnaujinti įmonę
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, code, vatCode } = req.body;
  
  try {
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ message: 'Įmonė nerasta' });
    }
    
    await company.update({
      name,
      code,
      vatCode
    });
    
    return res.status(200).json(company);
  } catch (error) {
    console.error(`Klaida atnaujinant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant įmonę' });
  }
});

// Ištrinti įmonę
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ message: 'Įmonė nerasta' });
    }
    
    await company.destroy();
    
    return res.status(200).json({ message: 'Įmonė sėkmingai ištrinta' });
  } catch (error) {
    console.error(`Klaida ištrinant įmonę ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant įmonę' });
  }
});

export default router; 