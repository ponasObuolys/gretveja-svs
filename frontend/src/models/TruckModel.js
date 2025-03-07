import axios from 'axios';
import { handleApiError } from '../utils/common';

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
    const params = new URLSearchParams();
    if (options.include) {
      params.append('include', options.include);
    }
    
    try {
      const response = await axios.get(`/api/trucks?${params.toString()}`);
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
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
      const response = await axios.post('/api/trucks', truckData);
      return response.data;
    } catch (error) {
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
      const response = await axios.put(`/api/trucks/${id}`, truckData);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }
}

export default TruckModel; 