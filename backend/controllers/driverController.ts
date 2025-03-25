import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get all drivers
export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    // Try to query the drivers table directly
    const includeCompany = req.query.include === 'company';
    
    let query;
      
    if (includeCompany) {
      query = supabase
        .from('drivers')
        .select(`
          *,
          companies (id, name)
        `)
        .order('driver');
    } else {
      query = supabase
        .from('drivers')
        .select('*')
        .order('driver');
    }
    
    const { data, error } = await query;
    
    if (error) {
      // If the error is related to the table not existing, return an empty array
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Drivers table does not exist, returning empty array');
        return res.json([]);
      }
      console.error('Error in drivers query:', error);
      throw error;
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Error getting drivers:', error);
    res.status(500).json({ message: 'Server error while getting drivers' });
  }
};

// Get driver by ID
export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        companies (id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      // If the error is related to the table not existing, return 404
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        return res.status(404).json({ message: 'Driver not found' });
      }
      console.error('Error getting driver by ID:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error getting driver:', error);
    res.status(500).json({ message: 'Server error while getting driver' });
  }
};

// Create a new driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const { driver, company_id } = req.body;
    
    const { data, error } = await supabase
      .from('drivers')
      .insert([
        { 
          driver,
          company_id
        }
      ])
      .select()
      .single();
    
    if (error) {
      // If the error is related to the table not existing, return a more helpful error
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        return res.status(500).json({ 
          message: 'Drivers table does not exist. Please contact the administrator.' 
        });
      }
      console.error('Error creating driver:', error);
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Server error while creating driver' });
  }
};

// Update driver
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driver, company_id } = req.body;
    
    const { data, error } = await supabase
      .from('drivers')
      .update({ 
        driver,
        company_id,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      // If the error is related to the table not existing, return a more helpful error
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        return res.status(500).json({ 
          message: 'Drivers table does not exist. Please contact the administrator.' 
        });
      }
      console.error('Error updating driver:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'Server error while updating driver' });
  }
};

// Delete driver
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);
    
    if (error) {
      // If the error is related to the table not existing, return a more helpful error
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        return res.status(500).json({ 
          message: 'Drivers table does not exist. Please contact the administrator.' 
        });
      }
      console.error('Error deleting driver:', error);
      throw error;
    }
    
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Server error while deleting driver' });
  }
};
