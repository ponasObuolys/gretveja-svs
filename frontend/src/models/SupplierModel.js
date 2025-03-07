import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * SupplierModel - Klasė, valdanti tiekėjų duomenis
 */
class SupplierModel {
  /**
   * Gauna visų tiekėjų sąrašą
   * @returns {Promise} Pažadas su tiekėjų sąrašu
   */
  static async getAll() {
    try {
      const response = await axios.get('/api/suppliers');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gauna vieną tiekėją pagal ID
   * @param {number} id - Tiekėjo ID
   * @returns {Promise} Pažadas su tiekėjo duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sukuria naują tiekėją
   * @param {Object} supplierData - Naujo tiekėjo duomenys
   * @returns {Promise} Pažadas su sukurto tiekėjo duomenimis
   */
  static async create(supplierData) {
    try {
      const response = await axios.post('/api/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atnaujina esamą tiekėją
   * @param {number} id - Tiekėjo ID
   * @param {Object} supplierData - Atnaujinti tiekėjo duomenys
   * @returns {Promise} Pažadas su atnaujinto tiekėjo duomenimis
   */
  static async update(id, supplierData) {
    try {
      const response = await axios.put(`/api/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ištrina tiekėją
   * @param {number} id - Tiekėjo ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default SupplierModel; 