import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * Transforms truck data from backend (snake_case) to frontend (camelCase) format
 * @param {Object} truck - Truck data from backend
 * @returns {Object} Transformed truck data for frontend
 */
const transformTruckFromBackend = (truck) => {
  if (!truck) return null;
  
  return {
    id: truck.id,
    plateNumber: truck.plateNumber || truck.plate_number,
    companyId: truck.companyId || truck.company_id,
    company: truck.company || null,
    createdAt: truck.createdAt || truck.created_at,
    updatedAt: truck.updatedAt || truck.updated_at
  };
};

/**
 * Transforms truck data from frontend (camelCase) to backend (snake_case) format
 * @param {Object} truck - Truck data from frontend
 * @returns {Object} Transformed truck data for backend
 */
const transformTruckToBackend = (truck) => {
  return {
    plate_number: truck.plateNumber,
    company_id: truck.companyId
  };
};

/**
 * TruckModel - Klasė, valdanti vilkikų duomenis
 */
class TruckModel {
  /**
   * Gauna visų vilkikų sąrašą
   * @param {Object} options - Užklausos parametrai (pvz., include)
   * @returns {Promise} Pažadas su vilkikų sąrašu
   */
  static async getAll(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.include) {
        params.append('include', options.include);
      }
      
      const response = await axios.get(`/api/trucks?${params.toString()}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Unexpected response format:', response.data);
        return [];
      }
      
      // Log the response data to see what we're getting
      console.log('Trucks API response:', response.data[0]);
      
      return response.data.map(transformTruckFromBackend);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      throw error;
    }
  }

  /**
   * Gauna vieną vilkiką pagal ID
   * @param {number} id - Vilkiko ID
   * @returns {Promise} Pažadas su vilkiko duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/trucks/${id}?include=company`);
      return transformTruckFromBackend(response.data);
    } catch (error) {
      console.error('Error fetching truck by ID:', error);
      throw error;
    }
  }

  /**
   * Sukuria naują vilkiką
   * @param {Object} truckData - Naujo vilkiko duomenys
   * @returns {Promise} Pažadas su sukurto vilkiko duomenimis
   */
  static async create(truckData) {
    try {
      const backendData = transformTruckToBackend(truckData);
      const response = await axios.post('/api/trucks', backendData);
      return transformTruckFromBackend(response.data);
    } catch (error) {
      console.error('Error creating truck:', error);
      throw error;
    }
  }

  /**
   * Atnaujina esamą vilkiką
   * @param {number} id - Vilkiko ID
   * @param {Object} truckData - Atnaujinti vilkiko duomenys
   * @returns {Promise} Pažadas su atnaujinto vilkiko duomenimis
   */
  static async update(id, truckData) {
    try {
      const backendData = transformTruckToBackend(truckData);
      const response = await axios.put(`/api/trucks/${id}`, backendData);
      return transformTruckFromBackend(response.data);
    } catch (error) {
      console.error('Error updating truck:', error);
      throw error;
    }
  }

  /**
   * Ištrina vilkiką
   * @param {number} id - Vilkiko ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/trucks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting truck:', error);
      throw error;
    }
  }
}

export default TruckModel;