import { Request, Response } from 'express';
import { Truck } from '../models/Truck';
import { Company } from '../models/Company';

// Gauti visus vilkikus
export const getAllTrucks = async (req: Request, res: Response) => {
  try {
    const include = req.query.include === 'company' ? [Company] : [];
    
    const trucks = await Truck.findAll({
      include,
      order: [['plateNumber', 'ASC']]
    });
    
    res.json(trucks);
  } catch (error) {
    console.error('Klaida gaunant vilkikus:', error);
    res.status(500).json({ message: 'Serverio klaida gaunant vilkikus' });
  }
};

// Gauti vilkiką pagal ID
export const getTruckById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const truck = await Truck.findByPk(id, {
      include: [Company]
    });
    
    if (!truck) {
      return res.status(404).json({ message: 'Vilkikas nerastas' });
    }
    
    res.json(truck);
  } catch (error) {
    console.error('Klaida gaunant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida gaunant vilkiką' });
  }
};

// Sukurti naują vilkiką
export const createTruck = async (req: Request, res: Response) => {
  try {
    const { plateNumber, model, companyId } = req.body;
    
    const truck = await Truck.create({
      plateNumber,
      model,
      companyId
    });
    
    res.status(201).json(truck);
  } catch (error) {
    console.error('Klaida kuriant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida kuriant vilkiką' });
  }
};

// Atnaujinti vilkiką
export const updateTruck = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plateNumber, model, companyId } = req.body;
    
    const truck = await Truck.findByPk(id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Vilkikas nerastas' });
    }
    
    await truck.update({
      plateNumber,
      model,
      companyId
    });
    
    res.json(truck);
  } catch (error) {
    console.error('Klaida atnaujinant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida atnaujinant vilkiką' });
  }
};

// Ištrinti vilkiką
export const deleteTruck = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const truck = await Truck.findByPk(id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Vilkikas nerastas' });
    }
    
    await truck.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Klaida ištrinant vilkiką:', error);
    res.status(500).json({ message: 'Serverio klaida ištrinant vilkiką' });
  }
}; 