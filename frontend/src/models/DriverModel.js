import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * Transforms driver data from backend (snake_case) to frontend (camelCase) format
 * @param {Object} driver - Driver data from backend
 * @returns {Object} Transformed driver data for frontend
 */
const transformDriverFromBackend = (driver) => {
  if (!driver) return null;
  
  return {
    id: driver.id,
    driver: driver.driver, // Using the 'driver' field as specified in requirements
    companyId: driver.companyId || driver.company_id,
    company: driver.company || null,
    createdAt: driver.createdAt || driver.created_at,
    updatedAt: driver.updatedAt || driver.updated_at
  };
};

/**
 * Transforms driver data from frontend (camelCase) to backend (snake_case) format
 * @param {Object} driver - Driver data from frontend
 * @returns {Object} Transformed driver data for backend
 */
const transformDriverToBackend = (driver) => {
  return {
    driver: driver.driver, // Using the 'driver' field as specified in requirements
    company_id: driver.companyId
  };
};

/**
 * DriverModel - Klasė, valdanti vairuotojų duomenis
 */
class DriverModel {
  /**
   * Gauna visų vairuotojų sąrašą
   * @param {Object} options - Užklausos parametrai (pvz., include)
   * @returns {Promise} Pažadas su vairuotojų sąrašu
   */
  static async getAll(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.include) {
        params.append('include', options.include);
      }
      
      const response = await axios.get(`/api/drivers?${params.toString()}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Unexpected response format:', response.data);
        return [];
      }
      
      return response.data.map(transformDriverFromBackend);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  /**
   * Gauna vieną vairuotoją pagal ID
   * @param {number} id - Vairuotojo ID
   * @returns {Promise} Pažadas su vairuotojo duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/drivers/${id}?include=company`);
      return transformDriverFromBackend(response.data);
    } catch (error) {
      console.error('Error fetching driver by ID:', error);
      throw error;
    }
  }

  /**
   * Sukuria naują vairuotoją
   * @param {Object} driverData - Naujo vairuotojo duomenys
   * @returns {Promise} Pažadas su sukurto vairuotojo duomenimis
   */
  static async create(driverData) {
    try {
      const backendData = transformDriverToBackend(driverData);
      const response = await axios.post('/api/drivers', backendData);
      return transformDriverFromBackend(response.data);
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  /**
   * Atnaujina esamą vairuotoją
   * @param {number} id - Vairuotojo ID
   * @param {Object} driverData - Atnaujinti vairuotojo duomenys
   * @returns {Promise} Pažadas su atnaujinto vairuotojo duomenimis
   */
  static async update(id, driverData) {
    try {
      const backendData = transformDriverToBackend(driverData);
      const response = await axios.put(`/api/drivers/${id}`, backendData);
      return transformDriverFromBackend(response.data);
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  }

  /**
   * Ištrina vairuotoją
   * @param {number} id - Vairuotojo ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  }
}

export default DriverModel;
