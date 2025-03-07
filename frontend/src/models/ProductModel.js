import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * ProductModel - Klasė, valdanti produktų duomenis
 */
class ProductModel {
  /**
   * Gauna visų produktų sąrašą
   * @returns {Promise} Pažadas su produktų sąrašu
   */
  static async getAll() {
    try {
      const response = await axios.get('/api/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gauna vieną produktą pagal ID
   * @param {number} id - Produkto ID
   * @returns {Promise} Pažadas su produkto duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sukuria naują produktą
   * @param {Object} productData - Naujo produkto duomenys
   * @returns {Promise} Pažadas su sukurto produkto duomenimis
   */
  static async create(productData) {
    try {
      const response = await axios.post('/api/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atnaujina esamą produktą
   * @param {number} id - Produkto ID
   * @param {Object} productData - Atnaujinti produkto duomenys
   * @returns {Promise} Pažadas su atnaujinto produkto duomenimis
   */
  static async update(id, productData) {
    try {
      const response = await axios.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ištrina produktą
   * @param {number} id - Produkto ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductModel; 