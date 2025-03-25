import axios from 'axios';
import { handleApiError } from '../utils/common';

// Get API base URL from environment variables or use default for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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
      const response = await axios.get(`${API_BASE_URL}/api/companies`);
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
      const response = await axios.get(`${API_BASE_URL}/api/companies/${id}`);
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
      const response = await axios.post(`${API_BASE_URL}/api/companies`, companyData);
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
      const response = await axios.put(`${API_BASE_URL}/api/companies/${id}`, companyData);
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
      const response = await axios.delete(`${API_BASE_URL}/api/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default CompanyModel;