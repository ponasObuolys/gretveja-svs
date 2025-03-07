import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * CompanyModel - Klasė, valdanti įmonių duomenis
 */
class CompanyModel {
  /**
   * Gauna visų įmonių sąrašą
   * @returns {Promise} Pažadas su įmonių sąrašu
   */
  static async getAll() {
    try {
      const response = await axios.get('/api/companies');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gauna vieną įmonę pagal ID
   * @param {number} id - Įmonės ID
   * @returns {Promise} Pažadas su įmonės duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sukuria naują įmonę
   * @param {Object} companyData - Naujos įmonės duomenys
   * @returns {Promise} Pažadas su sukurtos įmonės duomenimis
   */
  static async create(companyData) {
    try {
      const response = await axios.post('/api/companies', companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atnaujina esamą įmonę
   * @param {number} id - Įmonės ID
   * @param {Object} companyData - Atnaujinti įmonės duomenys
   * @returns {Promise} Pažadas su atnaujintos įmonės duomenimis
   */
  static async update(id, companyData) {
    try {
      const response = await axios.put(`/api/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ištrina įmonę
   * @param {number} id - Įmonės ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default CompanyModel; 