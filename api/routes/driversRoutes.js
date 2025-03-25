/**
 * Drivers Routes
 * API endpoints for driver management
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');

/**
 * Get all drivers
 * Optional: include=company to include company details
 */
router.get('/', async (req, res) => {
  try {
    const includeCompany = req.query.include === 'company';
    
    let query = supabase.from('drivers').select('*');
    
    if (includeCompany) {
      query = query.select('*, companies(*)');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching drivers:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Get driver by ID
 * Optional: include=company to include company details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const includeCompany = req.query.include === 'company';
    
    let query = supabase.from('drivers').select('*').eq('id', id).single();
    
    if (includeCompany) {
      query = supabase.from('drivers').select('*, companies(*)').eq('id', id).single();
    }
    
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Driver not found' });
      }
      return res.status(500).json({ error: error.message });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new driver
 */
router.post('/', async (req, res) => {
  try {
    const { driver, company_id } = req.body;
    
    if (!driver) {
      return res.status(400).json({ error: 'Driver name is required' });
    }
    
    const { data, error } = await supabase
      .from('drivers')
      .insert([{ driver, company_id }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating driver:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Update a driver
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { driver, company_id } = req.body;
    
    if (!driver) {
      return res.status(400).json({ error: 'Driver name is required' });
    }
    
    const { data, error } = await supabase
      .from('drivers')
      .update({ driver, company_id })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating driver:', error);
      return res.status(500).json({ error: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a driver
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting driver:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
